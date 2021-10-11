//Controller
const AuthController = require("../controllers/AuthController");
const AuthMiddleware = require("../middleware/AuthMiddleware");

const initApp = (app) => {
    app.use("/auth",  AuthController)
    app.use("/manufacturer", (req, res) => {console.log("Manufacturer route is here!"); res.send("manufacturer")});
    app.use("/distributor", (req, res) => {console.log("Distributor route is here!"); res.send("distributor")})
    app.use("/medical-unit", (req, res) => {console.log("Medical Unit route is here!"); res.send("medical unit")})
}

module.exports = initApp;