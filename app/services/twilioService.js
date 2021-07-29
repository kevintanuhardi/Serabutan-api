const config = require('../../config');

// const { accountSid, authToken } = config.get('TWILIO');
// console.log(accountSid, authToken)
const accountSid = 'ACb776f9946c7cd91cdb136cdf9b0407c0';
const authToken = 'b37036ec1ec3bc128b12b1e0ef355bb3';
const client = require('twilio')(accountSid, authToken);

const sendSms = async ({ body, phoneNumber }) => {
  try {
    const message = await client.messages
      .create({
        from: '+12144831090',
        body,
        to: phoneNumber,
      });
    return message.sid;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  sendSms,
};
