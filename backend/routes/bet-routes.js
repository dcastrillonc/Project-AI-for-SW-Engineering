const express = require('express');
const router = express.Router();
const User = require('../models/user-model');
const WinLoseBet = require('../models/winlose-bet-model');
const ResultBet = require('../models/result-bet-model');
const authMiddleware = require('../middleware/auth-middleware');


// Place WinLoseBet
router.post("/winlose", authMiddleware, async (req, res) => {

    try {
        try {
            const winLoseBetObj = { userId: req.user._id, ...req.body};
            const winLoseBet = new WinLoseBet(winLoseBetObj);
            if(!Number.isInteger(winLoseBet.fixtureId)) {
                return res.status(400).send({message: "fixtureId must be an integer"});
            }
            if(winLoseBet.amount < 1) {
                return res.status(400).send({message: "Minimmum betting ammount is $1"});
            }
            const user = await User.findById(req.user._id);
            const newBalance = user.balance - winLoseBet.amount;
            if(newBalance < 0) {
                return res.status(400).send({message: "Insufficient funds"});
            }
            await winLoseBet.save();
            user.balance = newBalance;
            await user.save();
            return res.status(201).send(winLoseBet);
        } catch(error) {
            return res.status(400).send(error);
        }
    } catch (error) {
        return res.status(500).send({message: "Internal server error"});
    }
});

router.get("/winlose", authMiddleware, async (req, res) => {
    try {
        const winLoseBets = await WinLoseBet.find({ userId: req.user._id });
        return res.status(200).send(winLoseBets);
    } catch (error) {
        return res.status(500).send({message: "Internal server error"});
    }
});

router.get("/winlose/:id", authMiddleware, async (req, res) => {
    try {
        const winLoseBet = await WinLoseBet.findById(req.params.id);
        if(!winLoseBet) {
            return res.status(404).send({message: "WinLoseBet not found"});
        }
        if(winLoseBet.userId.toString() !== req.user._id.toString()) {
            return res.status(401).send({message: "Unauthorized"});
        }
        return res.status(200).send(winLoseBet);
    } catch (error) {
        console.log(error);
        return res.status(500).send({message: "Internal server error"});
    }
});

// Placae result bet
router.post("/result", authMiddleware, async (req, res) => {
    try {
        const resultBet = new ResultBet({ userId: req.user._id, ...req.body});
        if(!Number.isInteger(resultBet.fixtureId)) {
            return res.status(400).send({message: "fixtureId must be an integer"});
        }
        if(resultBet.amount < 1) {
            return res.status(400).send({message: "Minimmum betting ammount is $1"});
        }
        if(!Number.isInteger(resultBet.homeScore) || !Number.isInteger(resultBet.awayScore)) {
            return res.status(400).send({message: "Scores must be integers"});
        }
        if(resultBet.homeScore < 0 || resultBet.awayScore < 0) {
            return res.status(400).send({message: "Scores must be non-negative integers"});
        }
        const user = await User.findById(req.user._id);
        const newBalance = user.balance - resultBet.amount;
        if(newBalance < 0) {
            return res.status(400).send({message: "Insufficient funds"});
        }
        await resultBet.save();
        user.balance = newBalance;
        await user.save();
        return res.status(201).send(resultBet);
    } catch (error) {
        return res.status(400).send(error);
    }
});

router.get("/result", authMiddleware, async (req, res) => {
    try {
        const resultBets = await ResultBet.find({ userId: req.user._id });
        return res.status(200).send(resultBets);
    } catch (error) {
        return res.status(500).send({message: "Internal server error"});
    }
});

router.get("/result/:id", authMiddleware, async (req, res) => {
    try {
        const resultBet = await ResultBet.findById(req.params.id);
        if(!resultBet) {
            return res.status(404).send({message: "ResultBet not found"});
        }
        if(resultBet.userId.toString() !== req.user._id.toString()) {
            return res.status(401).send({message: "Unauthorized"});
        }
        return res.status(200).send(resultBet);
    } catch (error) {
        return res.status(500).send({message: "Internal server error"});
    }
});

module.exports = router;
