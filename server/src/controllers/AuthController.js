const express = require('express');
const router = express.Router();

const AuthMiddleware = require('../middleware/AuthMiddleware');

router.post('/signup', AuthMiddleware.connect2CA, AuthMiddleware.signup);
router.post('/login', AuthMiddleware.connect2CA, AuthMiddleware.login);


module.exports = router;