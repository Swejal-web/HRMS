const { v4 } = require('uuid');

const createUser = require('../users/createUser');
const { getUserId } = require('../users/getUsers');

exports.createNewUser = async (req, res) => {
  const id = v4();
  const { body } = req;
  const data = {
    id: id,
    username: body.username,
    email: body.email,
    roles: body.roles,
  };

  await createUser(data);

  const user = await getUserId(id);
  console.log(user);

  res.json({
    user: user,
  });
};

exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  await deleteuserId(id);
  res.json('User deleted');
};
