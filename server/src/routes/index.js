//Controllers
const AuthController = require("../controllers/AuthController");
const TestController = require('../controllers/TestController');
const DistributorController = require("../controllers/DistributorController");
const MedicalUnitController = require("../controllers/medicalunit");
const ManufacturerController=require("../controllers/ManufacturerController");
const UserController = require('../controllers/UserController')

//Init ledger
const { createContract, disconnetGateway} = require('../helpers/web_util');

//Hyperledger Fabric library import
const path = require('path');
const FabricCAServices = require("fabric-ca-client");
const { Wallets } = require("fabric-network");

//Helper function
const { buildWallet, buildCCPOrg } = require("../helpers/AppUtil");
const { buildCAClient, enrollAdmin, registerAndEnrollUser } = require("../helpers/CAUtil");
const { serverRoot } = require("../helpers/pathUtil");

//This function to apply the controller to the application webserver
const initApp = (app) => {
    app.use("/auth",  AuthController)
    app.use("/manufacturer", ManufacturerController);
    app.use("/distributor", DistributorController);
    app.use("/medical-unit", MedicalUnitController);
    app.use("/user", UserController)

    //This route is used for testing purpose only
    app.use('/test', TestController)
}

//This function to initialize some mock data for development purposes
const initLedger = async (app) => {
    try {
        const contract = await createContract();
        await contract.submitTransaction('InitVaccineLot');
        await contract.submitTransaction('InitVaccine');
        
    } catch (err) {
        console.error("error: " + err)
    } finally {
        disconnetGateway();
    }
}


const initAdminAccounts = async () => {
    await initManufacturerAccount();
    await initDistributorAccount();
    await initMedicAccount();
}

const initManufacturerAccount = async () => {
    //Configuration for manufacturer organization
    const manufacturerHostname = "ca.Manufacturer.example.com";
    const mspOrg = 'ManufacturerMSP';
    const userId = "khoanguyenn";
    const affiliation = "manufacturer.department1";
    const walletManufacturer = path.resolve(serverRoot, "wallet");
    const ccpOrg = 'manufacturer'

    //Get the CA-client and wallet
    const {caClient, wallet} = await initAdmins(manufacturerHostname, walletManufacturer, ccpOrg)
    
    //Enroll the admin identity
    await enrollAdmin(caClient, wallet, mspOrg);

    //Enroll user
    await registerAndEnrollUser(caClient, wallet, mspOrg, userId, affiliation)
}

const initDistributorAccount = async () => {
    //Configuration for distributor organization
    const distributorHostname = "ca.Distributor.example.com";
    const mspOrg = 'DistributorMSP';
    const userId = "khoanguyenn";
    const affiliation = "distributor.department1";
    const walletDistributor = path.resolve(serverRoot, "walletDistributor");
    const ccpOrg = 'distributor'

    //Get the CA-client and wallet
    const {caClient, wallet} = await initAdmins(distributorHostname, walletDistributor, ccpOrg)
    
    //Enroll the admin identity
    await enrollAdmin(caClient, wallet, mspOrg);

    //Enroll user
    await registerAndEnrollUser(caClient, wallet, mspOrg, userId, affiliation)
}

const initMedicAccount = async () => {
    //Configuration for medicalunit organization
    const medicalUnitHostname = "ca.Medicalunit.example.com";
    const mspOrg = 'MedicalunitMSP';
    const userId = "khoanguyenn";
    const affiliation = "medicalunit.department1";
    const walletMedic = path.resolve(serverRoot, "walletMedic");
    const ccpOrg = 'medicalunit'

    //Get the CA-client and wallet
    const {caClient, wallet} = await initAdmins(medicalUnitHostname, walletMedic, ccpOrg)
    
    //Enroll the admin identity
    await enrollAdmin(caClient, wallet, mspOrg);

    //Enroll user
    await registerAndEnrollUser(caClient, wallet, mspOrg, userId, affiliation);

}
/**
 * Helper functions to init the admin accounts of different organizations
 */
const initAdmins = async (caHostname, walletPath, ccpOrg) => {
    const ccp = buildCCPOrg(ccpOrg);
    const caClient = buildCAClient(FabricCAServices, ccp, caHostname);
    const wallet = await buildWallet(Wallets, walletPath);
    return {
        caClient,
        wallet
    }
}

module.exports = {
    initApp,
    initLedger,
    initAdminAccounts
};
