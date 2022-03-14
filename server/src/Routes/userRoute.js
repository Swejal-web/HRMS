const express = require('express');
const userController = require('../Controller/userController');
const authController = require('../Controller/authController');

const router = express.Router();

router
  .route('/createUser')
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    userController.createNewUser
  );

router.route('/deleteUser/:id').delete(userController.deleteUser);

module.exports = router;
