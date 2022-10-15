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
  hospital: {
    type: ObjectId,
    ref: 'Hospital'
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
RecordSchema.pre('find', function() {
  this.populate('hospital user doctor');
});
RecordSchema.pre('findOne', function() {
  this.populate('hospital user doctor');
});
module.exports = mongoose.model('Record', RecordSchema);
