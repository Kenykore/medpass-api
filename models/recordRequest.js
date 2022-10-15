const Schema = require('mongoose').Schema;
const mongoose = require('mongoose');
const moment = require('moment');
const ObjectId = Schema.Types.ObjectId;

const RecordRequestModel = new mongoose.Schema({
  user: {
    type: ObjectId,
    ref: 'User'
  },
  userId: String,
  doctorId: String,
  doctor: {
    type: ObjectId,
    ref: 'Doctor'
  },
  statusTracker: [{
    status: String,
    time: Date,
  }],
  status: {
    type: String,
    default: 'pending',
    enum: ['accepted', 'rejected', 'pending'],
  }
}, {
  timestamps: true
});


module.exports = mongoose.model('RecordRequesy', RecordRequestModel);


