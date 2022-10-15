/* eslint-disable indent */
const status = require('http-status');
const Tokenizer = require('../utilities/tokeniztion');
const crypto = require('crypto');

// helper
const response = require('../utilities/response');

const Secure = {
    verifyUser(req, res, next) {
        let token = req.header('Authorization');
        if (!token) {
            return response.sendError({res, message: 'Authorization token not found', statusCode: status.UNAUTHORIZED});
        }

        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        } else {
            return response.sendError({res, message: 'Invalid authorization string. Token must start with Bearer', statusCode: status.UNAUTHORIZED});
        }

        try {
            const verified = Tokenizer.verifyToken(token);
            req.user_details = verified.data;
           return next();
        } catch (error) {
            return next(error);
        }
    },
};

module.exports = Secure;
