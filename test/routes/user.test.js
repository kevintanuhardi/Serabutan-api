/* global describe it before */

module.exports = (server, assert) => {
  describe('User', () => {
    describe('Create User', () => {
      const newUser = {
        password: 'newUserPassword',
        email: 'newUser@mail.com',
        employeeId: 1,
        role: 'SUPER_ADMIN',
      };

      it('should successfully create new SUPER_ADMIN user', (done) => {
        server
          .post('/user')
          .send(newUser)
          .expect('Content-type', /json/)
          .expect(201)
          .end(async (err, resp) => {
            if (err) {
              return done(err);
            }
            const { data } = resp.body;
            assert.equal(resp.body.status, 201);
            assert.propertyVal(data, 'isActive', true);
            assert.propertyVal(data, 'email', newUser.email);
            assert.propertyVal(data, 'role', newUser.role);
            return done();
          });
      });
    });

    describe('User Login', () => {
      const newUser = {
        password: 'loginTestPassword',
        email: 'loginTest@mail.com',
        employeeId: 2,
        role: 'SUPER_ADMIN',
      };

      const wrongPassword = 'wrongPassword';

      const wrongEmail = 'wrongEmail@mail.com';

      before((done) => {
        server
          .post('/user')
          .send(newUser)
          .end(() => done());
      });

      it('should successfully login user', (done) => {
        server
          .post('/user/login')
          .send({
            email: newUser.email,
            password: newUser.password,
          })
          .expect('Content-type', /json/)
          .expect(200)
          .end(async (err, resp) => {
            if (err) {
              return done(err);
            }
            const { data } = resp.body;
            assert.equal(resp.body.status, 200);
            assert.propertyVal(data, 'email', newUser.email);
            assert.propertyVal(data, 'role', newUser.role);
            return done();
          });
      });

      it('should return wrong password error', (done) => {
        server
          .post('/user/login')
          .send({
            email: newUser.email,
            password: wrongPassword,
          })
          .expect('Content-type', /json/)
          .expect(500)
          .end(async (err, resp) => {
            if (err) {
              return done(err);
            }
            const { errors, status } = resp.body;
            assert.equal(status, 500);
            assert.propertyVal(errors, 'message', 'The password is incorrect');
            return done();
          });
      });
      it('should return email not found error', (done) => {
        server
          .post('/user/login')
          .send({
            email: wrongEmail,
            password: wrongPassword,
          })
          .expect('Content-type', /json/)
          .expect(500)
          .end(async (err, resp) => {
            if (err) {
              return done(err);
            }
            const { errors, status } = resp.body;
            assert.equal(status, 500);
            assert.propertyVal(errors, 'message', 'The email is not found');
            return done();
          });
      });
    });
  });
};
