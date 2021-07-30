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
        phoneNumber: decoded.phoneNumber,
        userId: decoded.userId,
      };
    }
    throw ({
      message: 'Token unauthorized',
      status: 401,
    });
  },
);

module.exports = { generateAccessToken, getDataFromToken };
