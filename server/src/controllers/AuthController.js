const express = require('express');
const router = express.Router();

const AuthMiddleware = require('../middleware/AuthMiddleware');

router.post('/signup', AuthMiddleware.connectToManufacturerCA, AuthMiddleware.signup);
router.post('/login', AuthMiddleware.connectToManufacturerCA, AuthMiddleware.login);


module.exports = router;