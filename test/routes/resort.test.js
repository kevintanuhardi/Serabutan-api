/* global describe it */

const newResort = {
  branchId: '1',
  locationName: 'Resort Test I',
  groupNumber: 1,
  collectingDayOfWeek: '1',
};

module.exports = (server, assert, dataTest) => {
  describe('Resort', () => {
    describe('List Resort', () => {
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

    describe('Create Resort', () => {
      it('should successfully create resort', (done) => {
        server
          .post('/resort')
          .send(newResort)
          .expect('Content-type', /json/)
          // .expect(201)
          .end((err, resp) => {
            if (err) {
              return done(err);
            }
            assert.equal(resp.body.status, 201);
            assert.propertyVal(
              resp.body.data,
              'locationName',
              newResort.locationName,
            );
            assert.propertyVal(resp.body.data, 'branchId', newResort.branchId);
            assert.propertyVal(
              resp.body.data,
              'groupNumber',
              newResort.groupNumber,
            );
            assert.propertyVal(
              resp.body.data,
              'collectingDayOfWeek',
              newResort.collectingDayOfWeek,
            );
            return done();
          });
      });
    });
  });
};
