//Controllers
const AuthController = require("../controllers/AuthController");
const TestController = require('../controllers/TestController');
const DistributorController = require("../controllers/distributor");


const initApp = (app) => {
    app.use("/auth",  AuthController)
    app.use("/manufacturer", (req, res) => {console.log("Manufacturer route is here!"); res.send("manufacturer")});
    app.use("/distributor", DistributorController)
    app.use("/medical-unit", (req, res) => {console.log("Medical Unit route is here!"); res.send("medical unit")})

    app.use('/test', TestController)
}

module.exports = initApp;
