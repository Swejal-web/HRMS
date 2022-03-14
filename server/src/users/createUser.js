const db = require('../database');

const createUser = async (data) => {
  await db('users').insert({
    id: data.id,
    username: data.username,
    email: data.email,
    roles: data.roles,
  });
};

module.exports = createUser;
