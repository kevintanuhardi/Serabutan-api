/* global Helpers */

const jobCommonAction = require('../actions/common')('Job');
const { getNearbyJob } = require('../actions/job');

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

      const point = { type: 'Point', coordinates: [longitude, latitude] };

      await jobCommonAction.create({
        jobPosterId: userId,
        coordinate: point,
        urgency,
        title,
        status,
        genderPreference,
        agePreference,
        desc,
        price,
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
};
