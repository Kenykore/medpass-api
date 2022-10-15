'use strict';
require('dotenv').config();
const fetch = require('node-fetch');
const moment = require('moment');
const _ = require('lodash');
const config = require('./../config/index');
const crypto = require('crypto');
const User = require('../models/users');
const Doctor = require('../models/doctor');
const cloudinary = require('cloudinary').v2;
const request = require('request-promise');
/** General utility functions used across the project */
const UtilityFunction = {
  /**
     * Helper function to string pad - add 00000 to the beginning of a number
     * @param   {number}  number  number to left pad - 000001
     * @return  {string}       padded string
     */
  addLeadingZeros(number) {
    return ('00000' + number).slice(-5);
  },

  async uploadFile(path, data) {
    try {
      if (data.image) {
        const file = await cloudinary.uploader.upload(data.file, {
          public_id: `${path}/${data._id}`,
          transformation: {
            fetch_format: 'auto',
            quality: 'auto'
          }
        });
        console.log(file.secure_url);
        return file.secure_url;
      }
      return '';
    } catch (error) {
      console.log(error);
    }
  },
  /**
 * generates a random string
 * @param   {number}  length  [length of string to be generated]
 * @return  {string}          [generated random string]
 */
  randomNumber(length) {
    return Math.floor(Math.pow(10, length - 1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1));
  },
  /**
     * Helper Function to retrieve user details from our auth service
     * @param   {String}  user_id  id of user to fetch
     * @param   {String}  key      specify field to return
     * @return  {Object}           user details object
     */
  async getUserDetails(user_id, key = null) {
    try {
      if (!user_id) return null;
      const user = await User.findById(user_id).select('-password -resetPasswordToken').lean();
      console.log(user, 'user');
      if (user) {
        if (key === null) return user;
        return user[`${key}`];
      }
      return {};
    } catch (error) {
      console.log('Error fetching user details', error);
    }
  },

};

module.exports = UtilityFunction;
