const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user-model');
const sendEmail = require("../utils/email")

const router = express.Router();

const secret = process.env.JWT_SECRET;

// Login route
router.post('/login', async (req, res) => {
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

// Dummy login
router.post('/dummy-login', async (req, res) => {
    try {
        // const { email, password } = req.body;

        const users = await User.find();

        if(users.length === 0) {
            return res.status(401).send({message: "No users registered"});
        }

        const user = users[0];
        const token = jwt.sign({ userId: user._id }, secret, { expiresIn: '1h' });
        res.cookie('auth_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        return res.status(200).send({ message: 'Dummy login successful' });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

// Logout route
router.post('/logout', (req, res) => {
    res.clearCookie('auth_token');
    res.status(200).send({ message: 'Logged out successfully' });
});

// Forgot password route
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            const secret = process.env.PASSWORD_RESET_JWT_SECRET;
            const token = jwt.sign({prUserId: user._id}, secret, {expiresIn: "1h"});
            user.resetPasswordToken = token;

            await user.save();
    
            const resetUrl = `http://localhost:3000/reset-password?t=${token}`;
            const message = "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
                            "Please click on the following link, or paste this into your browser to complete the process:\n\n" + 
                            `${resetUrl}\n\n` +
                            "Note that the link is valid for 1 hour.\n\n" + 
                            "If you did not request this, please ignore this email.\n";
    
            await sendEmail(user.email, 'BetSmart Password Reset', message);
        }

        res.status(200).send({ message: 'If a user exists with the provided email, the reset password email was sent' });
    } catch (error) {
        console.log(error);
        res.status(500).send({message: "Unexpected internal server error"});
    }
});

// Reset password route
router.post('/reset-password', async (req, res) => {
    try {
        const { token, password } = req.body;
        const secret = process.env.PASSWORD_RESET_JWT_SECRET;
        
        let decoded;
        try {
            decoded = jwt.verify(token, secret);
        } catch(error) {
            console.log(error);
            return res.status(401).send({message: "Invalid or expired token"});
        }

        if(!decoded.prUserId) {
            return res.status(401).send({message: "Invalid or expired token"});
        }
        
        const user = await User.findById(decoded.prUserId);

        if(!user || user.resetPasswordToken !== token) {
            return res.status(401).send({message: "Invalid or expired token"});
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        await user.save();

        res.status(200).send({ message: 'Password has been reset' });
    } catch (error) {
        res.status(500).send(error);
    }
});



module.exports = router;
