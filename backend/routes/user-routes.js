const express = require('express');
const router = express.Router();
const User = require('../models/user-model');
const authMiddleware = require('../middleware/auth-middleware');

// Create a new user
router.post('/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

// // Get all users
// router.get('/users', authMiddleware, async (req, res) => {
//     try {
//         const users = await User.find();
//         res.status(200).send(users);
//     } catch (error) {
//         res.status(500).send(error);
//     }
// });

// Get a user by ID
router.get('/users/:id', authMiddleware, async (req, res) => {
    try {
        if(req.userId !== req.params.id) {
            return res.status(401).send({ error: 'Unauthorized' });
        }
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update a user by ID
router.patch('/users/:id', authMiddleware, async (req, res) => {
    try {
        if(req.userId !== req.params.id) {
            return res.status(401).send({ error: 'Unauthorized' });
        }
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).send();
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete a user by ID
router.delete('/users/:id', authMiddleware, async (req, res) => {
    try {
        if(req.userId !== req.params.id) {
            return res.status(401).send({ error: 'Unauthorized' });
        }
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
