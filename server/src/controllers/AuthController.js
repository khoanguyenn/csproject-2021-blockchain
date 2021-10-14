const express = require('express');
const router = express.Router();

const AuthMiddleware = require('../middleware/AuthMiddleware');
const RenderMiddleware = require('../middleware/RenderMiddleware');

router.post('/signup', AuthMiddleware.signup);

// This is the example of checking manufacturer role
router.post("/test", AuthMiddleware.verifyToken, AuthMiddleware.isManufacturer, (req, res) => {
    res.send("Hello private page for manufacturer here!");
})
router.get('/login', RenderMiddleware.loginPage)
router.post('/login', AuthMiddleware.login, AuthMiddleware.isManufacturer, (req, res) => {
    res.redirect('/manufacturer');
});


module.exports = router;