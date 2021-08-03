const jobCont = require('../controllers/job');

module.exports = (router) => {
  router.get('/', jobCont.list);
  router.get('/contact-applicant', jobCont.contactApplicant);
  router.get('/nearby', jobCont.getNearbyJob);
  router.post('/', jobCont.createJob);
  router.post('/:jobId/apply', jobCont.applyJob);
  router.post('/:jobId/approve-application', jobCont.approveApplicant);
  router.post('/:jobId/reject-application', jobCont.rejectApplicant);
};
