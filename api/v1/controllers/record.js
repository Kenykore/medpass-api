const Hospital = require('../../../models/hospital');
const Record = require('../../../models/record');
const User = require('../../../models/users');
const Doctor = require('../../../models/doctor');
const response = require('../../../utilities/response');
const status = require('http-status');
const RecordRequest = require('../../../models/recordRequest');
const ObjectID = require('mongoose').Types.ObjectId;

exports.createRecord = async (req, res, next) => {
  try {
    const user = req.user_details;
    const patient = await User.findById(req.body.userId).lean();
    if (patient.revokedDoctors.includes(user.user_id)) {
      return response.sendError({res, message: 'You have been revoked access to this patient', statusCode: status.BAD_REQUEST});
    }
    const record = new Record({
      ...req.body,
      user: ObjectID(req.body.userId),
      doctor: ObjectID(user.user_id),
      doctorId: user.user_id,
    });
    const savedRecord = await record.save();
    return response.sendSuccess({res, message: 'Record created successfully', body: {record: savedRecord}});
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
exports.createRecordRequest = async (req, res, next) => {
  try {
    const user = req.user_details;
    const recordRequest = new RecordRequest({
      ...req.body,
      user: ObjectID(req.body.userId),
      doctor: ObjectID(user.user_id),
      doctorId: user.user_id,
    });
    const savedRecordRequest = await recordRequest.save();
    return response.sendSuccess({res, message: 'Record request created successfully', body: {recordRequest: savedRecordRequest}});
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
exports.fetchAllRecordsUser = async (req, res, next) => {
  try {
    const user = req.user_details;
    const dataPerPage = parseInt(req.query.limit) || 10;
    const currentPage = parseInt(req.query.page) || 0;
    const skip = currentPage * dataPerPage;
    const total = await Record.find({
      userId: user.user_id,
    }).countDocuments();
    const records = await Record.find({
      userId: user.user_id,
    }).sort({_id: 'desc'}).skip(skip).limit(dataPerPage);
    const totalPages = Math.ceil(total / dataPerPage);
    const responseContent = {
      'total': total,
      'pagination': {
        'current': currentPage,
        'number_of_pages': totalPages,
        'perPage': dataPerPage,
        'next': currentPage === totalPages ? currentPage : currentPage + 1
      },
      'data': records
    };
    return response.sendSuccess({res, message: 'Medical Record Found', body: responseContent});
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

exports.fetchAllRecordsByDoc = async (req, res, next) => {
  try {
    const doc = req.user_details;
    const user = req.query.userId;
    if (!user) {
      return response.sendError({res, message: 'User Id is required', statusCode: status.BAD_REQUEST});
    }
    const dataPerPage = parseInt(req.query.limit) || 10;
    const currentPage = parseInt(req.query.page) || 1;
    const skip = (currentPage-1) * dataPerPage;
    const patient = await User.findById(user).lean();
    if (patient.revokedDoctors.includes(doc.user_id)) {
      return response.sendError({res, message: 'You have been revoked access to this patient', statusCode: status.BAD_REQUEST});
    }
    const total = await Record.find({
      userId: user,
    }).countDocuments();
    const records = await Record.find({
      userId: user,
    }).sort({_id: 'desc'}).skip(skip).limit(dataPerPage);
    const totalPages = Math.ceil(total / dataPerPage);
    const responseContent = {
      'total': total,
      'pagination': {
        'current': currentPage,
        'number_of_pages': totalPages,
        'perPage': dataPerPage,
        'next': currentPage === totalPages ? currentPage : currentPage + 1
      },
      'data': records
    };
    return response.sendSuccess({res, message: 'Medical Record Found', body: responseContent});
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

exports.fetchAllRecordsRequest = async (req, res, next) => {
  try {
    const user = req.user_details;
    const dataPerPage = parseInt(req.query.limit) || 10;
    const currentPage = parseInt(req.query.page) || 0;
    const skip = currentPage * dataPerPage;
    const total = await RecordRequest.find({
      userId: user.user_id,
      ...req.query
    }).countDocuments();
    const records = await RecordRequest.find({
      userId: user.user_id,
      ...req.query
    }).sort({_id: 'desc'}).skip(skip).limit(dataPerPage);
    const totalPages = Math.ceil(total / dataPerPage);
    const responseContent = {
      'total': total,
      'pagination': {
        'current': currentPage,
        'number_of_pages': totalPages,
        'perPage': dataPerPage,
        'next': currentPage === totalPages ? currentPage : currentPage + 1
      },
      'data': records
    };
    return response.sendSuccess({res, message: 'Medical Record Found', body: responseContent});
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

exports.fetchAllRecordsRequestByDoc = async (req, res, next) => {
  try {
    const user = req.user_details;
    const dataPerPage = parseInt(req.query.limit) || 10;
    const currentPage = parseInt(req.query.page) || 0;
    const skip = currentPage * dataPerPage;
    const total = await RecordRequest.find({
      doctorId: user.user_id,
      ...req.query
    }).countDocuments();
    const records = await RecordRequest.find({
      doctorId: user.user_id,
      ...req.query
    }).sort({_id: 'desc'}).skip(skip).limit(dataPerPage);
    const totalPages = Math.ceil(total / dataPerPage);
    const responseContent = {
      'total': total,
      'pagination': {
        'current': currentPage,
        'number_of_pages': totalPages,
        'perPage': dataPerPage,
        'next': currentPage === totalPages ? currentPage : currentPage + 1
      },
      'data': records
    };
    return response.sendSuccess({res, message: 'Medical Record Found', body: responseContent});
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

exports.updateRecordRequestStatus = async (req, res, next) => {
  try {
    const user = req.user_details;
    const recordRequest = await RecordRequest.findById(req.body.id);
    if (!recordRequest) {
      return response.sendError({res, message: 'Record request not found', statusCode: status.NOT_FOUND});
    }
    const recordUpdated = await Record.findByIdAndUpdate(req.body.id,
      {
        $set:
                {
                  status: req.body.status,
                },
        $push: {
          'statusTracker': {
            status: req.body.status,
            time: new Date(Date.now())
          }
        }
      }, {new: true}).lean();
    if (req.body.status === 'approved') {
      await User.findByIdAndUpdate(user.user_id, {
        $pull: {
          'revokedDoctors': recordRequest.doctorId
        },
        $push: {
          'approvedDoctors': recordRequest.doctorId
        }
      });
    }
    if (req.body.status === 'rejected') {
      await User.findByIdAndUpdate(user.user_id, {
        $push: {
          'revokedDoctors': recordRequest.doctorId
        },
        $pull: {
          'approvedDoctors': recordRequest.doctorId
        }
      });
    }
    return response.sendSuccess({res, message: 'Record request updated', body: recordUpdated});
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

exports.getSingleRecord = async (req, res, next) => {
  try {
    const record = await Record.findById(req.params.id).lean();
    if (!record) {
      return response.sendError({res, message: 'Record not found', statusCode: status.NOT_FOUND});
    }
    return response.sendSuccess({res, message: 'Record found', body: record});
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
exports.updateRecord = async (req, res, next) => {
  try {
    delete req.body.user;
    delete req.body.userId;
    delete req.body.doctorId;
    delete req.body.doctor;
    const recordUpdated = await Record.findByIdAndUpdate(req.params.id, {
      ...req.body
    }, {
      new: true
    }).lean();
    return response.sendSuccess({res, message: 'Record updated', body: recordUpdated});
  } catch (error) {
    console.log(error);
  }
};


