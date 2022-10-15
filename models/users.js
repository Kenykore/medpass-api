const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const ObjectId = mongoose.Schema.Types.ObjectId;

const moment = require('moment');
const userModel = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },
  dob: Date,
  gender: {
    type: String,
    default: 'male',
  },
  city: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  parent_id: String,
  userType: {
    type: String,
    enum: ['individual',],
    default: 'individual',
    required: true
  },
  password: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true
  },
  extension: {
    type: String,
    default: '234'
  },
  raw_mobile: {
    type: String,
    default: ''
  },
  firstName: {
    type: String, default: 'Comestibles'

  },
  lastName: {
    type: String,
    default: 'Comestibles'
  },
  address: {
    lat: Number,
    lng: Number,
    name: String,
  },
  deviceToken: [''],
  resetPasswordToken: {
    type: String,
    default: 'adddddsbjugsj'
  },
  resetPasswordExpires: Date,
  marketingChannel: String,
  profilePic: {
    type: String,
  },
  activated: {
    type: Boolean,
    default: true
  },
  channel: {
    type: String,
    default: 'web',
    enum: ['web', 'app', 'whatsapp']
  },
  revokedDoctors: [String],
  approvedDoctors: [String]

}, {
  timestamps: true
});
module.exports = mongoose.model('user', userModel);


