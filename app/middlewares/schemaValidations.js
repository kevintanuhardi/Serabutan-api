/* global Helpers */
const Joi = require('joi');

const {
  employeePositionEnum,
  employeeStatusEnum,
} = require('../helpers/enum');

const loan = {
  listLoanTarget: (req) => {
    const { query } = req;

    const validateRes = Joi.object({
      date: Joi.string().required(),
      resortId: Joi.number(),
      dropperId: Joi.number(),
      collecotrId: Joi.number(),
      limit: Joi.number(),
      page: Joi.number(),
    }).validate(query);

    if (validateRes.error) {
      throw ({
        status: Helpers.constant.httpStatus.badRequest,
        message: Helpers.constant.messages.badRequest,
        error: validateRes.error.details,
      });
    }

    return validateRes.value;
  },
  listLoanLeverage: (req) => {
    const { query } = req;

    const validateRes = Joi.object({
      resortId: Joi.number(),
    }).validate(query);

    if (validateRes.error) {
      throw ({
        status: Helpers.constant.httpStatus.badRequest,
        message: Helpers.constant.messages.badRequest,
        error: validateRes.error.details,
      });
    }
  },
};

const employee = {
  createEmployee: (req) => {
    const { body } = req;

    const validateRes = Joi.object({
      name: Joi.string().required(),
      citizenshipId: Joi.string(),
      endingDate: Joi.date(),
      position: Joi.string().valid(...employeePositionEnum).required(),
      status: Joi.string().valid(...employeeStatusEnum),
      phone: Joi.string(),
      dateOfBirth: Joi.string().required(),
      placeOfBirth: Joi.string(),
      startingDate: Joi.string(),
      branchId: Joi.number().required(),
    }).validate(body);

    if (validateRes.error) {
      throw ({
        status: Helpers.constant.httpStatus.badRequest,
        message: Helpers.constant.messages.badRequest,
        error: validateRes.error.details,
      });
    }
  },
  updateEmployee: (req) => {
    const { body, params } = req;

    const bodyValidation = Joi.object({
      name: Joi.string(),
      citizenshipId: Joi.string(),
      endingDate: Joi.string(),
      phone: Joi.string(),
      dateOfBirth: Joi.string(),
      placeOfBirth: Joi.string(),
      startingDate: Joi.string(),
      branchId: Joi.number(),
    }).validate(body);

    const paramsValidation = Joi.object({
      employeeId: Joi.number().required(),
    }).validate(params);

    if (bodyValidation.error || paramsValidation.error) {
      throw ({
        status: Helpers.constant.httpStatus.badRequest,
        message: Helpers.constant.messages.badRequest,
        error: bodyValidation.error ? bodyValidation.error.details : paramsValidation.error.details,
      });
    }
  },
  terminateOrResignEmployee: (req) => {
    const { body, params } = req;

    const bodyValidation = Joi.object({
      endingDate: Joi.date(),
    }).validate(body);

    const paramsValidation = Joi.object({
      employeeId: Joi.number().required(),
    }).validate(params);

    if (bodyValidation.error || paramsValidation.error) {
      throw ({
        status: Helpers.constant.httpStatus.badRequest,
        message: Helpers.constant.messages.badRequest,
        error: bodyValidation.error ? bodyValidation.error.details : paramsValidation.error.details,
      });
    }
  },
  transferEmployee: (req) => {
    const { body, params } = req;

    const bodyValidation = Joi.object({
      endingDate: Joi.date(),
      branchId: Joi.number().required(),
    }).validate(body);

    const paramsValidation = Joi.object({
      employeeId: Joi.number().required(),
    }).validate(params);

    if (bodyValidation.error || paramsValidation.error) {
      console.log(bodyValidation.error);
      console.log(paramsValidation.error);
      throw ({
        status: Helpers.constant.httpStatus.badRequest,
        message: Helpers.constant.messages.badRequest,
        error: bodyValidation.error ? bodyValidation.error.details : paramsValidation.error.details,
      });
    }
  },
  promoteEmployee: (req) => {
    const { body, params } = req;

    const bodyValidation = Joi.object({
      endingDate: Joi.date(),
      branchId: Joi.number(),
      position: Joi.valid(...employeePositionEnum).required(),
    }).validate(body);

    const paramsValidation = Joi.object({
      employeeId: Joi.number().required(),
    }).validate(params);

    if (bodyValidation.error || paramsValidation.error) {
      throw ({
        status: Helpers.constant.httpStatus.badRequest,
        message: Helpers.constant.messages.badRequest,
        error: bodyValidation.error ? bodyValidation.error.details : paramsValidation.error.details,
      });
    }
  },
  activeEmployee: (req) => {
    const { body } = req;

    const bodyValidation = Joi.object({
      position: Joi.array().items(Joi.valid(...employeePositionEnum)).required(),
      endingDate: Joi.date(),
      search: Joi.string().empty(''),
    }).validate(body);

    if (bodyValidation.error) {
      throw bodyValidation.error;
    }
  },
};

module.exports = {
  loan,
  employee,
};
