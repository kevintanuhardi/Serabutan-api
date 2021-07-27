/* global Helpers */
const transactionCommonAction = require('../actions/common')('Transaction');

module.exports = {
  create: async (req, res) => {
    try {
      const {
        nominal,
        transactionType,
        employeeId,
        loanId,
        date,
      } = req.body;

      const createdLoan = await transactionCommonAction.create({
        nominal,
        transactionType,
        employeeId,
        loanId,
        date,
      });

      return Helpers.successResponse(res, 201, createdLoan);
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
  list: async (req, res) => {
    try {
      const { limit = 20, page = 1 } = req.query;

      const { include, filter, order = [] } = req.body;

      const offset = (Number(page) - 1) * Number(limit);

      const where = Helpers.parseQueryFilter(filter);

      const [transaction, totalCount] = await Promise.all([
        transactionCommonAction.list(where, { offset, limit }, include, order),
        transactionCommonAction.count(where, include),
      ]);

      return Helpers.successResponse(res, 200, transaction, {
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
      const { newTransactions } = req.body;

      const createdTransactions = await transactionCommonAction.bulkCreate(newTransactions);
      return Helpers.successResponse(res, 201, createdTransactions);
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
  deleteById: async (req, res) => {
    try {
      const { transactionId } = req.params;

      const affectedField = await transactionCommonAction.delete(
        { id: transactionId },
      );

      if (!affectedField) {
        throw 'there is no updated row';
      }
      return Helpers.successResponse(
        res,
        200,
        `Successfully updated ${affectedField} loan(s)`,
      );
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
};
