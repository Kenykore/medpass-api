const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const moment = require('moment');
const Schema = require('mongoose').Schema;
const ObjectId = Schema.Types.ObjectId;

const Doctor = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },
  mobile: {
    type: String,
    unique: true
  },
  extension: {
    type: String,
    default: '234'
  },
  raw_mobile: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    default: 'Ibadan'
  },
  country: {
    type: String,
    default: 'Nigeria'
  },
  qualificationLevel: {
    type: String,
    default: 'MBBS',
  },
  hospital: {
    type: ObjectId,
    ref: 'Hospital'
  },
  hospitalId: String,
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String, default: 'MedPass'
  },
  lastName: {
    type: String,
    default: 'MedPass'
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
  profilePic: {
    type: String,
  },
  activated: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: true
});
// AdminSchema.pre('save', function (next) {
//     var user = this;
//     var SALT_FACTOR = 5;
//     if (!user.isModified('password')) {
//         return next();
//     }
//     bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
//         if (err) {
//             return next(err)
//         }
//         bcrypt.hash(user.password, salt, null, function (err, hash) {
//             if (err) {
//                 return next(err)
//             }
//             user.password = hash;
//             next()
//         })
//     })
// })

// Admin.methods.comparePassword = function (passwordAttempt, cb) {

//     bcrypt.compare(passwordAttempt, this.password, function (err, isMatch) {

//         if (err) {
//             return cb(err);
//         } else {
//             cb(null, isMatch);
//         }
//     });

// }

module.exports = mongoose.model('Doctor', Doctor);
