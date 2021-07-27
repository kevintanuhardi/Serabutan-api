/* global describe it before */

const Moment = require('moment');

module.exports = (server, assert, dataTest) => {
  describe('Employee', () => {
    describe('List Employee', () => {
      it('should list employee', (done) => {
        const searchCondition = {
          include: [
            {
              association: 'Branch',
            },
          ],
        };

        server
          .post('/employee/search')
          .send(searchCondition)
          .expect('Content-type', /json/)
          .end((err, resp) => {
            if (err) {
              return done(err);
            }
            assert.equal(resp.body.status, 200);
            assert.equal(resp.body.totalCount, dataTest.employeeCount);
            assert.equal(resp.body.limit, 20);
            assert.equal(resp.body.page, 1);
            return done();
          });
      });
    });

    describe('Create Employee', () => {
      const newEmployee = {
        name: 'newEmployee',
        citizenshipId: '1234567890123451',
        position: 'MANTRI',
        status: 'ACTIVE',
        dateOfBirth: new Date(),
        placeOfBirth: 'Jakarta',
        startingDate: new Date(),
        branchId: 1,
      };

      it('should successfully create employee', (done) => {
        server
          .post('/employee')
          .send(newEmployee)
          .expect('Content-type', /json/)
          .end((err, resp) => {
            if (err) {
              return done(err);
            }
            const { data, status } = resp.body;
            assert.equal(status, 201);
            assert.propertyVal(data, 'name', newEmployee.name);
            assert.propertyVal(data, 'citizenshipId', newEmployee.citizenshipId);
            assert.equal(
              new Moment(data.startingDate).unix(),
              new Moment(newEmployee.startingDate).startOf('date').unix(),
            );
            assert.propertyVal(data, 'position', newEmployee.position);
            assert.propertyVal(data, 'status', newEmployee.status);
            assert.equal(
              new Moment(data.dateOfBirth).unix(),
              new Moment(newEmployee.dateOfBirth).startOf('date').unix(),
            );
            assert.propertyVal(data, 'placeOfBirth', newEmployee.placeOfBirth);
            assert.propertyVal(data, 'branchId', newEmployee.branchId);
            return done();
          });
      });
      it('should return error name is null', (done) => {
        server
          .post('/employee')
          .expect('Content-type', /json/)
          .end((err, resp) => {
            if (err) {
              return done(err);
            }
            assert.equal(resp.body.status, 400);
            assert.propertyVal(
              resp.body.errors,
              'message',
              'Bad Request',
            );
            return done();
          });
      });
    });

    describe('Terminate Employee', () => {
      const terminatedEmployee = {
        name: 'terminatedEmployee',
        citizenshipId: '1234567890123452',
        position: 'MANTRI',
        status: 'ACTIVE',
        dateOfBirth: new Date(),
        placeOfBirth: 'Jakarta',
        startingDate: new Date(),
        branchId: 1,
      };
      const endingDate = new Moment().utcOffset(7).subtract(1, 'week');
      before((done) => {
        server
          .post('/employee')
          .send(terminatedEmployee)
          .end((err, resp) => {
            terminatedEmployee.id = resp.body.data.id;
            return done();
          });
      });
      it('should successfully terminate employee', (done) => {
        server
          .post(`/employee/terminate/${terminatedEmployee.id}`)
          .send({ endingDate })
          .expect('Content-type', /json/)
          .end((err, resp) => {
            if (err) {
              return done(err);
            }
            const { status, message } = resp.body;
            assert.equal(status, 200);
            assert.equal(message, `Successfully terminate ${terminatedEmployee.name}`);
            return done();
          });
      });
    });

    describe('Resign Employee', () => {
      const resignedEmployee = {
        name: 'resignedEmployee',
        citizenshipId: '1234567890123453',
        position: 'MANTRI',
        status: 'ACTIVE',
        dateOfBirth: new Date(),
        placeOfBirth: 'Jakarta',
        startingDate: new Date(),
        branchId: 1,
      };
      const endingDate = new Moment().utcOffset(7).subtract(1, 'week');
      before((done) => {
        server
          .post('/employee')
          .send(resignedEmployee)
          .end((err, resp) => {
            resignedEmployee.id = resp.body.data.id;
            return done();
          });
      });
      it('should successfully resign employee', (done) => {
        server
          .post(`/employee/terminate/${resignedEmployee.id}`)
          .send({ endingDate })
          .expect('Content-type', /json/)
          .end((err, resp) => {
            if (err) {
              return done(err);
            }
            const { status, message } = resp.body;
            assert.equal(status, 200);
            assert.equal(message, `Successfully terminate ${resignedEmployee.name}`);
            return done();
          });
      });
    });

    describe('Transfer Employee', () => {
      const transferedEmployee = {
        name: 'transferedEmployee',
        citizenshipId: '1234567890123454',
        position: 'MANTRI',
        status: 'ACTIVE',
        dateOfBirth: new Date(),
        placeOfBirth: 'Jakarta',
        startingDate: new Date(),
        branchId: 1,
      };
      const endingDate = new Moment().utcOffset(7).subtract(1, 'week');
      before((done) => {
        server
          .post('/employee')
          .send(transferedEmployee)
          .end((err, resp) => {
            transferedEmployee.id = resp.body.data.id;
            return done();
          });
      });
      it('should successfully transfer employee', (done) => {
        server
          .post(`/employee/transfer/${transferedEmployee.id}`)
          .send({ endingDate, branchId: 2 })
          .expect('Content-type', /json/)
          .end((err, resp) => {
            if (err) {
              return done(err);
            }
            const { status, message } = resp.body;
            assert.equal(status, 200);
            assert.equal(message, `Successfully transfered ${transferedEmployee.name}`);
            return done();
          });
      });
    });

    describe('Promote Employee', () => {
      const promotedEmployee = {
        name: 'promotedEmployee',
        citizenshipId: '1234567890123455',
        position: 'MANTRI',
        status: 'ACTIVE',
        dateOfBirth: new Date(),
        placeOfBirth: 'Jakarta',
        startingDate: new Date(),
        branchId: 1,
      };
      const endingDate = new Moment().utcOffset(7).subtract(1, 'week');
      before((done) => {
        server
          .post('/employee')
          .send(promotedEmployee)
          .end((err, resp) => {
            promotedEmployee.id = resp.body.data.id;
            return done();
          });
      });
      it('should successfully promote employee', (done) => {
        server
          .post(`/employee/promote/${promotedEmployee.id}`)
          .send({ endingDate, position: 'KEPALA_MANTRI' })
          .expect('Content-type', /json/)
          .end((err, resp) => {
            if (err) {
              return done(err);
            }
            const { status, message } = resp.body;
            assert.equal(status, 200);
            assert.equal(message, `Successfully promoted ${promotedEmployee.name}`);
            return done();
          });
      });
    });
  });
};
