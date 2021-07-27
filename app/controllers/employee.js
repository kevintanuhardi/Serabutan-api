/* global Helpers */
const Moment = require('moment');
const employeeAction = require('../actions/common')('Employee');
const { employee: schemaValidation } = require('../middlewares/schemaValidations');
const getActiveEmployees = require('../actions/getActiveEmployees');

module.exports = {
  create: async (req, res) => {
    try {
      schemaValidation.createEmployee(req);
      const {
        name,
        citizenshipId,
        endingDate,
        position,
        status,
        phone,
        dateOfBirth,
        placeOfBirth,
        startingDate,
        branchId,
      } = req.body;

      const createdEmployee = await employeeAction.create({
        name,
        citizenshipId,
        startingDate,
        endingDate,
        position,
        status,
        phone,
        dateOfBirth,
        placeOfBirth,
        branchId,
      });
      return Helpers.successResponse(res, 201, createdEmployee);
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
  list: async (req, res) => {
    try {
      const { limit = 20, page = 1 } = req.query;

      const { include, filter, order = [] } = req.body;

      const offset = (Number(page) - 1) * Number(limit);

      const where = Helpers.parseQueryFilter(filter);

      const [employees, totalCount] = await Promise.all([
        employeeAction.list(where, { offset, limit }, include, order),
        employeeAction.count(where, include),
      ]);

      return Helpers.successResponse(res, 200, employees, {
        totalCount,
        limit,
        page,
      });
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
  updateById: async (req, res) => {
    try {
      schemaValidation.updateEmployee(req);
      const { employeeId } = req.params;

      const {
        name,
        citizenshipId,
        phone,
        dateOfBirth,
        placeOfBirth,
        startingDate,
        endingDate,
        branchId,
      } = req.body;

      const [affectedField] = await employeeAction.update(
        { id: employeeId },
        {
          name,
          citizenshipId,
          phone,
          dateOfBirth,
          placeOfBirth,
          startingDate,
          endingDate,
          branchId,
        },
      );

      if (!affectedField) {
        throw 'there is no updated row';
      }

      return Helpers.successResponse(
        res,
        200,
        `Successfully updated ${affectedField} employee(s)`,
      );
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
  bulkCreate: async (req, res) => {
    try {
      const { newEmployees } = req.body;

      const createdEmployees = await employeeAction.bulkCreate(newEmployees);
      return Helpers.successResponse(res, 201, createdEmployees);
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
  terminate: async (req, res) => {
    try {
      schemaValidation.terminateOrResignEmployee(req);
      const { employeeId } = req.params;

      const {
        endingDate = new Moment().utcOffset(7).startOf('date'),
      } = req.body;

      const [employee] = await employeeAction.list({ id: employeeId });

      employee.endingDate = endingDate;
      employee.status = 'TERMINATED';

      await employee.save();

      return Helpers.successResponse(
        res,
        200,
        `Successfully terminate ${employee.name}`,
      );
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
  resign: async (req, res) => {
    try {
      schemaValidation.terminateOrResignEmployee(req);
      const { employeeId } = req.params;

      const {
        endingDate = new Moment().utcOffset(7).startOf('date'),
      } = req.body;

      const [employee] = await employeeAction.list({ id: employeeId });

      employee.endingDate = endingDate;
      employee.status = 'RESIGNED';

      await employee.save();

      return Helpers.successResponse(
        res,
        200,
        `Successfully resigned ${employee.name}`,
      );
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
  transfer: async (req, res) => {
    try {
      schemaValidation.transferEmployee(req);
      const { employeeId } = req.params;

      const {
        endingDate = new Moment().utcOffset(7).startOf('date'),
        branchId,
      } = req.body;

      const [employee] = await employeeAction.list({ id: employeeId });

      const createEmployeePayload = {
        ...employee.dataValues,
        id: null,
        branchId,
        startingDate: endingDate,
      };

      employee.endingDate = endingDate;
      employee.status = 'TRANSFERED';

      await Promise.all([
        employeeAction.create(createEmployeePayload),
        employee.save(),
      ]);

      return Helpers.successResponse(
        res,
        200,
        `Successfully transfered ${employee.name}`,
      );
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
  promote: async (req, res) => {
    try {
      schemaValidation.promoteEmployee(req);
      const { employeeId } = req.params;

      const {
        endingDate = new Moment().utcOffset(7).startOf('date'),
        branchId,
        position,
      } = req.body;

      const [employee] = await employeeAction.list({ id: employeeId });

      const createEmployeePayload = {
        ...employee.dataValues,
        id: null,
        branchId: branchId || employee.branchId,
        startingDate: endingDate,
        position,
      };

      employee.endingDate = endingDate;
      employee.status = 'TRANSFERED';

      await Promise.all([
        employeeAction.create(createEmployeePayload),
        employee.save(),
      ]);

      return Helpers.successResponse(
        res,
        200,
        `Successfully promoted ${employee.name}`,
      );
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
  findActiveEmployeeByDate: async (req, res) => {
    try {
      schemaValidation.activeEmployee(req);
      const {
        position,
        search,
      } = req.body;

      const { limit = 10, page = 1 } = req.query;

      const offset = (Number(page) - 1) * Number(limit);
      const result = await getActiveEmployees(
        position,
        search,
        { offset: Number(offset), limit: Number(limit) },
      );

      return Helpers.successResponse(res, 200, result);
    } catch (err) {
      return Helpers.errorResponse(res, null, err);
    }
  },
};
