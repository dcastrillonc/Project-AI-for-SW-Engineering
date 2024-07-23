// middleware/preventBalanceUpdate.js
const removeBalanceMiddleware = (req, res, next) => {
    if ('balance' in req.body) {
        delete req.body.balance;
    }
    next();
};

module.exports = removeBalanceMiddleware;
