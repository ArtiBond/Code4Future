const Router = require('express').Router;
const router = new Router();
const Tournament = require('../models/tournaments');



async function updateTournamentStatus(tournament) {
  const now = new Date();
  let needsUpdate = false;


  if (tournament.endTournament && now > tournament.endTournament) {
    tournament.status = 'finished';
    needsUpdate = true;
  } else if (tournament.startTournament && now >= tournament.startTournament) {
    tournament.status = 'running';
    needsUpdate = true;
  } else if (tournament.regOpen && now >= tournament.regOpen) {
    tournament.status = 'registration';
    needsUpdate = true;
  }


  if (needsUpdate) {
    await tournament.save();
  }

  return tournament;
}


// CREATE
router.post('/', async (req, res, next) => {
  try {
    const tournament = await Tournament.create(req.body);
    return res.status(201).json(tournament);
  } catch (e) {
    next(e);
  }
});


// GET ALL
router.get('/', async (req, res, next) => {
  try {
    const tournaments = await Tournament.find().sort({ createdAt: -1 });

  
    const updatedTournaments = await Promise.all(
      tournaments.map(tournament => updateTournamentStatus(tournament))
    );

    return res.json(updatedTournaments);
  } catch (e) {
    next(e);
  }
});


// GET ONE
router.get('/:id', async (req, res, next) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    const updatedTournament = await updateTournamentStatus(tournament);

    return res.json(updatedTournament);
  } catch (e) {
    next(e);
  }
});


// DELETE
router.delete('/:id', async (req, res, next) => {
  try {
    await Tournament.findByIdAndDelete(req.params.id);
    return res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});


// UPDATE
router.patch('/:id', async (req, res, next) => {
  try {
    const updated = await Tournament.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    return res.json(updated);
  } catch (e) {
    next(e);
  }
});

router.post('/:id/update-status', async (req, res, next) => {
  
});

module.exports = router;