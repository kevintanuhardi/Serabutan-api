/* global Helpers */
const path = require('path');
const { Op } = require('sequelize');

const loanCommonAction = require('../actions/common')('Loan');
const customerResortCommonAction = require('../actions/common')(
  'TagCustomerResort',
);
const transactionCommonAction = require('../actions/common')('Transaction');
const resortCommonAction = require('../actions/common')(
  'Resort',
);
const {
  getTargetAndIdealDate,
  getRemainingBalanceAndInstallmentAmount,
  listTarget,
  listLeverage,
  listBadLoan,
  writeDataToTemplate,
} = require('../actions');
const recheckTargetDate = require('../actions/recheckTargetDate');
const recheckRemainingBalance = require('../actions/recheckRemainingBalance');
const schemaValidations = require('../middlewares/schemaValidations');
const convertToTargetDTO = require('../DTO/convertToTargetDTO');

module.exports = {
  create: async (req, res) => {
    try {
      const {
        customerId,
        resortId,
        manualCustomerId,
        dropperId,
        collectorId,
        loanSum,
        startingDate,
        type,
      } = req.body;

      const [
        customerResort,
        { targetDate, idealDate },
        { remainingBalance, installmentAmount },
      ] = await Promise.all([
        customerResortCommonAction.findOrCreate(
          {
            customerId,
            resortId,
            manualCustomerId,
          },
          ['customerId', 'resortId'],
        ),
        getTargetAndIdealDate(startingDate, type),
        getRemainingBalanceAndInstallmentAmount(loanSum, type),
      ]);

      const createdLoan = await loanCommonAction.create({
        customerResortId: customerResort.id
          ? customerResort.id
          : customerResort.null,
        dropperId,
        collectorId,
        loanSum,
        remainingBalance,
        installmentAmount,
        startingDate,
        targetDate,
        idealDate,
        type,
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

      const [loans, totalCount] = await Promise.all([
        loanCommonAction.list(where, { offset, limit }, include, order),
        loanCommonAction.count(where, include),
      ]);

      return Helpers.successResponse(res, 200, loans, {
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
      const { loanId } = req.params;

      const {
        customerResortId,
        dropperId,
        collectorId,
        startingDate,
        endingDate,
      } = req.body;

      const [affectedField] = await loanCommonAction.update(
        { id: loanId },
        {
          customerResortId,
          dropperId,
          collectorId,
          startingDate,
          endingDate,
        },
      );

      if (!affectedField) {
        throw { message: 'there is no updated row' };
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
  bulkCreate: async (req, res) => {
    try {
      const { newLoans } = req.body;

      for (let loanIndex = 0; loanIndex < newLoans.length; loanIndex++) {
        const {
          startingDate,
          loanSum,
          type,
        } = newLoans[loanIndex];
        const { targetDate, idealDate } = await getTargetAndIdealDate(
          startingDate,
        );
        const {
          remainingBalance,
          installmentAmount,
        } = getRemainingBalanceAndInstallmentAmount(loanSum, type);
        newLoans[loanIndex].targetDate = targetDate;
        newLoans[loanIndex].idealDate = idealDate;
        newLoans[loanIndex].remainingBalance = remainingBalance;
        newLoans[loanIndex].installmentAmount = installmentAmount;
      }

      const createdLoans = await loanCommonAction.bulkCreate(newLoans);
      return Helpers.successResponse(res, 201, createdLoans);
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
  recheckTargetDate: async (req, res) => {
    try {
      const { loanId } = req.params;

      const result = await recheckTargetDate(loanId);

      return Helpers.successResponse(res, 200, result);
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
  recheckRemainingBalance: async (req, res) => {
    try {
      const { loanId } = req.params;

      const result = await recheckRemainingBalance(loanId);

      return Helpers.successResponse(res, 200, result);
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
  recheckTargetDateAndRemainingBalance: async (req, res) => {
    try {
      const { loanId } = req.params;

      const result = await Promise.all([
        recheckRemainingBalance(loanId),
        recheckTargetDate(loanId),
      ]);

      return Helpers.successResponse(res, 200, result);
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
  recheckAllLoanByCustomerId: async (req, res) => {
    try {
      const { customerId } = req.params;

      const customerResorts = await customerResortCommonAction.list({ customerId });
      const customerResortsId = customerResorts.map((el) => el.id);
      const customerLoans = await loanCommonAction.list(
        {
          customerResortId: { [Op.in]: customerResortsId },
        },
      );
      const customerLoansId = customerLoans.map((el) => el.id);

      const result = await Promise.all(customerLoansId.map(async (loanId) => {
        const [balanceCheck, dateCheck] = await Promise.all([
          recheckRemainingBalance(loanId),
          recheckTargetDate(loanId),
        ]);
        return {
          loanId,
          balanceCheck,
          dateCheck,
        };
      }));
      return Helpers.successResponse(res, 200, { customerId, ...result });
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
  listTarget: async (req, res) => {
    try {
      const validatedPayload = schemaValidations.loan.listLoanTarget(req);

      const {
        date,
        resortId,
        dropperId,
        collectorId,
        limit = 20,
        page = 1,
      } = validatedPayload;

      const offset = (page - 1) * limit;

      const result = await listTarget(
        {
          date, resortId, dropperId, collectorId,
        },
        { limit, offset },
      );

      return Helpers.successResponse(res, 200, result);
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
  downloadTarget: async (req, res) => {
    try {
      const validatedPayload = schemaValidations.loan.listLoanTarget(req);

      const {
        date,
        resortId,
        dropperId,
        collectorId,
        limit = 20,
        page = 1,
      } = validatedPayload;

      const offset = (page - 1) * limit;

      const result = await listTarget(
        {
          date, resortId, dropperId, collectorId,
        },
        { limit, offset },
      );

      if (result.length === 0) {
        return Helpers.successResponse(res, 404, 'Target for selected date is not found');
      }

      const headerConfig = {
        subtitle: 'Daftar Target Harian',
        headerInfo: [
          {
            key: 'Tanggal',
            value: date,
          },
        ],
      };

      if (resortId) {
        const currentResort = await resortCommonAction.findOne({ id: resortId });
        headerConfig.headerInfo.push({
          key: 'Resort',
          value: currentResort.locationName,
        });
      }

      writeDataToTemplate(headerConfig, convertToTargetDTO(result));

      const docxPath = path.join(__dirname, '..', '..', 'temp', 'laporan-target-MFS.docx');
      return res.download(docxPath);
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
  listLeverage: async (req, res) => {
    try {
      schemaValidations.loan.listLoanLeverage(req);

      const {
        resortId,
        limit = 20,
        page = 1,
      } = req.query;

      const result = await listLeverage(resortId, { limit, page });

      return Helpers.successResponse(res, 200, result);
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
  listBadLoan: async (req, res) => {
    try {
      // schemaValidations.loan.listBadLoan(req);

      const {
        resortId,
        limit = 20,
        page = 1,
      } = req.query;

      const result = await listBadLoan(resortId, { limit, page });

      return Helpers.successResponse(res, 200, result);
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
  deleteById: async (req, res) => {
    try {
      const { loanId } = req.params;

      const [loanAffectedField] = await Promise.all([
        loanCommonAction.delete(
          { id: loanId },
        ),
        transactionCommonAction.delete({ loanId }),
      ]);

      if (!loanAffectedField) {
        throw 'there is no updated row';
      }
      return Helpers.successResponse(
        res,
        200,
        `Successfully updated ${loanAffectedField} loan(s)`,
      );
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
};
