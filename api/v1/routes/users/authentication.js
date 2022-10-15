'use strict';
require('dotenv').config();
const express = require('express');
const router = express.Router();

// middleware
const {verifyUser, verifyToken} = require('../../../../middlewares/verify_auth');

const AuthenticationController = require('../../controllers/authentication');


router.post('/', AuthenticationController.register);
router.post('/password/reset', AuthenticationController.resetPassword);
router.post('/password/forget', AuthenticationController.forgotPassword);
router.post('/password/reset/app', verifyUser, AuthenticationController.resetPasswordApp);
router.post('/login', AuthenticationController.login);
router.put('/', verifyUser, AuthenticationController.UpdateProfile);
router.get('/self', verifyUser, AuthenticationController.getSpecificUser);

module.exports = router;
