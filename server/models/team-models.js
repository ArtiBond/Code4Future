const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
  {
    fullName: { type: String, trim: true, default: '' },
    email: { type: String, trim: true, default: '' },
    school: { type: String, trim: true, default: '' },
    className: { type: String, trim: true, default: '' }
  },
  { _id: false }
);

const teamSchema = new mongoose.Schema(
  {
    tournamentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Tournament'
    },
    teamName: {
      type: String,
      required: true,
      trim: true
    },
    captain: {
      fullName: { type: String, trim: true, required: true },
      email: { type: String, trim: true, default: '' },
      telegram: { type: String, trim: true, default: '' },
      school: { type: String, trim: true, default: '' },
      className: { type: String, trim: true, default: '' }
    },
    members: {
      type: [memberSchema],
      default: []
    },
    city: {
      type: String,
      trim: true,
      default: ''
    },
    country: {
      type: String,
      trim: true,
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Team', teamSchema);
