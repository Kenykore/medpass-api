'use strict';
require('dotenv').config();
const express = require('express');
const router = express.Router();

// middleware
const {verifyUser} = require('../../../../middlewares/verify_auth');

const HospitalController = require('../../controllers/hospital');
router.get('/', HospitalController.fetchAllHospitals);
router.post('/', verifyUser, HospitalController.createHospital);
router.delete('/:id', verifyUser, HospitalController.deleteHospital);
module.exports = router;
