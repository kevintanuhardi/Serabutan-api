/* global Helpers */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const config = require('../../config');
const userCommonAction = require('../actions/common')('User');
const employeeCommonAction = require('../actions/common')('Employee');

module.exports = {
  create: async (req, res) => {
    try {
      const {
        userName,
        password,
        email,
        employeeId,
        role,
      } = req.body;

      const createdLoan = await userCommonAction.create({
        userName,
        password,
        email,
        employeeId,
        role,
      });

      return Helpers.successResponse(res, 201, createdLoan);
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
  login: async (req, res) => {
    try {
      const {
        email,
        password,
      } = req.body;

      const [user] = await userCommonAction
        .list({
          email,
        }, {},
        [
          { association: 'employee' },
        ]);

      if (!user) throw new Error('The email is not found');

      if (bcrypt.compareSync(password, user.password) === false) throw new Error('The password is incorrect');

      const { role, employeeId } = user;

      const [employeeData] = await employeeCommonAction.list({ id: employeeId }, {}, [
        {
          association: 'Branch',
        },
      ]);

      const { Branch } = employeeData;
      const jwtSecret = config.get('jwt_secret');
      const accessToken = jwt.sign({
        email,
        role,
        employeeId,
        salesOffice: Branch.name,
      }, jwtSecret, {
        expiresIn: '30d',
      });

      const successPayload = {
        accessToken,
        email,
        salesOffice: Branch.name,
        name: user.employee ? user.employee.name : null,
        role,

      };

      return Helpers.successResponse(res, 200, successPayload);
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
  updateById: async (req, res) => {
    try {
      const { userId } = req.params;

      const {
        userName,
        email,
        employeeId,
        role,
      } = req.body;

      const [affectedField] = await userCommonAction.update(
        { id: userId },
        {
          userName,
          email,
          employeeId,
          role,
        },
      );

      if (!affectedField) {
        throw { message: 'there is no updated row' };
      }

      return Helpers.successResponse(
        res,
        200,
        `Successfully updated ${affectedField} loan(s)`,
      );
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
};
