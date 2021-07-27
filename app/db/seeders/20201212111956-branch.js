const branchData = require('./data/branchesSeeds');

module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('branches', branchData),
  down: (queryInterface) => queryInterface.bulkDelete('branches', null, {}),
};
