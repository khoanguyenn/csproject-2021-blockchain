//Controllers
const AuthController = require("../controllers/AuthController");
const TestController = require('../controllers/TestController');
const DistributorController = require("../controllers/distributor");
const MedicalUnitController = require("../controllers/medicalunit");
const ManufacturerController=require("../controllers/manufacturer");

const initApp = (app) => {
    app.use("/auth",  AuthController)
    app.use("/manufacturer", ManufacturerController);
    app.use("/distributor", DistributorController)
    app.use("/medical-unit", MedicalUnitController)

    app.use('/test', TestController)
}

module.exports = initApp;
