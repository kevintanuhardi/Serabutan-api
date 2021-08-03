/* global Helpers */
const models = require('../db/models');

module.exports = (modelName) => ({
  create: async (newData) => models[modelName].create(newData),
  findOrCreate: async (newData, searchFields) => {
    const search = {};

    searchFields.forEach((field) => {
      search[field] = newData[field];
    });

    const datum = await models[modelName].findOne({ where: search });

    if (datum) {
      return datum;
    }

    return models[modelName].create(newData);
  },
  list: async ({
    where = {}, paging = {}, association, arrOrder, group, plain = false,
  }) => {
    const { limit, offset = 0 } = paging;

    const parsedLimit = limit ? Number(limit) : null;

    const include = association || null;

    const queryResult = await models[modelName].findAll({
      where,
      include,
      limit: parsedLimit,
      offset,
      group,
      order: arrOrder,
    });
    if (plain === false) {
      return queryResult;
    }
    return queryResult.map((el) => el.get({ plain: true }));
  },
  findOne: async (where, include) => models[modelName].findOne({
    where,
    include,
  }),
  update: async (where, field) => {
    Helpers.clearObjectEmptyField(field);
    return models[modelName].update(field, { where });
  },
  upsert: async (newData, uniqueFields) => {
    const instance = await models[modelName].findOne({ where: uniqueFields });

    if (instance) {
      return instance.update(newData);
    }
    return models[modelName].create({ ...newData, ...uniqueFields });
  },
  delete: async (where) => models[modelName].destroy({ where }),
  count: async (where = {}, include = null, group = null) => {
    const data = await models[modelName].findAndCountAll({
      where,
      include,
      group,
    });
    const { rows = 0 } = data;
    return rows.length;
  },
  bulkCreate: async (newData) => models[modelName].bulkCreate(newData),
});
