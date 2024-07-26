const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { type } = require('express/lib/response');

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    UTCDate: {type: Date, required: true, default: Date.now},
    amount: {type: Number, required: true},
    balance: {type: Number, required: true},
    transactionType: {type: String, required: true, enum: {values: ["balance", "bet"]}},
    betId: {type: String, required: false}
});

module.exports = mongoose.model('Transaction', transactionSchema);