/* eslint-disable no-unreachable */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const status = require('http-status');
const User = require('../../../models/users');
const Doctor = require('../../../models/doctor');
const crypto = require('crypto');
const lodash = require('lodash');

const Tokenizer = require('../../../utilities/tokeniztion');
const {randomNumber} = require('../../../utilities/utils');
const response = require('../../../utilities/response');
const config = require('../../../config/index');
const moment = require('moment');
const ObjectID = require('mongoose').Types.ObjectId;

exports.login = async function(req, res, next) {
  try {
    const email = req.body.email || req.body.mobile;
    const password = req.body.password;
    const user = await User.findOne({$or: [{email: email}, {mobile: email}]}).lean();
    if (!user) {
      return response.sendError({
        res,
        message: 'Login failed. Invalid email address or mobile number',
        statusCode: status.NOT_FOUND
      });
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );
    if (!isPasswordValid) {
      return response.sendError({
        res,
        message: 'Login failed. Invalid password'
      });
    }
    if (!user.activated) {
      return response.sendError({
        res,
        statusCode: status.UNAUTHORIZED,
        message: 'Login failed. Your account has not been verified or is disabled'
      });
    }
    delete user.password;
    delete user.resetPasswordExpires;
    delete user.resetPasswordToken;
    console.log(user, 'user');
    const accessToken = Tokenizer.signToken({
      ...user,
      user_id: user._id
    });
    return response.sendSuccess({
      res,
      message: 'Login successful',
      body: {_token: accessToken}
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

exports.loginDoc = async function(req, res, next) {
  try {
    const email = req.body.email || req.body.mobile;
    const password = req.body.password;
    const user = await Doctor.findOne({$or: [{email: email}, {mobile: email}]}).lean();
    if (!user) {
      return response.sendError({
        res,
        message: 'Login failed. Invalid email address or mobile number',
        statusCode: status.NOT_FOUND
      });
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );
    if (!isPasswordValid) {
      return response.sendError({
        res,
        message: 'Login failed. Invalid password'
      });
    }
    if (!user.activated) {
      return response.sendError({
        res,
        statusCode: status.UNAUTHORIZED,
        message: 'Login failed. Your account has not been verified or is disabled'
      });
    }
    delete user.password;
    delete user.resetPasswordExpires;
    delete user.resetPasswordToken;
    console.log(user, 'user');
    const accessToken = Tokenizer.signToken({
      ...user,
      user_id: user._id
    });
    return response.sendSuccess({
      res,
      message: 'Login successful',
      body: {_token: accessToken,}
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
exports.register = async function(req, res, next) {
  try {
    const email = req.body.email;
    const mobile = req.body.mobile;
    const password = req.body.password;
    if (!email || !mobile) {
      return response.sendError({res, statusCode: status.UNAUTHORIZED, message: 'You must enter an email address'});
      // return res.status(422).send({error: 'You must enter an email address'});
    }
    if (!password) {
      return response.sendError({res, statusCode: status.UNAUTHORIZED, message: 'You must enter a password'});
    }
    const userExist = await User.findOne({$or: [{email: req.body.email}, {mobile: req.body.email}]});
    if (userExist) {
      return response.sendError({
        res,
        message: 'User account already exists'
      });
    }
    const salt = await bcrypt.genSalt(10);
    delete req.body.password;
    const user = await User.create({
      password: await bcrypt.hash(password, salt),
      ...req.body
    });
    console.log('created user', user);
    const responseData = user.toObject();
    delete responseData.password;
    delete responseData.resetPasswordToken;
    delete responseData.resetPasswordExpires;
    const accessToken = Tokenizer.signToken({...responseData, user_id: user._id});
    return response.sendSuccess({res, message: 'Account creation successful', body: {data: responseData, _token: accessToken}});
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

exports.registerDoc = async function(req, res, next) {
  try {
    const email = req.body.email;
    const mobile = req.body.mobile;
    const password = req.body.password;
    if (!email || !mobile) {
      return response.sendError({res, statusCode: status.UNAUTHORIZED, message: 'You must enter an email address'});
      // return res.status(422).send({error: 'You must enter an email address'});
    }
    if (!password) {
      return response.sendError({res, statusCode: status.UNAUTHORIZED, message: 'You must enter a password'});
    }
    const userExist = await Doctor.findOne({$or: [{email: req.body.email}, {mobile: req.body.email}]});
    if (userExist) {
      return response.sendError({
        res,
        message: 'User account already exists'
      });
    }
    const salt = await bcrypt.genSalt(10);
    delete req.body.password;
    const user = await Doctor.create({
      password: await bcrypt.hash(password, salt),
      ...req.body,
      hospital: ObjectID(req.body.hospitalId)
    });
    console.log('created user', user);
    const responseData = user.toObject();
    delete responseData.password;
    delete responseData.resetPasswordToken;
    delete responseData.resetPasswordExpires;
    const accessToken = Tokenizer.signToken({...responseData, user_id: user._id});
    return response.sendSuccess({res, message: 'Account creation successful', body: {data: responseData, _token: accessToken}});
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
exports.forgotPassword = async function(req, res, next) {
  try {
    const checkEmail = await User.findOne({$or: [{email: req.body.email}, {mobile: req.body.email}]});
    if (!checkEmail) {
      return response.sendError({
        res,
        message: 'Invalid email address or mobile number',
        statusCode: status.NOT_FOUND
      });
    }

    const code = randomNumber(6);
    const expiry = moment(Date.now()).add(60, 'minutes').toDate();
    console.log(expiry);
    await User.findByIdAndUpdate(checkEmail._id, {resetPasswordToken: code, resetPasswordExpires: expiry});
    // send Email
    return response.sendSuccess({
      res,
      message: 'Password reset email sent to your email inbox',
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.resetPassword = async function(req, res, next) {
  try {
    const user = await User.findOne({resetPasswordToken: req.body.code, resetPasswordExpires: {$gt: Date.now()}});
    if (!user) {
      return response.sendError({
        res,
        message: 'Invalid or expired password reset code'
      });
    }

    // hash and store password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    await User.findByIdAndUpdate(user._id, {password: hashPassword});
    // send mail
    return response.sendSuccess({
      res,
      message: 'Password reset successful'
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

exports.resetPasswordApp = async function(req, res, next) {
  try {
    const userDetails = req.user_details;
    const old_password = req.body.old_password;
    const new_password = req.body.new_password;
    const user = await User.findById(userDetails._id).lean();
    if (!user) {
      return response.sendError({
        res,
        message: 'User not found',
        statusCode: status.NOT_FOUND
      });
    }
    const isPasswordValid = await bcrypt.compare(
      old_password,
      user.password
    );
    if (!isPasswordValid) {
      return response.sendError({
        res,
        message: 'Old password is incorrect,try again'
      });
    }

    // hash and store password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(new_password, salt);

    await User.findByIdAndUpdate(user._id, {password: hashPassword});

    return response.sendSuccess({
      res,
      message: 'Password reset successful'
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

exports.resetPasswordAppDoctor = async function(req, res, next) {
  try {
    const userDetails = req.user_details;
    const old_password = req.body.old_password;
    const new_password = req.body.new_password;
    const user = await Doctor.findById(userDetails._id).lean();
    if (!user) {
      return response.sendError({
        res,
        message: 'User not found',
        statusCode: status.NOT_FOUND
      });
    }
    const isPasswordValid = await bcrypt.compare(
      old_password,
      user.password
    );
    if (!isPasswordValid) {
      return response.sendError({
        res,
        message: 'Old password is incorrect,try again'
      });
    }

    // hash and store password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(new_password, salt);

    await Doctor.findByIdAndUpdate(user._id, {password: hashPassword});

    return response.sendSuccess({
      res,
      message: 'Password reset successful'
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
exports.UpdateProfile = async function(req, res, next) {
  try {
    const userDetails = req.user_details;
    const update = req.body;
    if (update.email) {
      const user_found = await User.findById(userDetails._id).lean();
      if (user_found.email !== req.body.email) {
        const userExist = await User.findOne({email: req.body.email}).lean();
        if (userExist) {
          return response.sendError({
            res,
            message: 'Email already exists'
          });
        }
      }
    }
    if (update.mobile) {
      const user_found = await User.findById(userDetails._id).lean();
      if (user_found.mobile !== req.body.mobile) {
        const userExist = await User.findOne({mobile: req.body.mobile}).lean();
        if (userExist) {
          return response.sendError({
            res,
            message: 'Mobile number already exists'
          });
        }
      }
    }
    const user_updated = await User.findByIdAndUpdate(userDetails.user_id, {...req.body}, {new: true, upsert: true}).lean();
    if (user_updated) {
      delete user_updated.password;
      delete user_updated.resetPasswordExpires;
      delete user_updated.resetPasswordToken;

      const accessToken = Tokenizer.signToken({
        user_id: user_updated._id,
        ...user_updated
      });
      return response.sendSuccess({
        res,
        message: 'Profile update successful',
        body: {user: user_updated, _token: accessToken}
      });
    }
    return response.sendError({
      res,
      message: 'Unable to update Profile,try again'
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
exports.UpdateProfileDoc = async function(req, res, next) {
  try {
    const userDetails = req.user_details;
    const update = req.body;
    if (update.email) {
      const user_found = await Doctor.findById(userDetails._id).lean();
      if (user_found.email !== req.body.email) {
        const userExist = await Doctor.findOne({email: req.body.email}).lean();
        if (userExist) {
          return response.sendError({
            res,
            message: 'Email already exists'
          });
        }
      }
    }
    if (update.mobile) {
      const user_found = await Doctor.findById(userDetails._id).lean();
      if (user_found.mobile !== req.body.mobile) {
        const userExist = await Doctor.findOne({mobile: req.body.mobile}).lean();
        if (userExist) {
          return response.sendError({
            res,
            message: 'Mobile number already exists'
          });
        }
      }
    }
    const user_updated = await Doctor.findByIdAndUpdate(userDetails.user_id, {...req.body}, {new: true, upsert: true}).lean();
    if (user_updated) {
      delete user_updated.password;
      delete user_updated.resetPasswordExpires;
      delete user_updated.resetPasswordToken;

      const accessToken = Tokenizer.signToken({
        user_id: user_updated._id,
        ...user_updated
      });
      return response.sendSuccess({
        res,
        message: 'Profile update successful',
        body: {user: user_updated, _token: accessToken}
      });
    }
    return response.sendError({
      res,
      message: 'Unable to update Profile,try again'
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
exports.getSpecificUser = async function(req, res, next) {
  try {
    const user = await User.findById(req.user_details.user_id).lean();
    delete user.password;
    delete user.resetPasswordExpires;
    delete user.resetPasswordToken;

    const accessToken = Tokenizer.signToken({
      ...user,
      user_id: user._id
    });
    if (user) {
      return response.sendSuccess({
        res,
        message: 'User record found',
        body: {data: user, _token: accessToken}
      });
    }
    return response.sendError({
      res,
      message: 'User not found',
      statusCode: status.NOT_FOUND
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
exports.getSpecificDoc = async function(req, res, next) {
  try {
    const user = await Doctor.findById(req.user_details.user_id).lean();
    delete user.password;
    delete user.resetPasswordExpires;
    delete user.resetPasswordToken;

    const accessToken = Tokenizer.signToken({
      ...user,
      user_id: user._id
    });
    if (user) {
      return response.sendSuccess({
        res,
        message: 'Doctor record found',
        body: {data: user, _token: accessToken}
      });
    }
    return response.sendError({
      res,
      message: 'User not found',
      statusCode: status.NOT_FOUND
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};


