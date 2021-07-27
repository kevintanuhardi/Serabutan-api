const models = require('../app/db/models');

module.exports = async () => {
  if (process.env.NODE_ENV !== 'test') {
    return null;
  }
  return Promise.all(
    Object.keys(models).map((key) => {
      if (['sequelize', 'Sequelize'].includes(key)) return null;
      return models[key].truncate({ where: {}, force: true });
    }),
  );
};
