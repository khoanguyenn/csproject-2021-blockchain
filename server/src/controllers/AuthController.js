const express = require('express');
const router = express.Router();

const AuthMiddleware = require('../middleware/AuthMiddleware');

router.post('/signup', AuthMiddleware.signup);
router.post('/login', AuthMiddleware.login);
// This is the example of checking manufacturer role
router.post("/test", AuthMiddleware.verifyToken, AuthMiddleware.isManufacturer, (req, res) => {
    res.send("Hello private page for manufacturer here!");
})


module.exports = router;