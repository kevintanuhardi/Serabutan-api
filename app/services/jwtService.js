const jwt = require('jsonwebtoken');

const config = require('../../config');

const oauthClient = config.get('OAUTH');

const generateAccessToken = async ({ phoneNumber, userId }) => jwt.sign({
  phoneNumber,
  userId,
},
oauthClient.clientSecret,
{ expiresIn: '365d', algorithm: 'HS256' });

const getDataFromToken = async (bearerToken) => jwt.verify(
  bearerToken, oauthClient.clientSecret, (err, decoded) => {
    if (err) {
      throw (err);
    }
    if (decoded && decoded.exp >= new Date().valueOf() / 1000) {
      return {
        active: true,
        custId: decoded.phoneNumber,
      };
    }
    return {
      active: false,
    };
  },
);

module.exports = { generateAccessToken, getDataFromToken };
