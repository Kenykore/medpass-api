

const Hospital = require('../../../models/hospital');
const response = require('../../../utilities/response');
const status = require('http-status');


exports.createHospital = async (req, res, next) => {
  try {
    const hospitalExists = await Hospital.findOne({name: req.body.name, city: req.body.city});
    if (hospitalExists) {
      return response.sendError({res, message: 'Hospital already exists', statusCode: status.CONFLICT});
    }
    const hospital = new Hospital(req.body);
    const savedHospital = await hospital.save();
    return response.sendSuccess({res, message: 'Hospital created successfully', body: {hospital: savedHospital}});
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
exports.fetchAllHospitals = async (req, res, next) => {
  try {
    const hospitals = await Hospital.find();
    return response.sendSuccess({res, message: 'Hospitals fetched successfully', body: {hospitals}});
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
exports.deleteHospital= async (req, res, next) => {
  try {
    const hospital = await Hospital.findByIdAndDelete(req.params.id);
    return response.sendSuccess({res, message: 'Hospital deleted successfully', body: {hospital}});
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
