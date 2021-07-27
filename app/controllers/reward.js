/* global Helpers */
const rewardAction = require('../actions/common')('Reward');

module.exports = {
  create: async (req, res) => {
    try {
      const { type } = req.body;

      const createdReward = await rewardAction.create({
        type,
      });
      return Helpers.successResponse(res, 201, createdReward);
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

      const [rewards, totalCount] = await Promise.all([
        rewardAction.list(where, { offset, limit }, include, order),
        rewardAction.count(where, include),
      ]);

      return Helpers.successResponse(res, 200, rewards, {
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
      const { newRewards } = req.body;

      const createdRewards = await rewardAction.bulkCreate(newRewards);
      return Helpers.successResponse(res, 201, createdRewards);
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
  deleteById: async (req, res) => {
    try {
      const { rewardId } = req.params;

      const affectedField = await rewardAction.delete(
        { id: rewardId },
      );

      if (!affectedField) {
        throw 'there is no updated row';
      }
      return Helpers.successResponse(
        res,
        200,
        `Successfully deleted ${affectedField} reward(s)`,
      );
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
};
