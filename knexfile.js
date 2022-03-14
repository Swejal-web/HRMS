const { CONNECTION_STRING } = require('./server/src/config/config');

exports.development = {
  client: 'postgres',
  connection: {
    connectionString: CONNECTION_STRING,
  },
  migrations: {
    directory: './migrations',
    tableName: 'knex_migrations',
  },
};
