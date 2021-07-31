/* global Helpers */

const jobCommonAction = require('../actions/common')('Job');
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
};
