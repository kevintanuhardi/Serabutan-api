/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
const {
  isNil, isObject, result, camelCase,
} = require('lodash');
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');

exports.constant = require('./constant');

exports.errorResponse = (res, httpCodeStatus, err) => {
  const resultPrint = {};
  resultPrint.status = result(err, 'status') || result(err, 'statusCode') || 500;

  if (isObject(err)) {
    resultPrint.message = result(err, 'message') || result(err, 'msg') || 'Internal server error';

    resultPrint.stackTrace = err;
    if (
      resultPrint.stackTrace.message !== undefined
    ) delete resultPrint.stackTrace.message;
    if (
      resultPrint.stackTrace.status !== undefined
    ) delete resultPrint.stackTrace.status;
    if (Object.keys(resultPrint.stackTrace).length === 0) delete resultPrint.stackTrace;
  } else {
    const message = 'Internal server error';
    resultPrint.status = httpCodeStatus || resultPrint.status;
    resultPrint.message = err || message;
  }

  if (res === undefined) return resultPrint;
  return res.status(resultPrint.status).json(resultPrint);
};

exports.successResponse = (res, status, obj, extra) => {
  let resultPrint = {};
  resultPrint.status = status || 200;

  if (isObject(obj)) {
    resultPrint = {
      ...resultPrint,
      ...obj,
    };
  } else {
    resultPrint.message = obj;
  }
  if (isObject(extra)) {
    Object.assign(resultPrint, extra);
  }
  if (res === undefined) return resultPrint;
  return res.status(resultPrint.status).json(resultPrint);
};

exports.loadFile = (dirname, basename) => {
  const load = {};

  fs.readdirSync(dirname)
    /* eslint-disable-next-line */
    .filter(
      (file) => file.indexOf('.') !== 0
        && file !== basename
        && file.slice(-3) === '.js',
    )
    .forEach((file) => {
      const pathFile = path.join(dirname, file);
      const filename = camelCase(path.basename(file, '.js'));

      /* eslint-disable-next-line */
      load[filename] = require(pathFile);
    });
  return load;
};

exports.parseQueryFilter = (filters = []) => {
  const where = {};
  filters.forEach((filter) => {
    where[filter.key] = {
      [Op[filter.operation]]: filter.value,
    };
  });
  return where;
};

exports.parsedSortQueryToSortArr = (sortString = '') => {
  if (sortString === '') return [];
  const splittedSort = sortString.split(',');

  return splittedSort.map((sort) => {
    const order = sort.charAt(0) === '-' ? 'DESC' : 'ASC';
    return [sort.substring(1), order];
  });
};

exports.clearObjectEmptyField = (obj) => {
  for (const propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined) {
      delete obj[propName];
    }
  }
};

exports.clearArray = (arr) => arr.filter((el) => el !== null && el !== undefined);

exports.parseSortBy = (sortBy) => {
  if (!sortBy) return [];
  const parsedSortBy = [];

  const sorters = sortBy.split(',');

  sorters.forEach((sorter) => {
    const field = sorter.split(':');
    if (field.length === 1) parsedSortBy.push([field[0], 'ASC']);
    else parsedSortBy.push(field);
  });
  return parsedSortBy;
};