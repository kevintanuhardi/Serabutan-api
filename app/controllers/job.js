/* global Helpers */

const jobCommonAction = require('../actions/common')('Job');
const jobAppCommonAction = require('../actions/common')('JobApplication');
const { getNearbyJob, search } = require('../actions/job');

module.exports = {
  createJob: async (req, res) => {
    try {
      const {
        latitude,
        longitude,
        urgency,
        title,
        status = 'ACTIVE',
        genderPreference,
        agePreference,
        desc,
        price,
      } = req.body;

      const {
        userId,
      } = req;

      const point = { type: 'Point', coordinates: [Number(longitude), Number(latitude)] };

      await jobCommonAction.create({
        jobPosterId: userId,
        coordinate: point,
        urgency,
        title,
        status,
        genderPreference,
        agePreference,
        desc,
        price: Number(price),
      });

      return Helpers.successResponse(res, 201, { message: 'Job is successfully registered' });
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
  getNearbyJob: async (req, res) => {
    try {
      const {
        lat,
        lng,
        radius = 1000,
      } = req.query;

      const nearbyJobs = await getNearbyJob({ lat: Number(lat), lng: Number(lng), radius });

      return Helpers.successResponse(res, 200, { records: nearbyJobs });
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
  list: async (req, res) => {
    try {
      const {
        title,
        sort,
        dist,
        lat,
        lng,
      } = req.query;

      const where = {
        title,
        dist,
        gtePrice: req.query['price.gte'],
        ltePrice: req.query['price.lte'],
      };

      Helpers.clearObjectEmptyField(where);

      const arrOrder = Helpers.parsedSortQueryToSortArr(sort);

      const records = await search({
        where, arrOrder, lat: Number(lat), lng: Number(lng),
      });

      return Helpers.successResponse(res, 200, { records });
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
  applyJob: async (req, res) => {
    try {
      const {
        jobId,
      } = req.params;

      const {
        userId,
      } = req;

      const job = await jobCommonAction.update({ id: jobId }, { status: 'ACTIVE' });

      if (!job) throw ({ message: 'Job is not found', status: 401 });

      await jobAppCommonAction.create({
        employeeId: userId,
        jobId,
        status: 'APPLIED',
      });

      return Helpers.successResponse(res, 200, 'Successfully applied for job');
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
  approveApplicant: async (req, res) => {
    try {
      const {
        jobId,
      } = req.params;

      const {
        jobApplicationId,
      } = req.body;

      const {
        userId,
      } = req;

      const job = await jobCommonAction.findOne({ id: jobId, jobPosterId: userId, status: 'APPLIED' });

      if (!job) throw ({ message: 'Job is not found', status: 401 });

      job.status = 'TAKEN';

      await job.save();

      await jobAppCommonAction.update({ id: jobApplicationId }, { status: 'APPROVED' });

      return Helpers.successResponse(res, 200, 'Successfully approve applicant');
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
  rejectApplicant: async (req, res) => {
    try {
      const {
        jobId,
      } = req.params;

      const {
        jobApplicationId,
      } = req.body;

      const {
        userId,
      } = req;

      const job = await jobCommonAction.findOne({ id: jobId, jobPosterId: userId, status: 'APPLIED' });

      if (!job) throw ({ message: 'Job is not found', status: 401 });

      job.status = 'ACTIVE';

      await job.save();

      await jobAppCommonAction.update({ id: jobApplicationId }, { status: 'REJECTED' });

      return Helpers.successResponse(res, 200, 'Successfully reject applicant');
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
  contactApplicant: async (req, res) => {
    try {
      const {
        jobId,
      } = req.body;

      const {
        userId,
      } = req;

      const { jobApplication } = await jobCommonAction.findOne({ id: jobId, jobPosterId: userId }, { association: 'jobApplication', include: [{ association: 'employee' }] });

      if (jobApplication && !jobApplication.employee) {
        throw ({ status: 400, message: 'Applicant not found' });
      }

      const applicantPhoneNumber = '+6281282498252';

      const defaultText = 'Halo kamu yang melamar anak saya ya? Kerja?';

      const whatsappUrl = `https://api.whatsapp.com/send?phone=${applicantPhoneNumber.substring(1)}&text=${encodeURI(defaultText)}`;

      return Helpers.successResponse(res, 200, { whatsappUrl });
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
};
