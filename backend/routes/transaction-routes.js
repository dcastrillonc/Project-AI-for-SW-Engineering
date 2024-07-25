const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction-model');
const User = require('../models/user-model');
const WinLoseBet = require('../models/winlose-bet-model');
const ResultBet = require('../models/result-bet-model');
const authMiddleware = require('../middleware/auth-middleware');
const { getFixtureInfoById, WIN_BET, getResultBetStatus, getWinLoseBetStatus } = require('../utils/sportsApiUtils');

// Place balance transaction
router.post('/balance', authMiddleware, async (req, res) => {
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
            amount: amount,
            transactionType: "balance",
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

// Place bet cash transaction
router.post("/cash-bet", authMiddleware, async (req, res) => {
    try {
        const userId = req.user._id;
        const { betType, betId } = req.body;
        if(typeof betType !== "string" || typeof betId !== "string") {
            return res.status(400).send({message: "Bet type and ID must be strings"});
        }
        if(betType === "winlose") {
            const bet = await WinLoseBet.findById(betId);
            const user = await User.findById(userId);
            let fixture;
            if(bet.payed) {
                return res.status(400).send({message: "You have already cashed this bet"});
            }
            try {
                fixture = await getFixtureInfoById(bet.fixtureId);
            } catch(error) {
                return res.status(400).send({message: `Unable to fetch fixture with id ${bet.fixtureId}`});
            }
            const status = getWinLoseBetStatus(bet, fixture);
            if(status !== WIN_BET) {
                return res.status(400).send({message: `You have not won this bet`});
            }
            const newBalance = user.balance + (2 * bet.amount);
            user.balance = newBalance;
            const transaction = new Transaction({
                userId,
                balance: newBalance,
                amount: 2 * bet.amount,
                transactionType: "bet",
                betId: bet._id
            });

            transaction.save();

            bet.payed = true;
            await bet.save();
            await user.save();
            return res.status(200).send(transaction);
        } else if(betType === "result") {
            const bet = await ResultBet.findById(betId);
            const user = await User.findById(userId);
            let fixture;
            try {
                fixture = await getFixtureInfoById(bet.fixtureId);
            } catch(error) {
                return res.status(400).send({message: `Unable to fetch fixture with id ${bet.fixtureId}`});
            }
            const status = getResultBetStatus(bet, fixture);
            if(status !== WIN_BET) {
                return res.status(400).send({message: `You have not won this bet`});
            }
            const newBalance = user.balance + (2 * bet.amount);
            user.balance = newBalance;
            const transaction = new Transaction({
                userId,
                balance: newBalance,
                amount: 2 * bet.amount,
                transactionType: "bet",
                betId: bet._id
            });

            transaction.save();

            bet.payed = true;
            await bet.save();
            await user.save();
            return res.status(200).send(transaction);
        } else {
            return res.status(400).send({message: "Invalid bet type"});
        }
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