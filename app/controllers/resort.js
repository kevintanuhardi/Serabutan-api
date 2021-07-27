/* global Helpers */
const resortAction = require('../actions/common')('Resort');

module.exports = {
  create: async (req, res) => {
    try {
      const {
        branchId,
        locationName,
        groupNumber,
        collectingDayOfWeek,
      } = req.body;

      const createdResort = await resortAction.create({
        branchId,
        locationName,
        groupNumber,
        collectingDayOfWeek,
      });
      return Helpers.successResponse(res, 201, createdResort);
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
  list: async (req, res) => {
    try {
      const { limit = 20, page = 1 } = req.query;

      const { include, filter, order = [] } = req.body;

      const offset = (Number(page) - 1) * Number(limit);

      const where = {
        ...Helpers.parseQueryFilter(filter),
      };

      const [resorts, totalCount] = await Promise.all([
        resortAction.list(where, { offset, limit }, include, order),
        resortAction.count(where, include),
      ]);

      return Helpers.successResponse(res, 200, resorts, {
        totalCount,
        limit,
        page,
      });
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
  bulkCreate: async (req, res) => {
    try {
      const { newResorts } = req.body;

      const createdResorts = await resortAction.bulkCreate(newResorts);
      return Helpers.successResponse(res, 201, createdResorts);
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
};
