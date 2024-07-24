const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
const User = require('../models/user-model');

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.auth_token;

    if (!token) {
        return res.status(401).send({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, secret);
        const userId = decoded.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({message: "User not found"});
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).send({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;
