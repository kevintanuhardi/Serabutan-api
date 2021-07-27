/* global describe it */

const newTagCustomerResort = {
  customerId: 1,
  resortId: 11,
  manualCustomerId: 102929292992,
};

module.exports = (server, assert, dataTest) => {
  describe('TagCustomerResort', () => {
    describe('List TagCustomerResort', () => {
      it('should list resort', (done) => {
        const searchCondition = {
          include: [
            {
              association: 'Branch',
            },
          ],
        };

        server
          .post('/resort/search')
          .send(searchCondition)
          .expect('Content-type', /json/)
          .expect(200)
          .end((err, resp) => {
            if (err) {
              return done(err);
            }
            assert.equal(resp.body.status, 200);
            assert.equal(resp.body.totalCount, dataTest.resortsCount);
            assert.equal(resp.body.limit, 20);
            assert.equal(resp.body.page, 1);
            return done();
          });
      });
    });

    describe('Create TagCustomerResort', () => {
      it('should successfully create resort', (done) => {
        server
          .post('/resort')
          .send(newTagCustomerResort)
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
              newTagCustomerResort.locationName,
            );
            assert.propertyVal(
              resp.body.data,
              'branchId',
              newTagCustomerResort.branchId,
            );
            assert.propertyVal(
              resp.body.data,
              'groupNumber',
              newTagCustomerResort.groupNumber,
            );
            assert.propertyVal(
              resp.body.data,
              'collectingDayOfWeek',
              newTagCustomerResort.collectingDayOfWeek,
            );
            return done();
          });
      });
    });
  });
};
