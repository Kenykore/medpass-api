'use strict';
require('dotenv').config();
const express = require('express');
const router = express.Router();

// middleware
const {verifyUser,} = require('../../../../middlewares/verify_auth');

const UserController = require('../../controllers/user');
router.get('/connected', verifyUser, UserController.fetchAllConnectedDoc);
router.get('/search', verifyUser, UserController.searchAllUsers);
module.exports = router;

