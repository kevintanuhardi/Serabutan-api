/* global describe it */
const Moment = require('moment');

const { getLoanStatus } = require('../../app/actions');

module.exports = (assert) => {
  describe('getloanStatus action', () => {
    describe('Get status for unpaid loan', () => {
      it('Should return status "SEDANG BERJALAN" for 3 weeks unpaid loan', async () => {
        const startingDate = new Moment().subtract(3, 'weeks').format('YYYY-MM-DD');
        const idealDate = new Moment().add(10, 'weeks').format('YYYY-MM-DD');
        const targetDate = new Moment().add(13, 'weeks').format('YYYY-MM-DD');
        const currentLoan = {
          loanSum: 1000000,
          remainingBalance: 130000,
          installmentAmount: 130000,
          customerResortId: 1,
          dropperId: 1,
          startingDate,
          idealDate,
          targetDate,
        };

        const outputStatus = await getLoanStatus(currentLoan);
        assert.equal(outputStatus, 'SEDANG BERJALAN');
      });
      it('Should return status "KURANG LANCAR" for 10 weeks unpaid loan', async () => {
        const startingDate = new Moment().subtract(10, 'weeks').format('YYYY-MM-DD');
        const idealDate = new Moment(startingDate).add(10, 'weeks').format('YYYY-MM-DD');
        const targetDate = new Moment(startingDate).add(13, 'weeks').format('YYYY-MM-DD');
        const currentLoan = {
          loanSum: 1000000,
          remainingBalance: 130000,
          installmentAmount: 130000,
          customerResortId: 1,
          dropperId: 1,
          startingDate,
          idealDate,
          targetDate,
        };

        const outputStatus = await getLoanStatus(currentLoan);
        assert.equal(outputStatus, 'KURANG LANCAR');
      });
      it('Should return status "MACET" for 13 weeks unpaid loan', async () => {
        const startingDate = new Moment().subtract(13, 'weeks').format('YYYY-MM-DD');
        const idealDate = new Moment(startingDate).add(10, 'weeks').format('YYYY-MM-DD');
        const targetDate = new Moment(startingDate).add(13, 'weeks').format('YYYY-MM-DD');
        const currentLoan = {
          loanSum: 1000000,
          remainingBalance: 130000,
          installmentAmount: 130000,
          customerResortId: 1,
          dropperId: 1,
          startingDate,
          idealDate,
          targetDate,
        };

        const outputStatus = await getLoanStatus(currentLoan);
        assert.equal(outputStatus, 'MACET');
      });
    });
    describe('Get status for paid loan', () => {
      it('Should return status "PERCEPATAN" for 8 weeks paid loan', async () => {
        const startingDate = new Moment().subtract(8, 'weeks').format('YYYY-MM-DD');
        const idealDate = new Moment(startingDate).add(10, 'weeks').format('YYYY-MM-DD');
        const targetDate = new Moment(startingDate).add(13, 'weeks').format('YYYY-MM-DD');
        const endingDate = new Moment(startingDate).add(8, 'weeks').format('YYYY-MM-DD');
        const currentLoan = {
          loanSum: 1000000,
          remainingBalance: 0,
          installmentAmount: 130000,
          customerResortId: 1,
          dropperId: 1,
          startingDate,
          idealDate,
          targetDate,
          endingDate,
        };

        const outputStatus = await getLoanStatus(currentLoan, new Date());
        assert.equal(outputStatus, 'PERCEPATAN');
      });
      it('Should return status "LANCAR" for 10 weeks paid loan', async () => {
        const startingDate = new Moment().subtract(10, 'weeks').format('YYYY-MM-DD');
        const idealDate = new Moment(startingDate).add(10, 'weeks').format('YYYY-MM-DD');
        const targetDate = new Moment(startingDate).add(13, 'weeks').format('YYYY-MM-DD');
        const endingDate = new Moment(startingDate).add(10, 'weeks').format('YYYY-MM-DD');
        const currentLoan = {
          loanSum: 1000000,
          remainingBalance: 0,
          installmentAmount: 130000,
          customerResortId: 1,
          dropperId: 1,
          startingDate,
          idealDate,
          targetDate,
          endingDate,
        };

        const outputStatus = await getLoanStatus(currentLoan, new Date());
        assert.equal(outputStatus, 'LANCAR');
      });
      it('Should return status "KURANG LANCAR" for 11 weeks paid loan', async () => {
        const startingDate = new Moment().subtract(13, 'weeks').format('YYYY-MM-DD');
        const idealDate = new Moment(startingDate).add(10, 'weeks').format('YYYY-MM-DD');
        const targetDate = new Moment(startingDate).add(13, 'weeks').format('YYYY-MM-DD');
        const endingDate = new Moment(startingDate).add(11, 'weeks').format('YYYY-MM-DD');
        const currentLoan = {
          loanSum: 1000000,
          remainingBalance: 0,
          installmentAmount: 130000,
          customerResortId: 1,
          dropperId: 1,
          startingDate,
          idealDate,
          targetDate,
          endingDate,
        };

        const outputStatus = await getLoanStatus(currentLoan, new Date());
        assert.equal(outputStatus, 'KURANG LANCAR');
      });
      it('Should return status "MACET" for 13 weeks paid loan', async () => {
        const startingDate = new Moment().subtract(13, 'weeks').format('YYYY-MM-DD');
        const idealDate = new Moment(startingDate).add(10, 'weeks').format('YYYY-MM-DD');
        const targetDate = new Moment(startingDate).add(13, 'weeks').format('YYYY-MM-DD');
        const endingDate = new Moment(startingDate).add(13, 'weeks').format('YYYY-MM-DD');
        const currentLoan = {
          loanSum: 1000000,
          remainingBalance: 0,
          installmentAmount: 130000,
          customerResortId: 1,
          dropperId: 1,
          startingDate,
          idealDate,
          targetDate,
          endingDate,
        };

        const outputStatus = await getLoanStatus(currentLoan, new Date());
        assert.equal(outputStatus, 'MACET');
      });
    });
  });
};
