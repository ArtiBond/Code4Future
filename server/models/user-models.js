const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    country: {type: String, required: true},
    role: {type: String, required: true},
    password: {type: String, required: true},
    teams: [{
        teamId: {type: Schema.Types.ObjectId, ref: 'Team'},
        tournamentId: {type: Schema.Types.ObjectId, ref: 'Tournament'},
        role: {type: String, enum: ['captain', 'member'], default: 'member'}
    }]
});

module.exports = model('User', userSchema);