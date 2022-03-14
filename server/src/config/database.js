const { resolve } = require('path');
const { CONNECTION_STRING } = require('./config');

const database = {
  client: 'postgresql',
  connection: {
    connectionString: CONNECTION_STRING,
  },
  migrations: {
    directory: resolve(__dirname, '../../../migrations'),
    tableName: 'knex_migrations',
  },
};

module.exports = database;
