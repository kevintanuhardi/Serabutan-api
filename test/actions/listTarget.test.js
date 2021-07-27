/* eslint-disable no-unused-vars */
/* global describe it beforeEach after before */
const sinon = require('sinon');
const Moment = require('moment');
const { Op } = require('sequelize');
const { Transaction, Loan, Customer } = require('../../app/db/models');
const { listTarget } = require('../../app/actions');
const loanController = require('../../app/controllers/loan');
const customerController = require('../../app/controllers/customer');

module.exports = (assert) => {
  describe('listTarget action', () => {
    describe('listTarget with 1 loan on dayOfWeek 1', () => {
      const startingDateTest = new Moment().startOf('week').add(1, 'days').format('YYYY-MM-DD');
      const fakeReq = {
        body: {
          customerId: 1,
          resortId: 1,
          manualCustomerId: 123223,
          collectorId: 1,
          dropperId: 1,
          loanSum: 1000000,
          startingDate: startingDateTest,
          type: 'WEEKLY',
        },
      };
      before(async () => {
        await loanController.create(fakeReq);
      });
      after(async () => {
        if (process.env.NODE_ENV !== 'test') return null;
        return Promise.all([
          Loan.destroy({
            where: {},
            truncate: true,
          }),
          Transaction.destroy({
            where: {},
            truncate: true,
          }),
        ]);
      });
      it('Should list 1 loan as target', async () => {
        const testDate = new Moment(startingDateTest).add(1, 'weeks');
        const targetCondition = {
          resortId: fakeReq.body.resortId,
          date: testDate,
        };
        const result = await listTarget(targetCondition);
        assert.lengthOf(result, 1);
      });
      it('Should list 0 loan as target when dayOfWeek is not same', async () => {
        const testDate = new Moment(startingDateTest).add(1, 'days');
        const targetCondition = {
          resortId: fakeReq.body.resortId,
          date: testDate,
        };
        const result = await listTarget(targetCondition);
        assert.lengthOf(result, 0);
      });
      it('Should list 0 loan as target when current date is later than target date', async () => {
        const testDate = new Moment(startingDateTest).add(1, 'days');
        const targetCondition = {
          resortId: fakeReq.body.resortId,
          date: testDate,
        };
        const result = await listTarget(targetCondition);
        assert.lengthOf(result, 0);
      });
    });
    describe('listTarget with 1 Loan that paid on 3 weeks', () => {
      const startingDateTest = new Moment().startOf('week').add(1, 'days').format('YYYY-MM-DD');
      const fakeReq = {
        body: {
          customerId: 1,
          resortId: 1,
          manualCustomerId: 123223,
          collectorId: 1,
          dropperId: 1,
          loanSum: 1000000,
          startingDate: startingDateTest,
          type: 'WEEKLY',
        },
      };
      const fakeTransaction = {
        nominal: fakeReq.body.loanSum * 1.3,
        transactionType: 'STORT',
        date: new Moment(startingDateTest).add(3, 'weeks'),
      };

      before(async () => {
        const { data: createdLoan } = await loanController.create(fakeReq);
        await Transaction.create({
          ...fakeTransaction,
          loanId: createdLoan.id,
        });
      });
      after(async () => {
        if (process.env.NODE_ENV !== 'test') return null;
        return Promise.all([
          Loan.destroy({
            where: {},
            truncate: true,
          }),
          Transaction.destroy({
            where: {},
            truncate: true,
          }),
        ]);
      });
      it('Should list 1 loan as target', async () => {
        const testDate = new Moment(startingDateTest).add(1, 'weeks').format('YYYY-MM-DD');
        const targetCondition = {
          resortId: fakeReq.body.resortId,
          date: testDate,
        };
        const result = await listTarget(targetCondition);
        assert.lengthOf(result, 1);
      });
      it('Should list 0 loan as target when dayOfWeek is not same', async () => {
        const testDate = new Moment(startingDateTest).add(4, 'weeks').format('YYYY-MM-DD');
        const targetCondition = {
          resortId: fakeReq.body.resortId,
          date: testDate,
        };
        const result = await listTarget(targetCondition);
        assert.lengthOf(result, 0);
      });
    });
  });
};
