require('dotenv').config();
const { sign } = require('jsonwebtoken');
const router = require('express').Router();

const { JWT_SECRET, JWT_PASSWORD } = process.env;

router.post('/', (req, res, next) => {
    const { password } = req.body;
    if (!password) {
        const err = new Error('No password provided');
        err.statusCode = 400;
        return next(err);
    }
    if (password !== JWT_PASSWORD) {
        const err = new Error('Inavlid password');
        err.statusCode = 403;
        return next(err);
    }

    const token = sign({ date: new Date(), ip: req.ip }, JWT_SECRET);
    res.json({ token });
});

module.exports = router;
