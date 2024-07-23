const sanitizeUserMiddleware = (req, res, next) => {
    if ('balance' in req.body) {
        delete req.body.balance;
    }

    if("resetPasswordToken" in req.body) {
        delete req.body.resetPasswordToken;
    }

    next();
};

module.exports = sanitizeUserMiddleware;
