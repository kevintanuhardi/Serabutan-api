/* global Helpers */
const customerResortCommonAction = require('../actions/common')('TagCustomerResort');

module.exports = {
  list: async (req, res) => {
    try {
      const { limit = 20, page = 1 } = req.query;

      const { include = [], filter = [], order = [] } = req.body;

      const offset = (Number(page) - 1) * Number(limit);

      const where = Helpers.parseQueryFilter(filter);

      delete where.noNasabah;

      const [customers, totalCount] = await Promise.all([
        customerResortCommonAction.list(where, { offset, limit }, include, order),
        customerResortCommonAction.count(where, include),
      ]);

      return Helpers.successResponse(res, 200, customers, {
        totalCount,
        limit,
        page,
      });
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
};
