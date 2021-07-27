/* global Helpers */
const s3Service = require('../services/s3Service');

const accountSid = 'ACb776f9946c7cd91cdb136cdf9b0407c0';
const authToken = 'bea88adb3c74db2e2078c54f3cbbc62c';
const client = require('twilio')(accountSid, authToken);

module.exports = {
  uploadImage: async (req, res) => {
    try {
      const file = Buffer.from(req.files.image.data, 'binary');
      console.log(req.files.image);
      console.log(req.files.image.name);
      const { Location: imageUrl } = await s3Service.uploadImage(
        file,
        req.files.image.name,
        'customer',
      );
      console.log(imageUrl);
      return Helpers.successResponse(
        res,
        200,
        'Successfully updload',
      );
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
  sms: async (req, res) => {
    try {
      const message = await client.messages
        .create({
          body: 'Kevin ngetest otp, otp nya mau 50102',
          from: '+12144831090',
          to: '+6281287713417',
        });
      console.log(message.sid);
      return Helpers.successResponse(
        res,
        200,
        'Successfully sms',
      );
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
};
