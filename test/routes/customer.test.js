/* global describe it */

const newCustomer = {
  name: 'customer Test I',
  citizenshipId: '1234567890123456',
  spouseName: 'spouse_a',
  streetName: 'street_a',
  kelurahan: 'kelurahan_a',
  kecamatan: 'kecamatan_a',
};

module.exports = (server, assert, dataTest) => {
  describe('Customer', () => {
    describe('List Customer', () => {
      it('should list customer', (done) => {
        const searchCondition = {
          // include: [
          //   {
          //     association: "Branch"
          //   }
          // ]
        };

        server
          .post('/customer/search')
          .send(searchCondition)
          .expect('Content-type', /json/)
          .expect(200)
          .end((err, resp) => {
            if (err) {
              return done(err);
            }
            assert.equal(resp.body.status, 200);
            assert.equal(resp.body.totalCount, dataTest.customersCount);
            assert.equal(resp.body.limit, 20);
            assert.equal(resp.body.page, 1);
            return done();
          });
      });
    });

    describe('Create Customer', () => {
      it('should successfully create customer', (done) => {
        server
          .post('/customer')
          .send(newCustomer)
          .expect('Content-type', /json/)
          .expect(201)
          .end((err, resp) => {
            if (err) {
              return done(err);
            }
            assert.equal(resp.body.status, 201);
            assert.propertyVal(
              resp.body.data,
              'locationName',
              newCustomer.locationName,
            );
            assert.propertyVal(
              resp.body.data,
              'branchId',
              newCustomer.branchId,
            );
            assert.propertyVal(
              resp.body.data,
              'groupNumber',
              newCustomer.groupNumber,
            );
            assert.propertyVal(
              resp.body.data,
              'collectingDayOfWeek',
              newCustomer.collectingDayOfWeek,
            );
            return done();
          });
      });
    });
  });
};
