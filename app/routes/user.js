const userCont = require('../controllers/user');

module.exports = (router) => {
  router.get('/otp', userCont.getOtp);
  router.post('/otp/verify', userCont.verifyOtp);
  router.post('/signup', userCont.signup);
};
