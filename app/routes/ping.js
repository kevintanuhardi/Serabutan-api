/* global Helpers */

const testCont = require('../controllers/test');

module.exports = (router) => {
  router.get('/', (req, res) => Helpers.successResponse(res, 200, 'pong'));
  router.post('/image', testCont.uploadImage);
  router.get('/sms', testCont.sms);
};
