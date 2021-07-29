/* global Helpers */
const { totp } = require('otplib');
const Moment = require('moment');

const config = require('../../config');

const otpConfig = config.get('OTP');

const twilioService = require('../services/twilioService');
const otpCommonAction = require('./common')('Otp');

totp.options = otpConfig;

const generateExpiredTime = () => new Moment()
  .add(otpConfig.step, 'seconds')
  .toDate();

const generateOtp = async ({
  customerId,
  phoneNumber,
  otpType,
}) => {
  const otpParam = otpType === 'SIGNUP' ? phoneNumber : `${customerId}${phoneNumber}`;
  const otpCode = await totp.generate(otpParam);

  const otpWhereCondition = {
    customerId: otpType === 'LOGIN' ? customerId : undefined,
    phoneNumber,
    type: otpType,
  };

  Helpers.clearObjectEmptyField(otpWhereCondition);

  // TODO: CONVERT phoneNumber to +62 and send it to twilio service
  await Promise.all([
    otpCommonAction.upsert({
      expTime: generateExpiredTime(),
      otp: otpCode,
    }, otpWhereCondition),
    twilioService.sendSms({
      body: `Please insert this otp to the Serabutan app \n OTP: ${otpCode}`,
      phoneNumber,
    }),
  ]);

  return otpCode;
};

const verifyOtp = async ({
  customerId,
  phoneNumber,
  otpType,
  otp,
}) => {
  const otpParam = otpType === 'SIGNUP' ? phoneNumber : `${customerId}${phoneNumber}`;

  const otpWhereCondition = {
    customerId: otpType === 'LOGIN' ? customerId : undefined,
    phoneNumber,
    type: otpType,
  };

  Helpers.clearObjectEmptyField(otpWhereCondition);

  const [storedOtp] = await otpCommonAction.list({
    where: otpWhereCondition,
  });

  if (!storedOtp) {
    return false;
  }

  const otpCode = await totp.check(String(otp), otpParam);

  return otpCode;
};

module.exports = {
  generateOtp,
  verifyOtp,
};
