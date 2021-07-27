const faker = require('faker/locale/id_ID');
const actions = require('../app/actions/common');

module.exports = {
  branchesFactory: async (n) => {
    try {
      const data = [];

      for (let i = 1; i <= n; i++) {
        data.push({
          name: `Branch ${i}`,
        });
      }

      const newBranches = await actions('Branch').bulkCreate(data);
      return newBranches;
    } catch (err) {
      console.log('factory error:', err);
      throw err;
    }
  },
  resortsFactory: async (n) => {
    try {
      const data = [];

      for (let i = 1; i <= n; i++) {
        data.push({
          branchId: (i % 3) + 1,
          locationName: faker.address.county(),
          groupNumber: (i % 9) + 1,
          collectingDayOfWeek: (i % 7) + 1,
        });
      }

      const newResorts = await actions('Resort').bulkCreate(data);
      return newResorts;
    } catch (err) {
      console.log('factory error:', err);
      throw err;
    }
  },
  customersFactory: async (n) => {
    try {
      const data = [];

      for (let i = 1; i <= n; i++) {
        data.push({
          name: faker.name.findName(),
          citizenshipId: Number(1601222222222222222 + i),
          spouseName: `spouse_${String.fromCharCode(65 + (i % 26))}`,
          streetName: `street_${String.fromCharCode(65 + (i % 26))}`,
          kelurahan: `kelurahan_${String.fromCharCode(65 + (i % 26))}`,
          kecamatan: `kecamatan_${String.fromCharCode(65 + (i % 26))}`,
        });
      }

      const newCustomers = await actions('Customer').bulkCreate(data);
      return newCustomers;
    } catch (err) {
      console.log('factory error:', err);
      throw err;
    }
  },
  tagCustomerResortsFactory: async (n) => {
    try {
      const data = [];

      for (let i = 1; i <= n; i++) {
        data.push({
          customerId: (i % 150) + 1,
          resortId: (i % 27) + 1,
          manualCustomerId: 102929292992,
        });
      }

      const newTagCustomerResorts = await actions(
        'TagCustomerResort',
      ).bulkCreate(data);
      return newTagCustomerResorts;
    } catch (err) {
      console.log('factory error:', err);
      throw err;
    }
  },
  usersFactory: async (n) => {
    try {
      const data = [];

      for (let i = 1; i <= n; i++) {
        data.push({
          userName: `username ${i}`,
          password: `password${i}`,
          email: `email${i}@mail.com`,
          employeeId: i,
          role: i % 2 === 0 ? 'SUPER_ADMIN' : 'ADMIN',
        });
      }

      const newUsers = await actions('Users').bulkCreate(data);
      return newUsers;
    } catch (err) {
      console.log('factory error:', err);
      throw err;
    }
  },
  employeesFactory: async (n) => {
    try {
      const data = [];

      for (let i = 1; i <= n; i++) {
        data.push({
          name: `name ${i}`,
          citizenshipId: `12345678901234${String(i).padStart(2, 0)}`,
          position: 'MANTRI',
          status: 'ACTIVE',
          dateOfBirth: new Date(),
          placeOfBirth: 'Jakarta',
          startingDate: new Date(),
          branchId: 1,
        });
      }

      const newEmployees = await actions('Employee').bulkCreate(data);
      return newEmployees;
    } catch (err) {
      console.log('factory error:', err);
      throw err;
    }
  },
};
