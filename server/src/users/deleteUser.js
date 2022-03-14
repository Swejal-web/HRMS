const db = require('../database');

const deleteuserId = async (id) => {
  await db('users').del().where({ id });
};

module.exports = deleteuserId;
