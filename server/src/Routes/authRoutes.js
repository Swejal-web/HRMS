const express = require('express');
const authController = require('../Controller/authController');

const router = express.Router();

router.route('/auth/google/url').get(authController.getUrl);

router.route('/auth/google').get(authController.getAuthUser);

router.route('/auth/me').get(authController.protect, authController.getMe);

module.exports = router;
