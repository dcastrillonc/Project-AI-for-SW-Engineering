const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction-model');
const User = require('../models/user-model');
const authMiddleware = require('../middleware/auth-middleware');

// Place transaction
router.post('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user._id;
        const { amount } = req.body;
        if(typeof amount !== "number") {
            return res.status(400).send({message: "Amount must be a number"});
        }

        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).send({message: "User not found"});
        }

        const newBalance = user.balance += amount;
        if(newBalance < 0) {
            return res.status(400).send({message: "Not enough funds to withdraw"});
        }

        const transaction = new Transaction({
            userId,
            balance: newBalance,
            amount: amount
        });

        await transaction.save();

        user.balance = newBalance;
        await user.save();


        res.status(200).send(transaction);


    } catch(error) {
        console.log(error);
        res.status(500).send({message: "Unexpected internal server error"});
    }
});

router.get("/", authMiddleware, async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
    
        if(!user) {
            return res.status(404).send({message: "User not found"});
        }
    
        const transactions = await Transaction.find({ userId:  user._id }).sort({ date: -1 });
    
        res.status(200).send(transactions);
    } catch(error) {
        console.log(error);
        res.status(500).send({message: "Unexpected internal server error"});
    }
});

module.exports = router;