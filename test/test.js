/* eslint-disable global-require */
/* global before after describe */
const supertest = require('supertest');
const { assert } = require('chai');
const app = require('../app');

const server = supertest(app);

const {
  branchesFactory,
  resortsFactory,
  customersFactory,
  tagCustomerResortsFactory,
  employeesFactory,
} = require('./factories');
const truncate = require('./truncate');

const dataTest = {
  branchesCount: 3,
  resortsCount: 27,
  customerCount: 170,
  employeeCount: 5,
};

before(async () => {
  if (process.env.NODE_ENV !== 'test') return null;
  await truncate();

  return Promise.all([
    branchesFactory(dataTest.branchesCount),
    resortsFactory(dataTest.resortsCount),
    customersFactory(dataTest.customersCount),
    tagCustomerResortsFactory(dataTest.customersResortCount),
    employeesFactory(dataTest.employeeCount),
  ]);
});

describe('--- TEST HEADER ---', () => {
  describe('--- API TEST ---', () => {
    require('./routes/ping.test')(server, assert);
    require('./routes/branch.test')(server, assert, dataTest);
    require('./routes/resort.test')(server, assert, dataTest);
    require('./routes/loan.test')(server, assert, dataTest);
    require('./routes/transaction.test')(server, assert, dataTest);
    require('./routes/employee.test')(server, assert, dataTest);
  });

  describe('--- ACTION TEST ---', () => {
    require('./actions/getTargetAndIdealDate.test')(assert, dataTest);
    require('./actions/getLoanStatus.test')(assert, dataTest);
    require('./actions/recheckRemainingBalance.test')(assert, dataTest);
    require('./actions/listTarget.test')(assert, dataTest);
  });
});

after((done) => {
  // TODO: Delete Seed Data
  done();
});
