require('dotenv').config();
const { verify } = require('jsonwebtoken');
const { promisify } = require('util');
const jwtVerify = promisify(verify);

const { JWT_ENABLED, JWT_SECRET } = process.env;

module.exports = async (req, res, next) => {
    if (JWT_ENABLED === 'false') {
        return next();
    }
    const { authorization } = req.headers;
    if (!authorization) {
        const error = new Error('No authorization header provided');
        error.statusCode = 400;
        return next(error);
    }

    const token = authorization.replace('Bearer ', '');

    await jwtVerify(token, JWT_SECRET).catch(err => {
        const error = new Error('Malformed JWT');
        error.original = err;
        error.statusCode = 401;
        next(error);
    });

    // Access granted!
    return next();
};
