/* global Helpers */

const { addCountryCodeToPhone } = require('../helpers/utility');
const jwtService = require('../services/jwtService');

const userCommonAction = require('../actions/common')('User');
const otpAction = require('../actions/otp');

module.exports = {
  getOtp: async (req, res) => {
    try {
      const {
        phoneNumber,
      } = req.query;

      const [user] = await userCommonAction
        .list({
          where: {
            phoneNumber: addCountryCodeToPhone('+62', phoneNumber),
          },
        });

      await otpAction.generateOtp({
        userId: user ? user.id : null,
        phoneNumber: addCountryCodeToPhone('+62', phoneNumber),
        otpType: user ? 'LOGIN' : 'SIGNUP',
      });

      return Helpers.successResponse(res, 200, { message: 'OTP is sent to user phone number' });
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
  verifyOtp: async (req, res) => {
    try {
      const {
        otp,
        phoneNumber,
        otpType,
      } = req.body;

      const [user] = await userCommonAction
        .list({
          where: {
            phoneNumber: addCountryCodeToPhone('+62', phoneNumber),
          },
        });

      if (otpType === 'SIGNUP' && user) {
        throw ({
          message: 'Phone number is already registered',
          status: 401,
        });
      }
      if (otpType === 'LOGIN' && !user) {
        throw ({
          message: 'Phone number is not registered',
          status: 401,
        });
      }

      const isOtp = await otpAction.verifyOtp({
        userId: user ? user.id : null,
        phoneNumber: addCountryCodeToPhone('+62', phoneNumber),
        otpType,
        otp,
      });

      if (!isOtp) {
        throw ({
          message: 'OTP is wrong',
          status: 401,
        });
      }

      // generate token
      let accessToken;
      if (otpType === 'LOGIN') {
        accessToken = await jwtService.generateAccessToken({ phoneNumber, userId: user.id });
      }

      return Helpers.successResponse(res, 200, { message: 'OTP is successfully validated', accessToken, otpType });
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
  signup: async (req, res) => {
    try {
      const {
        name,
        dateOfBirth,
        gender,
        bioDesc,
        phoneNumber,
      } = req.body;

      const [user] = await userCommonAction
        .list({
          where: {
            phoneNumber: addCountryCodeToPhone('+62', phoneNumber),
          },
        });

      if (user) {
        throw ({
          message: 'Phone number is already registered',
          status: 401,
        });
      }

      const createdUser = await userCommonAction.create({
        name,
        dateOfBirth,
        gender,
        bioDesc,
        phoneNumber: addCountryCodeToPhone('+62', phoneNumber),
      });

      const accessToken = await jwtService.generateAccessToken({
        phoneNumber, userId: createdUser.id,
      });

      return Helpers.successResponse(res, 201, { message: 'User is successfully registered', accessToken });
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
  getProfile: async (req, res) => {
    try {
      const {
        userId,
      } = req;

      const [user] = await userCommonAction
        .list({
          where: {
            id: userId,
          },
        });

      return Helpers.successResponse(res, 200, { profile: user });
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
  editProfile: async (req, res) => {
    try {
      const {
        name,
        bioDesc,
      } = req.body;

      const {
        userId,
      } = req;

      const [user] = await userCommonAction
        .update({
          id: userId,
        }, {
          name,
          bioDesc,
        });

      return Helpers.successResponse(res, 200, 'Successfully update user profile');
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
};
