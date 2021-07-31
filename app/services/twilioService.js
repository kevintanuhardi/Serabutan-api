const config = require('../../config');

const { accountSid, authToken } = config.get('TWILIO');
// eslint-disable-next-line import/order
const client = require('twilio')(accountSid, authToken);

const sendSms = async ({ body, phoneNumber }) => {
  const message = await client.messages
    .create({
      from: '+12144831090',
      body,
      to: phoneNumber,
    });
  return message.sid;
};

module.exports = {
  sendSms,
};
