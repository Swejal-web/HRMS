const knex = require('knex');

const database = require('./config/database');

const db = knex(database);

module.exports = db;
