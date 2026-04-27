const express = require('express');
const mongoose = require('mongoose');
const Team = require('../models/team-models');
const User = require('../models/user-models');

const router = express.Router();

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// Отримати всі команди турніру
router.get('/tournament/:tournamentId', async (req, res, next) => {
  try {
    const { tournamentId } = req.params;

    if (!isValidObjectId(tournamentId)) {
      return res.status(400).json({
        ok: false,
        message: 'Некоректний tournamentId'
      });
    }

    const teams = await Team.find({ tournamentId }).sort({ createdAt: -1 });

    return res.json({
      ok: true,
      teams
    });
  } catch (e) {
    next(e);
  }
});

// Створити команду
router.post('/', async (req, res, next) => {
  try {
    const { tournamentId, teamName, captain, members, city, country } = req.body;

    if (!tournamentId || !isValidObjectId(tournamentId)) {
      return res.status(400).json({
        ok: false,
        message: 'Некоректний tournamentId'
      });
    }

    if (!teamName || !teamName.trim()) {
      return res.status(400).json({
        ok: false,
        message: 'Вкажіть назву команди'
      });
    }

    if (!captain || !captain.fullName || !captain.fullName.trim()) {
      return res.status(400).json({
        ok: false,
        message: 'Вкажіть ПІБ капітана'
      });
    }

    const cleanMembers = Array.isArray(members)
      ? members
          .map((m) => ({
            fullName: (m.fullName || '').trim(),
            email: (m.email || '').trim(),
            school: (m.school || '').trim(),
            className: (m.className || '').trim()
          }))
          .filter((m) => m.fullName)
      : [];

    const team = await Team.create({
      tournamentId,
      teamName: teamName.trim(),
      captain: {
        fullName: (captain.fullName || '').trim(),
        email: (captain.email || '').trim(),
        telegram: (captain.telegram || '').trim(),
        school: (captain.school || '').trim(),
        className: (captain.className || '').trim()
      },
      members: cleanMembers,
      city: (city || '').trim(),
      country: (country || '').trim()
    });

    // Update users with team info
    if (captain.email) {
      await User.findOneAndUpdate(
        { email: captain.email },
        { $addToSet: { teams: { teamId: team._id, tournamentId, role: 'captain' } } }
      );
    }

    for (const member of cleanMembers) {
      if (member.email) {
        await User.findOneAndUpdate(
          { email: member.email },
          { $addToSet: { teams: { teamId: team._id, tournamentId, role: 'member' } } }
        );
      }
    }

    return res.json({
      ok: true,
      team
    });
  } catch (e) {
    next(e);
  }
});

// Оновити команду
router.put('/:teamId', async (req, res, next) => {
  try {
    const { teamId } = req.params;
    const { teamName, captain, members, city, country } = req.body;

    if (!isValidObjectId(teamId)) {
      return res.status(400).json({
        ok: false,
        message: 'Некоректний teamId'
      });
    }

    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({
        ok: false,
        message: 'Команду не знайдено'
      });
    }

    if (!teamName || !teamName.trim()) {
      return res.status(400).json({
        ok: false,
        message: 'Вкажіть назву команди'
      });
    }

    if (!captain || !captain.fullName || !captain.fullName.trim()) {
      return res.status(400).json({
        ok: false,
        message: 'Вкажіть ПІБ капітана'
      });
    }

    // Remove old team info from users
    if (team.captain.email) {
      await User.findOneAndUpdate(
        { email: team.captain.email },
        { $pull: { teams: { teamId: team._id } } }
      );
    }

    for (const member of team.members) {
      if (member.email) {
        await User.findOneAndUpdate(
          { email: member.email },
          { $pull: { teams: { teamId: team._id } } }
        );
      }
    }

    team.teamName = teamName.trim();
    team.captain = {
      fullName: (captain.fullName || '').trim(),
      email: (captain.email || '').trim(),
      telegram: (captain.telegram || '').trim(),
      school: (captain.school || '').trim(),
      className: (captain.className || '').trim()
    };
    team.members = Array.isArray(members)
      ? members
          .map((m) => ({
            fullName: (m.fullName || '').trim(),
            email: (m.email || '').trim(),
            school: (m.school || '').trim(),
            className: (m.className || '').trim()
          }))
          .filter((m) => m.fullName)
      : [];
    team.city = (city || '').trim();
    team.country = (country || '').trim();

    await team.save();

    // Add new team info to users
    if (team.captain.email) {
      await User.findOneAndUpdate(
        { email: team.captain.email },
        { $addToSet: { teams: { teamId: team._id, tournamentId: team.tournamentId, role: 'captain' } } }
      );
    }

    for (const member of team.members) {
      if (member.email) {
        await User.findOneAndUpdate(
          { email: member.email },
          { $addToSet: { teams: { teamId: team._id, tournamentId: team.tournamentId, role: 'member' } } }
        );
      }
    }

    return res.json({
      ok: true,
      team
    });
  } catch (e) {
    next(e);
  }
});

// Видалити команду
router.delete('/:teamId', async (req, res, next) => {
  try {
    const { teamId } = req.params;

    if (!isValidObjectId(teamId)) {
      return res.status(400).json({
        ok: false,
        message: 'Некоректний teamId'
      });
    }

    const deleted = await Team.findByIdAndDelete(teamId);

    if (!deleted) {
      return res.status(404).json({
        ok: false,
        message: 'Команду не знайдено'
      });
    }

    // Remove team info from users
    if (deleted.captain.email) {
      await User.findOneAndUpdate(
        { email: deleted.captain.email },
        { $pull: { teams: { teamId: deleted._id } } }
      );
    }

    for (const member of deleted.members) {
      if (member.email) {
        await User.findOneAndUpdate(
          { email: member.email },
          { $pull: { teams: { teamId: deleted._id } } }
        );
      }
    }

    return res.json({
      ok: true,
      message: 'Команду видалено'
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
