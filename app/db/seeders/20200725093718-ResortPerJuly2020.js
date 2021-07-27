const resortInCemaraI = require('./data/resortInCemaraI');
const resortInCemaraII = require('./data/resortInCemaraII');
const resortInPtc = require('./data/resortInPtc');

const allResorts = [
  ...resortInCemaraI,
  ...resortInCemaraII,
  ...resortInPtc,
];

module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('resorts', allResorts),
  down: (queryInterface) => queryInterface.bulkDelete('resorts', null, {}),
};
