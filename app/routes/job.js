const jobCont = require('../controllers/job');

module.exports = (router) => {
  router.post('/', jobCont.createJob);
  router.get('/nearby', jobCont.getNearbyJob);
};
