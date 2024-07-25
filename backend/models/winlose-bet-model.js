const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const winLoseBetSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    fixtureId: {type: Number, required: true, min: 0},
    amount: {type: Number, required: true, min: 1},
    homeTeamName: {type: String},
    awayTeamName: {type: String}, 
    winTeam: {type: String, required: true, enum: {values: ["home", "away"]}},
    UTCDate: {type: Date, required: true, default: Date.now},
    payed: {type: Boolean, required: true, default: false},
});

module.exports = mongoose.model('WinLoseBet', winLoseBetSchema);
