//Controllers
const AuthController = require("../controllers/AuthController");
const TestController = require('../controllers/TestController');
const DistributorController = require("../controllers/distributor");
const MedicalUnitController = require("../controllers/medicalunit");
const ManufacturerController=require("../controllers/ManufacturerController");

//Init ledger
const { createContract, disconnetGateway} = require('../helpers/web_util');

const initApp = (app) => {
    app.use("/auth",  AuthController)
    app.use("/manufacturer", ManufacturerController);
    app.use("/distributor", DistributorController)
    app.use("/medical-unit", MedicalUnitController)

    app.use('/test', TestController)
    app.get('/manufacturer', (req, res) => {
        res.render('manufacturer', {
            isUserPage: true
        });
    })
}

const initLedger = async (app) => {
    try {
        const contract = await createContract();
        await contract.submitTransaction('InitVaccineLot') 
        
    } catch (err) {
        console.error("error: " + err)
    } finally {
        disconnetGateway();
    }
}

module.exports = {
    initApp,
    initLedger
};
