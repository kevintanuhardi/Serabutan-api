const jobCont = require('../controllers/job');

module.exports = (router) => {
  router.get('/', jobCont.list);
  router.post('/', jobCont.createJob);
  router.get('/nearby', jobCont.getNearbyJob);
};
