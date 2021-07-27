/* global Helpers */
const { Op } = require('sequelize');
const customerCommonAction = require('../actions/common')('Customer');
const {
  parseFilterNoNasabah,
  grantReward,
  revokeReward,
  getCustomerResortsByCustomer,
} = require('../actions');

module.exports = {
  create: async (req, res) => {
    try {
      const {
        name,
        citizenshipId,
        spouseName,
        phone,
        streetName,
        kelurahan,
        kecamatan,
      } = req.body;

      const customers = await customerCommonAction.list({ citizenshipId });
      if (customers.length > 0) throw (Helpers.constant.messages.duplicateCitizenshipId);

      const createdCustomer = await customerCommonAction.create({
        name,
        citizenshipId,
        spouseName,
        phone,
        streetName,
        kelurahan,
        kecamatan,
      });
      return Helpers.successResponse(res, 200, createdCustomer);
    } catch (err) {
      const statusCode = err.name === 'SequelizeValidationError' ? 400 : 500;
      return Helpers.errorResponse(res, statusCode, err);
    }
  },
  list: async (req, res) => {
    try {
      const { limit = 20, page = 1 } = req.query;

      const { include = [], filter = [], order = [] } = req.body;

      const offset = (Number(page) - 1) * Number(limit);

      const noNasabahFilterAssoc = parseFilterNoNasabah(filter);

      const where = Helpers.parseQueryFilter(filter);

      delete where.noNasabah;

      const association = include.length || noNasabahFilterAssoc.length
        ? [...include, ...noNasabahFilterAssoc] : null;

      const [customers, totalCount] = await Promise.all([
        customerCommonAction.list(where, { offset, limit }, association, order),
        customerCommonAction.count(where, association),
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
  updateById: async (req, res) => {
    try {
      const { customerId } = req.params;

      const {
        name,
        citizenshipId,
        spouseName,
        phone,
        streetName,
        kelurahan,
        kecamatan,
      } = req.body;

      const customers = await customerCommonAction.list({
        [Op.and]: [
          { citizenshipId },
          { id: { [Op.ne]: customerId } },
        ],
      });
      if (customers.length > 0) throw (Helpers.constant.messages.duplicateCitizenshipId);

      const [affectedField] = await customerCommonAction.update(
        { id: customerId },
        {
          name,
          citizenshipId,
          spouseName,
          phone,
          streetName,
          kelurahan,
          kecamatan,
        },
      );

      if (!affectedField) {
        throw 'there is no updated row';
      }
      return Helpers.successResponse(
        res,
        200,
        `Successfully updated ${affectedField} employee(s)`,
      );
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
  bulkCreate: async (req, res) => {
    try {
      const { newCustomers } = req.body;

      const createdCustomers = await customerCommonAction.bulkCreate(newCustomers);
      return Helpers.successResponse(res, 201, createdCustomers);
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
  deleteById: async (req, res) => {
    try {
      const { customerId } = req.params;

      const affectedField = await customerCommonAction.delete(
        { id: customerId },
      );

      if (!affectedField) {
        throw 'there is no updated row';
      }
      return Helpers.successResponse(
        res,
        200,
        `Successfully updated ${affectedField} employee(s)`,
      );
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
  reward: async (req, res) => {
    try {
      const {
        rewardId,
        customerResortId,
        date,
      } = req.body;

      const rewardResp = await grantReward(
        rewardId,
        customerResortId,
        date,
      );
      return Helpers.successResponse(res, 200, rewardResp);
    } catch (err) {
      const statusCode = err.name === 'SequelizeValidationError' ? 400 : 500;
      return Helpers.errorResponse(res, statusCode, err);
    }
  },
  revokeReward: async (req, res) => {
    try {
      const {
        tagCustomerResortRewardId,
      } = req.body;

      const rewardResp = await revokeReward(
        tagCustomerResortRewardId,
      );
      return Helpers.successResponse(res, 200, rewardResp);
    } catch (err) {
      const statusCode = err.name === 'SequelizeValidationError' ? 400 : 500;
      return Helpers.errorResponse(res, statusCode, err);
    }
  },
  customerResortList: async (req, res) => {
    try {
      const { customerId } = req.params;

      const data = await getCustomerResortsByCustomer(customerId);
      return Helpers.successResponse(res, 200, data);
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
  searchByNameOrNik: async (req, res) => {
    try {
      const parseFilter = (filters) => {
        const where = {
          [Op.or]: [
            {
              name: {
                [Op.like]: filters.find((el) => el.key === 'name').value,
              },
            },
            {
              citizenshipId: {
                [Op.like]: filters.find((el) => el.key === 'citizenshipId').value,
              },
            },
          ],
        };
        return where;
      };
      const { limit = 20, page = 1 } = req.query;

      const { include = [], filter = [], order = [] } = req.body;

      const offset = (Number(page) - 1) * Number(limit);

      const where = parseFilter(filter);

      const [customers, totalCount] = await Promise.all([
        customerCommonAction.list(where, { offset, limit }, include, order),
        customerCommonAction.count(where, undefined),
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
