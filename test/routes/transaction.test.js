/* global describe it before */

const loanCommonAction = require('../../app/actions/common')('Loan');
const transactionCommonAction = require('../../app/actions/common')('Transaction');

module.exports = (server, assert) => {
  describe('Transaction', () => {
    describe('List Transaction', () => {
      it('should list transaction', (done) => {
        const searchCondition = {
        };

        server
          .post('/transaction/search')
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

    describe('Create Transaction', () => {
      const newStortTransaction = {
        nominal: 130000,
        transactionType: 'STORT',
        employeeId: 1,
        date: '2020-09-29lT17:00:00.000Z',
      };
      const newLeverageTransaction = {
        nominal: 260000,
        transactionType: 'LEVERAGE',
        employeeId: 1,
        date: '2020-10-06lT17:00:00.000Z',
      };
      let testLoan = {};

      before((done) => {
        server
          .post('/loan')
          .send({
            customerId: 2,
            resortId: 1,
            manualCustomerId: 333,
            dropperId: 1,
            loanSum: 1000000,
            startingDate: '2020-07-12T17:00:00.000Z',
            type: 'WEEKLY',
          })
          .end((err, resp) => {
            testLoan = resp.body.data;
            newStortTransaction.loanId = resp.body.data.id;
            newLeverageTransaction.loanId = resp.body.data.id;
            return done();
          });
      });
      it('should successfully create "STORT" transaction', (done) => {
        server
          .post('/transaction')
          .send(newStortTransaction)
          .expect('Content-type', /json/)
          .expect(201)
          .end(async (err, resp) => {
            if (err) {
              return done(err);
            }
            const affectedLoan = await loanCommonAction.findOne({ id: newStortTransaction.loanId });
            assert.equal(
              affectedLoan.dataValues.remainingBalance,
              testLoan.remainingBalance - newStortTransaction.nominal,
            );
            testLoan.remainingBalance -= newStortTransaction.nominal;
            assert.equal(resp.body.status, 201);
            return done();
          });
      });
      it('should successfully create "LEVERAGE" transaction', (done) => {
        server
          .post('/transaction')
          .send(newLeverageTransaction)
          .expect('Content-type', /json/)
          .expect(201)
          .end(async (err, resp) => {
            if (err) {
              return done(err);
            }
            const affectedLoan = await loanCommonAction
              .findOne({ id: newLeverageTransaction.loanId });
            assert.equal(
              affectedLoan.dataValues.remainingBalance,
              testLoan.remainingBalance - newLeverageTransaction.nominal,
            );
            testLoan.remainingBalance -= newLeverageTransaction.nominal;
            assert.equal(resp.body.status, 201);
            return done();
          });
      });
    });

    describe('Delete Transaction', () => {
      let newStortTransactions = [
        {
          nominal: 130000,
          transactionType: 'STORT',
          employeeId: 1,
          date: '2021-03-06',
        },
        {
          nominal: 130000,
          transactionType: 'STORT',
          employeeId: 1,
          date: '2021-03-13',
        },
        {
          nominal: 130000,
          transactionType: 'STORT',
          employeeId: 1,
          date: '2021-03-20',
        },
      ];
      let testLoan = {
        customerId: 2,
        resortId: 1,
        manualCustomerId: 333,
        dropperId: 1,
        loanSum: 1000000,
        startingDate: '2021-02-27',
        type: 'WEEKLY',
      };
      before((done) => {
        server
          .post('/loan')
          .send(testLoan)
          .end((err, resp) => {
            testLoan = resp.body.data;
            newStortTransactions = newStortTransactions.map((transaction) => ({
              loanId: testLoan.id,
              ...transaction,
            }));
            transactionCommonAction.bulkCreate(newStortTransactions)
              .then((createResp) => {
                newStortTransactions = createResp;
                return done();
              });
          });
      });
      it('should successfully DELETE "STORT" transaction', (done) => {
        server
          .delete(`/transaction/hard/${newStortTransactions[0].id}`)
          .expect('Content-type', /json/)
          .expect(200)
          .end(async (err, resp) => {
            if (err) {
              return done(err);
            }
            const affectedLoan = await loanCommonAction
              .findOne({ id: newStortTransactions[0].loanId });
            newStortTransactions.shift();
            const createdTransactionNominal = newStortTransactions
              .reduce(
                (accumulator, currentTransaction) => accumulator + currentTransaction.nominal,
                0,
              );
            assert.equal(
              affectedLoan.dataValues.remainingBalance,
              testLoan.remainingBalance - createdTransactionNominal,
            );
            testLoan.remainingBalance -= createdTransactionNominal;
            assert.equal(resp.body.status, 200);
            return done();
          });
      });
    });
  });
};
