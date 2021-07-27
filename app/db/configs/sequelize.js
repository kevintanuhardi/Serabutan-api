const config = require('../../../config');

const { NODE_ENV } = process.env;

// let selectedDatabase ;

let selectedDatabase;
switch (NODE_ENV) {
  case 'production':
    selectedDatabase = config.get('db_production');
    break;

  default:
    process.env.NODE_ENV = 'dev';
    selectedDatabase = config.get('db_dev');
    break;
}

const {
  database, username, password, host, port, dialect,
} = selectedDatabase;

module.exports = {
  username,
  password,
  database,
  host,
  port,
  dialect,
  logging: NODE_ENV === 'dev' || !NODE_ENV ? console.log : null,
  // eslint-disable-next-line no-console
};
