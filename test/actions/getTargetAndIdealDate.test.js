/* eslint-disable no-unused-expressions */
/* global describe it beforeEach afterEach */
const sinon = require('sinon');
const Moment = require('moment');
const { Op } = require('sequelize');
const { Dayoff: DayoffModel } = require('../../app/db/models');
const { getTargetAndIdealDate } = require('../../app/actions');

const testedDate = '2020-05-31T17:00:00.000Z';
const testDayOfWeek = new Moment(testedDate).utcOffset(7).isoWeekday();

module.exports = (assert) => {
  describe('getTargetAndIdealDate action', () => {
    let dayoffStub;
    beforeEach(() => {
      dayoffStub = sinon.stub(DayoffModel, 'count');
    });
    afterEach(() => {
      dayoffStub.restore();
    });
    describe('getTargetAndIdealDate for WEEKLY loan', () => {
      it('Should return date with no dayoff', async () => {
        const startingDate = new Moment(testedDate).utcOffset(7).startOf('date').format('YYYY-MM-DD');
        const expectedIdealDate = new Moment(startingDate).add(10, 'weeks').format('YYYY-MM-DD');
        const expectedTargetDate = new Moment(startingDate).add(13, 'weeks').format('YYYY-MM-DD');
        dayoffStub.returns(Promise.resolve(0));
        const { targetDate, idealDate } = await getTargetAndIdealDate(startingDate, 'WEEKLY');
        assert.equal(idealDate, expectedIdealDate);
        assert.equal(targetDate, expectedTargetDate);
      });
      it('Should return date with 3 dayoff', async () => {
        const startingDate = new Moment(testedDate).utcOffset(7).startOf('date').format('YYYY-MM-DD');
        const expectedIdealDate = new Moment(startingDate).add(13, 'weeks').format('YYYY-MM-DD');
        const expectedTargetDate = new Moment(startingDate).add(16, 'weeks').format('YYYY-MM-DD');
        dayoffStub.returns(Promise.resolve(3));
        const { targetDate, idealDate } = await getTargetAndIdealDate(startingDate, 'WEEKLY');
        assert.equal(idealDate.valueOf(), expectedIdealDate.valueOf());
        assert.equal(targetDate.valueOf(), expectedTargetDate.valueOf());
      });
      it('Should return date with week 13 and 14 as a dayoff', async () => {
        const startingDate = new Moment(testedDate).utcOffset(7).startOf('date').format('YYYY-MM-DD');
        const expectedIdealDate = new Moment(startingDate).add(10, 'weeks').format('YYYY-MM-DD');
        const expectedTargetDate = new Moment(startingDate).add(15, 'weeks').format('YYYY-MM-DD');
        dayoffStub
          .withArgs({
            where: {
              dayOfWeek: testDayOfWeek,
              date: {
                [Op.between]: [startingDate, new Moment(startingDate).add(13, 'weeks')],
              },
            },
          })
          .returns(Promise.resolve(1));
        dayoffStub
          .withArgs({
            where: {
              dayOfWeek: testDayOfWeek,
              date: {
                [Op.between]: [startingDate, new Moment(startingDate).add(14, 'weeks')],
              },
            },
          })
          .returns(Promise.resolve(2));
        dayoffStub
          .withArgs({
            where: {
              dayOfWeek: testDayOfWeek,
              date: {
                [Op.between]: [startingDate, new Moment(startingDate).add(15, 'weeks')],
              },
            },
          })
          .returns(Promise.resolve(2));
        dayoffStub.returns(Promise.resolve(0));
        const { targetDate, idealDate } = await getTargetAndIdealDate(startingDate, 'WEEKLY');
        assert.equal(idealDate.valueOf(), expectedIdealDate.valueOf());
        assert.equal(targetDate.valueOf(), expectedTargetDate.valueOf());
      });
    });
    describe('getTargetAndIdealDate for DAILY loan', () => {
      it('Should return date with no dayoff', async () => {
        const startingDate = new Moment(testedDate).utcOffset(7).startOf('date').format('YYYY-MM-DD');
        const expectedIdealDate = new Moment(startingDate).add(100, 'days').format('YYYY-MM-DD');
        const expectedTargetDate = new Moment(startingDate).add(365, 'days').format('YYYY-MM-DD');
        dayoffStub.returns(Promise.resolve(0));
        const { targetDate, idealDate } = await getTargetAndIdealDate(startingDate, 'DAILY');
        assert.equal(idealDate.valueOf(), expectedIdealDate.valueOf());
        assert.equal(targetDate.valueOf(), expectedTargetDate.valueOf());
      });
      it('Should return date with 3 dayoff', async () => {
        const dayoffCount = 3;
        const startingDate = new Moment(testedDate).utcOffset(7).startOf('date').format('YYYY-MM-DD');
        const expectedIdealDate = new Moment(startingDate).add(100 + dayoffCount, 'days').format('YYYY-MM-DD');
        const expectedTargetDate = new Moment(startingDate).add(365 + dayoffCount, 'days').format('YYYY-MM-DD');
        dayoffStub.returns(Promise.resolve(dayoffCount));
        const { targetDate, idealDate } = await getTargetAndIdealDate(startingDate, 'DAILY');
        assert.equal(idealDate.valueOf(), expectedIdealDate.valueOf());
        assert.equal(targetDate.valueOf(), expectedTargetDate.valueOf());
      });
      it('Should return date with day 365 and 366 as a dayoff', async () => {
        const startingDate = new Moment(testedDate).utcOffset(7).startOf('date').format('YYYY-MM-DD');
        const expectedIdealDate = new Moment(startingDate).add(100, 'days').format('YYYY-MM-DD');
        const expectedTargetDate = new Moment(startingDate).add(367, 'days').format('YYYY-MM-DD');
        dayoffStub
          .withArgs({
            where: {
              date: {
                [Op.between]: [startingDate, new Moment(startingDate).add(365, 'days')],
              },
            },
          })
          .returns(Promise.resolve(1));
        dayoffStub
          .withArgs({
            where: {
              date: {
                [Op.between]: [startingDate, new Moment(startingDate).add(366, 'days')],
              },
            },
          })
          .returns(Promise.resolve(2));
        dayoffStub
          .withArgs({
            where: {
              date: {
                [Op.between]: [startingDate, new Moment(startingDate).add(367, 'days')],
              },
            },
          })
          .returns(Promise.resolve(2));
        dayoffStub.returns(Promise.resolve(0));
        const { targetDate, idealDate } = await getTargetAndIdealDate(startingDate, 'DAILY');
        assert.equal(idealDate.valueOf(), expectedIdealDate.valueOf());
        assert.equal(targetDate.valueOf(), expectedTargetDate.valueOf());
      });
    });
  });
};
