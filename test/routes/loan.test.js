/* global describe it */

const Moment = require('moment');

const newLoan = {
  customerId: 1,
  resortId: 1,
  manualCustomerId: 123223,
  collectorId: 1,
  dropperId: 1,
  loanSum: 1000000,
  startingDate: new Moment().startOf('date'),
  type: 'WEEKLY',
};

module.exports = (server, assert) => {
  describe('Loan', () => {
    describe('List Loan', () => {
      it('should list loan', (done) => {
        const searchCondition = {
        };

        server
          .post('/loan/search')
          .send(searchCondition)
          .expect('Content-type', /json/)
          // .expect(200)
          .end((err, resp) => {
            if (err) {
              return done(err);
            }
            assert.equal(resp.body.status, 200);
            assert.equal(resp.body.limit, 20);
            assert.equal(resp.body.page, 1);
            return done();
          });
      });
    });

    describe('Create Loan', () => {
      it('should successfully create loan', (done) => {
        const expectedLoanResp = {
          status: 'SEDANG BERJALAN',
          leverageBalance: 0,
          id: 1,
          customerResortId: 1,
          collectorId: 1,
          dropperId: 1,
          remainingBalance: 1300000,
          installmentAmount: 130000,
          loanSum: 1000000,
          stortDayOfWeek: newLoan.startingDate.utcOffset(7).isoWeekday(),
          startingDate: newLoan.startingDate,
          targetDate: new Moment(newLoan.startingDate).add(13, 'weeks'),
          idealDate: new Moment(newLoan.startingDate).add(10, 'weeks'),
          updatedAt: '2020-07-11T07:55:19.753Z',
          createdAt: '2020-07-11T07:55:19.753Z',
        };
        server
          .post('/loan')
          .send(newLoan)
          .expect('Content-type', /json/)
          .expect(201)
          .end((err, resp) => {
            if (err) {
              return done(err);
            }
            assert.equal(resp.body.status, 201);
            assert.propertyVal(
              resp.body.data,
              'status',
              expectedLoanResp.status,
            );
            assert.propertyVal(
              resp.body.data,
              'leverageBalance',
              expectedLoanResp.leverageBalance,
            );
            assert.propertyVal(
              resp.body.data,
              'customerResortId',
              expectedLoanResp.customerResortId,
            );
            assert.propertyVal(
              resp.body.data,
              'collectorId',
              expectedLoanResp.collectorId,
            );
            assert.propertyVal(
              resp.body.data,
              'dropperId',
              expectedLoanResp.dropperId,
            );
            assert.propertyVal(
              resp.body.data,
              'remainingBalance',
              expectedLoanResp.remainingBalance,
            );
            assert.propertyVal(
              resp.body.data,
              'installmentAmount',
              expectedLoanResp.installmentAmount,
            );
            assert.propertyVal(
              resp.body.data,
              'loanSum',
              expectedLoanResp.loanSum,
            );
            assert.propertyVal(
              resp.body.data,
              'stortDayOfWeek',
              expectedLoanResp.stortDayOfWeek,
            );
            assert.equal(
              new Moment(resp.body.data.startingDate).valueOf(),
              expectedLoanResp.startingDate.valueOf(),
            );
            assert.equal(
              new Moment(resp.body.data.targetDate).valueOf(),
              expectedLoanResp.targetDate.valueOf(),
            );
            assert.equal(
              new Moment(resp.body.data.idealDate).valueOf(),
              expectedLoanResp.idealDate.valueOf(),
            );
            return done();
          });
      });
    });

    describe('List Target', () => {

    });
  });
};
