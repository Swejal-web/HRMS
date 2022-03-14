const db = require('../database');

exports.getUserId = async (id) => {
  const user = await db('users').where({ id }).first();

  return user;
};

exports.getUserEmail = async (email) => {
  const user = await db('users').where({ email });

  return user;
};
