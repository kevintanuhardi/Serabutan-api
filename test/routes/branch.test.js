/* global describe it */

const newBranch = {
  name: 'Branch Test I',
};

module.exports = (server, assert, dataTest) => {
  describe('Branch', () => {
    describe('List Branch', () => {
      it('should list branch', (done) => {
        const searchCondition = {
          include: [
            {
              association: 'resorts',
            },
          ],
        };

        server
          .post('/branch/search')
          .send(searchCondition)
          .expect('Content-type', /json/)
          .expect(200)
          .end((err, resp) => {
            if (err) {
              return done(err);
            }
            assert.equal(resp.body.status, 200);
            assert.equal(resp.body.data[0].resorts.length, 9);
            assert.equal(resp.body.totalCount, dataTest.branchesCount);
            assert.equal(resp.body.limit, 20);
            assert.equal(resp.body.page, 1);
            return done();
          });
      });
    });

    describe('Create Branch', () => {
      it('should successfully create branch', (done) => {
        server
          .post('/branch')
          .send(newBranch)
          .expect('Content-type', /json/)
          .expect(201)
          .end((err, resp) => {
            if (err) {
              return done(err);
            }
            assert.equal(resp.body.status, 201);
            assert.propertyVal(resp.body.data, 'name', newBranch.name);
            return done();
          });
      });
      it('should return error name is null', (done) => {
        server
          .post('/branch')
          .expect('Content-type', /json/)
          .expect(500)
          .end((err, resp) => {
            if (err) {
              return done(err);
            }
            assert.equal(resp.body.status, 500);
            assert.propertyVal(
              resp.body.errors,
              'message',
              'notNull Violation: Branch.name cannot be null',
            );
            return done();
          });
      });
    });
  });
};
