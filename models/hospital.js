const Schema = require('mongoose').Schema;
const ObjectId = Schema.Types.ObjectId;
const mongoose = require('mongoose');
const HospitalSchema = new mongoose.Schema({
  name: String,
  hospitalType: {
    type: String,
    enum: ['private', 'public', 'phc'],
  },
  address: {
    lat: Number,
    lng: Number,
    name: String,
  },
  city: String,
  country: String,
}, {
  timestamps: true
});

module.exports = mongoose.model('Hospital', HospitalSchema);
