const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const resultBetSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    fixtureId: {type: Number, required: true, min: 0},
    amount: {type: Number, required: true, min: 1},
    homeTeamName: {type: String},
    awayTeamName: {type: String},
    homeScore: {type: Number, required: true, min: 0},
    awayScore: {type: Number, required: true, min: 0},
    UTCDate: {type: Date, required: true, default: Date.now},
    payed: {type: Boolean, required: true, default: false},
});

module.exports = mongoose.model('ResultBet', resultBetSchema);
