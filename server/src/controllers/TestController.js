const express = require('express');
const router = express.Router();

const TestMiddleware = require('../middleware/TestMiddleware');

router.get('/login', TestMiddleware.login);
router.post('/login', TestMiddleware.getInfo)

router.get('/user', TestMiddleware.userPage)

module.exports = router;