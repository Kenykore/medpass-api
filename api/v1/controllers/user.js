const User = require('../../../models/users');
const Doctor = require('../../../models/doctor');

exports.fetchAllConnectedDoc = async (req, res, next) => {
  try {
    const user = req.user_details;
    const dataPerPage = parseInt(req.query.limit) || 10;
    const currentPage = parseInt(req.query.page) || 1;
    const skip = (currentPage - 1) * dataPerPage;
    const total = await User.find({
      approvedDoctors: {
        $in: [user.user_id]
      }
    }).countDocuments();
    const connectedUsers = await User.find({
      approvedDoctors: {
        $in: [user.user_id]
      }
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
      'data': connectedUsers
    };
    return response.sendSuccess({res, message: 'Connected users fetched successfully', body: responseContent});
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
exports.searchAllUsers = async (req, res, next) => {
  try {
    const dataPerPage = parseInt(req.query.limit) || 10;
    const currentPage = parseInt(req.query.page) || 1;
    const skip = (currentPage - 1) * dataPerPage;
    const total = await User.find({
      $or: [
        {firstName: new RegExp(req.query.search, 'ig')},
        {lastName: new RegExp(req.query.search, 'ig')},
        {email: new RegExp(req.query.search, 'ig')},
        {mobile: new RegExp(req.query.search, 'ig')},
      ],
    }).countDocuments();
    const users = await User.find({
      $or: [
        {firstName: new RegExp(req.query.search, 'ig')},
        {lastName: new RegExp(req.query.search, 'ig')},
        {email: new RegExp(req.query.search, 'ig')},
        {mobile: new RegExp(req.query.search, 'ig')},
      ],
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
      'data': users
    };
    return response.sendSuccess({res, message: 'Users fetched successfully', body: responseContent});
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
