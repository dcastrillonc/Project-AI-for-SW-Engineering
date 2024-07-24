const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const winLoseBetSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    fixtureId: {type: Number, required: true},
    amount: {type: Number, required: true},
    winTeam: {type: String, required: true},
    UTCDate: {type: Date, required: true, default: Date.now},
    payed: {type: Boolean, required: true, default: false},
});

module.exports = mongoose.model('WinLoseBet', winLoseBetSchema);
