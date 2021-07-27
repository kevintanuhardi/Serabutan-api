/* eslint-disable no-unused-vars */
/* global describe it beforeEach afterEach */
const sinon = require('sinon');
const Moment = require('moment');
const { Op } = require('sequelize');
const { Transaction, Loan } = require('../../app/db/models');
const { recheckRemainingBalance } = require('../../app/actions');

const testedDate = '2020-05-31T17:00:00.000Z';
const testDayOfWeek = new Moment(testedDate).utcOffset(7).isoWeekday();

module.exports = (assert) => {
  describe('recheckRemainingBalance action', () => {
    let transactionStub;
    let loanStub;
    let getLastStortTransactionStub;
    beforeEach(() => {
      transactionStub = sinon.stub(Transaction, 'findAll');
      loanStub = sinon.stub(Loan, 'findOne');
      getLastStortTransactionStub = sinon.stub(Transaction, 'findOne');
    });
    afterEach(() => {
      transactionStub.restore();
      loanStub.restore();
      getLastStortTransactionStub.restore();
    });
    describe('recheckRemainingBalance for WEEKLY loan', () => {
      it('Should return isUpdated false', async () => {
        const transactionResp = [
          { loanId: 1, transactionType: 'STORT', total: 130000 },
          { loanId: 1, transactionType: 'LEVERAGE', total: 130000 },
        ];
        const loanResp = {
          remainingBalance: 1040000,
          leverageBalance: 130000,
          loanSum: 1000000,
          type: 'WEEKLY',
          save: () => {},
        };
        transactionStub.returns(Promise.resolve(transactionResp));
        loanStub.returns(Promise.resolve(loanResp));
        const result = await recheckRemainingBalance(1);
        assert.propertyVal(result, 'isUpdated', false);
      });
      it('Should return isUpdated true with new remaining balance', async () => {
        const transactionResp = [
          { loanId: 1, transactionType: 'STORT', total: 130000 },
          { loanId: 1, transactionType: 'STORT', total: 130000 },
          { loanId: 1, transactionType: 'LEVERAGE', total: 130000 },
        ];
        const loanResp = {
          remainingBalance: 1040000,
          leverageBalance: 130000,
          loanSum: 1000000,
          type: 'WEEKLY',
          save: () => {},
        };
        const expectedResp = {
          remainingBalance: 910000,
          leverageBalance: 130000,
          isUpdated: true,
        };
        transactionStub.returns(Promise.resolve(transactionResp));
        loanStub.returns(Promise.resolve(loanResp));
        const result = await recheckRemainingBalance(1);
        assert.propertyVal(result, 'isUpdated', expectedResp.isUpdated);
        assert.propertyVal(result, 'newRemainingBalance', expectedResp.remainingBalance);
        assert.propertyVal(result, 'newLeverageBalance', expectedResp.leverageBalance);
      });
      it('Should return isUpdated true with new endingDate', async () => {
        const transactionResp = [
          { loanId: 1, transactionType: 'STORT', total: 130000 },
          { loanId: 1, transactionType: 'STORT', total: 1040000 },
          { loanId: 1, transactionType: 'LEVERAGE', total: 130000 },
        ];
        const loanResp = {
          remainingBalance: 0,
          leverageBalance: 0,
          endingDate: null,
          loanSum: 1000000,
          type: 'WEEKLY',
          save: () => {},
        };
        const lastTransactionResp = {
          loanId: 1,
          transactionType: 'STORT',
          total: 1040000,
          date: new Date(),
        };
        const expectedResp = {
          remainingBalance: 0,
          leverageBalance: 130000,
          isUpdated: true,
          newEndingDate: lastTransactionResp.date,
        };
        transactionStub.returns(Promise.resolve(transactionResp));
        loanStub.returns(Promise.resolve(loanResp));
        getLastStortTransactionStub.returns(Promise.resolve(lastTransactionResp));
        const result = await recheckRemainingBalance(1);
        assert.propertyVal(result, 'isUpdated', expectedResp.isUpdated);
        assert.propertyVal(result, 'newRemainingBalance', expectedResp.remainingBalance);
        assert.propertyVal(result, 'newLeverageBalance', expectedResp.leverageBalance);
        assert.equal(result.newEndingDate.valueOf(), expectedResp.newEndingDate.valueOf());
      });
    });
  });
};
