const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user-model');

const router = express.Router();

const secret = process.env.JWT_SECRET;

// Login route
router.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).send({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user._id }, secret, { expiresIn: '1h' });
        res.cookie('auth_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.status(200).send({ message: 'Login successful' });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

// Logout route
router.post('/auth/logout', (req, res) => {
    res.clearCookie('auth_token');
    res.status(200).send({ message: 'Logged out successfully' });
});

module.exports = router;
