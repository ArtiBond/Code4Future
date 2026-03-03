const Router = require('express').Router;
const router = new Router();
const Tournament = require('../models/tournaments');


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
    return res.json(tournaments);
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

module.exports = router;