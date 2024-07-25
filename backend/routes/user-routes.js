const express = require('express');
const router = express.Router();
const User = require('../models/user-model');
const authMiddleware = require('../middleware/auth-middleware');

// Create a new user
router.post('/', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});


// Get a user by ID
router.get('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send();
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update a user by ID
router.put('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findByIdAndUpdate(userId, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).send();
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete a user by ID
router.delete('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).send();
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
