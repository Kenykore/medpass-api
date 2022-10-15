const Schema = require('mongoose').Schema;
const ObjectId = Schema.Types.ObjectId;
const mongoose = require('mongoose');
const RecordSchema = new mongoose.Schema({
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
  files: [{
    type: String,
    file: String
  }],
  comments: {
    type: String,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Record', RecordSchema);
