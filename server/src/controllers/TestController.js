const express = require('express');
const router = express.Router();

const RenderMiddleware = require('../middleware/RenderMiddleware');

router.get('/login', RenderMiddleware.loginPage);
router.post('/login', RenderMiddleware.getInfo)

router.get('/user', RenderMiddleware.userPage)

module.exports = router;