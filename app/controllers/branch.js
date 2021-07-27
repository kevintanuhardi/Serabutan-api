/* global Helpers */
const branchAction = require('../actions/common')('Branch');

module.exports = {
  create: async (req, res) => {
    try {
      const { name, endingDate, startingDate } = req.body;

      const createdBranch = await branchAction.create({
        name,
        startingDate,
        endingDate,
      });
      return Helpers.successResponse(res, 201, createdBranch);
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

      const [branches, totalCount] = await Promise.all([
        branchAction.list(where, { offset, limit }, include, order),
        branchAction.count(where, include),
      ]);

      return Helpers.successResponse(res, 200, branches, {
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
      const { newBranches } = req.body;

      const createdBranches = await branchAction.bulkCreate(newBranches);
      return Helpers.successResponse(res, 201, createdBranches);
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
};
