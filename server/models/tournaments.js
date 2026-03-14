const mongoose = require("mongoose");

const TournamentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },

    regOpen: { type: Date, default: null },
    regClose: { type: Date, default: null },

    maxTeams: { type: Number, default: 50, min: 1 },

    status: {
      type: String,
      enum: ["draft", "registration", "running", "finished"],
      default: "draft",
    },

    startTournament: { type: Date, default: null },
    endTournament: { type: Date, default: null },

    jury: { type: String, default: "" }, // поки просто текст
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tournament", TournamentSchema);