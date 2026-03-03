const { Schema, model } = require('mongoose');

const refreshTokenSchema = new moongoose.Schema({
    token: String,
    user: { 
        type: moongoose.Schema.Types.ObjectId, 
        ref: 'User' },
    refreshToken: { type: String, required: true }
});

module.exports = moongoose.model('RefreshToken', refreshTokenSchema);
