'use strict';
require('dotenv').config();
const express = require('express');
const router = express.Router();

// middleware
const {verifyUser} = require('../../../middlewares/verify_auth');

// Record Controller
const RecordController = require('../controllers/record');
router.get('/user', verifyUser, RecordController.fetchAllRecordsUser);
router.get('/doctor', verifyUser, RecordController.fetchAllRecordsByDoc);
router.get('/user/requests', verifyUser, RecordController.fetchAllRecordsRequest);
router.get('/doc/requests', verifyUser, RecordController.fetchAllRecordsRequestByDoc);
router.post('/', verifyUser, RecordController.createRecord);
router.post('/request', verifyUser, RecordController.createRecordRequest);
router.put('/request/acceptance', verifyUser, RecordController.updateRecordRequestStatus);
router.put('/:id', verifyUser, RecordController.updateRecord);
router.get('/:id', verifyUser, RecordController.getSingleRecord);

module.exports = router;
