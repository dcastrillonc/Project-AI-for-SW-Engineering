const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
    const token = req.cookies.auth_token;

    if (!token) {
        return res.status(401).send({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, secret);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).send({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;
