const express = require('express');
const router = express.Router();

const AuthMiddleware = require('../middleware/AuthMiddleware');
const RenderMiddleware = require('../middleware/RenderMiddleware');

//FLOW: login -> checkrole & redirect -> page
router.post('/signup', AuthMiddleware.signup);
router.get('/signup', RenderMiddleware.registerPage);

router.get('/logout', AuthMiddleware.logout);
router.get('/login', RenderMiddleware.loginPage)
router.post('/login', AuthMiddleware.authenticate, AuthMiddleware.checkRole);

// This is the example of checking manufacturer role
// router.post("/test", AuthMiddleware.verifyToken, AuthMiddleware.isManufacturer, AuthMiddleware.isDistributor, (req, res) => {
//     res.send("Who are you ?");
// })

module.exports = router;