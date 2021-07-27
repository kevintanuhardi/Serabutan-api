/* eslint-disable no-param-reassign */
/* global Helpers */
const { Op } = require('sequelize');

const dayoffAction = require('../actions/common')('Dayoff');
const loanAction = require('../actions/common')('Loan');
const getTargetAndIdealDate = require('../actions/getTargetAndIdealDate');

const updateAffectedLoan = async (dayoff) => {
  const affectedLoans = await loanAction.list({
    stortDayOfWeek: dayoff.dayOfWeek,
    startingDate: {
      [Op.lte]: dayoff.date,
    },
    targetDate: {
      [Op.gte]: dayoff.date,
    },
  });
  if (affectedLoans.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const loan of affectedLoans) {
      const { targetDate, idealDate } = await getTargetAndIdealDate(loan.startingDate);
      loan.targetDate = targetDate;
      loan.idealDate = idealDate;
      loan.save();
    }
  }

  return affectedLoans;
};

module.exports = {
  create: async (req, res) => {
    try {
      const { date, description } = req.body;

      const createdDayoff = await dayoffAction.create({
        date,
        description,
      });

      await updateAffectedLoan(createdDayoff);

      return Helpers.successResponse(res, 200, createdDayoff);
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

      const [dayoffs, totalCount] = await Promise.all([
        dayoffAction.list(where, { offset, limit }, include, order),
        dayoffAction.count(where, include),
      ]);

      return Helpers.successResponse(res, 200, dayoffs, {
        totalCount,
        limit,
        page,
      });
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
  recheckAffectedLoan: async (req, res) => {
    try {
      const { dayoffId } = req.params;

      const dayoffObject = await dayoffAction.findOne({ id: dayoffId });

      if (dayoffObject) throw ('Dayoff is not found');

      const affectedLoans = await updateAffectedLoan(dayoffObject);

      return Helpers.successResponse(res, 200, affectedLoans);
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
  updateById: async (req, res) => {
    try {
      const { dayoffId } = req.params;

      const { date, description } = req.body;

      const [affectedField] = await dayoffAction.update(
        { id: dayoffId },
        {
          date,
          description,
        },
      );

      if (!affectedField) {
        throw 'there is no updated row';
      }

      return Helpers.successResponse(
        res,
        200,
        `Successfully updated ${affectedField} dayoff(s)`,
      );
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
  bulkCreate: async (req, res) => {
    try {
      const { newDayoffs } = req.body;

      const createdDayoffs = await dayoffAction.bulkCreate(newDayoffs);
      return Helpers.successResponse(res, 201, createdDayoffs);
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
};
