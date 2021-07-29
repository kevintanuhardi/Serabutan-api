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
        throw new Error('Phone number is already registered');
      }
      if (otpType === 'LOGIN' && !user) {
        throw new Error('Phone number is not registered');
      }

      const isOtp = await otpAction.verifyOtp({
        userId: user ? user.id : null,
        phoneNumber: addCountryCodeToPhone('+62', phoneNumber),
        otpType,
        otp,
      });

      if (!isOtp) {
        throw new Error('OTP is wrong');
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
        throw new Error('Phone number is already registered');
      }

      const createdUser = await userCommonAction.create({
        name,
        dateOfBirth,
        gender,
        bioDesc,
        phoneNumber,
      });

      const accessToken = await jwtService.generateAccessToken({
        phoneNumber, userId: createdUser.id,
      });

      return Helpers.successResponse(res, 201, { message: 'User is successfully registered', accessToken });
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
};
