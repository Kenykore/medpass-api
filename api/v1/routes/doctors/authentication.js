'use strict';
require('dotenv').config();
const express = require('express');
const router = express.Router();

// middleware
const {verifyUser, verifyToken} = require('../../../../middlewares/verify_auth');

const AuthenticationController = require('../../controllers/authentication');


router.post('/', AuthenticationController.registerDoc);
router.post('/password/reset/app', verifyUser, AuthenticationController.resetPasswordAppDoctor);
router.post('/login', AuthenticationController.loginDoc);
router.put('/', verifyUser, AuthenticationController.UpdateProfileDoc);
router.get('/self', verifyUser, AuthenticationController.getSpecificDoc);

module.exports = router;
