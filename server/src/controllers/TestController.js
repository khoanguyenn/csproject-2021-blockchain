const express = require('express');
const router = express.Router();

const TestMiddleware = require('../middleware/TestMiddleware');

router.get('/login', TestMiddleware.login);

module.exports = router;