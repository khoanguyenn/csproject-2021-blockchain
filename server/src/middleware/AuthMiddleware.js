/**
 * This is the authentication middle, contains all function to authentication
 * and authorize the equivalent parties
 * @author Dang Khoa Nguyen
 * @version 1.0
 */

//Dependencies
const bcrypt = require("bcrypt");
const path = require("path");
const { Wallets } = require("fabric-network");
const { buildWallet } = require("../helpers/AppUtil");

//Helper functions
const AuthService = require("../helpers/AuthService");
const {registerAndEnrollUser} = require('../helpers/CAUtil');
const { serverRoot } = require("../helpers/pathUtil");

//Configuration
const salt = "$2b$10$J0HvW7R6cIMsagwfPPZ2JO";

const mspOrgs = {
    "manufacturer": "ManufacturerMSP",
    "distributor": "DistributorMSP",
    "medicalunit": "MedicalunitMSP",
}    

const caHostnameList = {
    "manufacturer": "ca.Manufacturer.example.com",
    "distributor": "ca.Distributor.example.com",
    "medicalunit": "ca.Medicalunit.example.com",
}

const walletFolder = {
    "manufacturer": "wallet",
    "distributor": "walletDistributor",
    "medicalunit": "walletMedic",
}

const affiliationList = {
    "manufacturer": "manufacturer.department1",
    "distributor": "distributor.department1",
    "medicalunit": "medicalunit.department1",
}

const roleList = ["manufacturer", "distributor", "medicalunit"];

const signup = async (req, res) => {
    try{
        //Check if username and password are in correct form
        const {username, password, role} = req.body;
        if (!username && !password) {
            throw Error(`Please provide username and passsword!`);
        }
        if (!roleList) {
            throw Error("Please specify the signup role");
        }
        if (!roleList.includes(role)) {
            throw Error(`There is no ${role} role`);
        }
        //Get connection materials
        const caHostname = caHostnameList[role];
        const walletPath = path.resolve(serverRoot, walletFolder[role]);
        const { caClient, wallet } = await AuthService.getMaterials(caHostname, walletPath, role);

        const concatStr = username + password;
        const userId = await bcrypt.hashSync(concatStr, salt);

        //Find the available identites
        const userIdentity = await wallet.get(userId);
        if (userIdentity) {
			throw Error(`An identity for the user ${userId} already exists in the wallet`);
        }
        //Enroll new user
        const mspOrg = mspOrgs[role];
        const affiliation = affiliationList[role];
        await registerAndEnrollUser(caClient, wallet, mspOrg, userId, affiliation); 
        req.userId = userId;
        res.json({
            message: `User ${userId} sign up successfully!`
        })
    }
    catch(err){
        console.log("[ERROR]: " + err);
        res.status(400).json({
            message: err.message
        })
    }
}


const authenticate = async (req, res, next) => {
    try{
        const {username, password} = req.body;
        const concatStr = username + password;

        //Check the available user identity
        const userId = await bcrypt.hashSync(concatStr, salt);
        const { wallet, userRole } = await getRole(userId);
        if (!userRole && !wallet) {
            throw Error("Invalid username and password!");
        }

        req.userId = userId;
        req.role = userRole;
        const expireDate = getExpireDate(60);
        console.log(expireDate);
        res.cookie("userId", userId, {
            expireDate,
        });
        next();
    }
    catch(err){
        console.log("[ERROR]: " + err);
        res.status(400).send(err);
    }

}
const logout = async (req, res, next) => {
    res.clearCookie('userId');
    res.redirect('/auth/login')
}

const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies;
        const userId = token.userId;
        if (!userId) {
            throw Error("Please login before moving on!");
        }
        req.userId = userId;
        next();
    } catch(err) {
        console.log("[ERROR]: " + err);
        res.status(400).json({
            "message": err.message
        });
    }
}

/**
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next
 * This function try to connect to the Manufacturer's CA server to check,
 * whether the given user's id belongs to manufacturer
 */
const isManufacturer = async (req, res, next) => {
    console.log('Manufacturer: ' + req.userId);
    try {
        const {userRole: role} = await getRole(req.userId);
        console.log("Role: " + role);
        if (role === "manufacturer") {
            next();
        }
    } catch(err) {
        console.log("[ERROR]: " + err);
        
    }
}

const isDistributor = async (req, res, next) => {
    try {
        const {userRole: role} = await getRole(req.userId);
        if (role === "distributor") {
            next();
        }
        
    } catch(err) {
        console.log("[ERROR]: " + err);
    }
    next();

}

const isMedicalUnit = async (req, res, next) => {
    try {
        const {userRole: role} = await getRole(req.userId);
        if (role === 'medicalunit') {
            next();
        }
    } catch(err) {
        console.log("[ERROR]: " + err);
    }
}
/**======================Helper functions======================*/

//Check the role base on userId
const checkRole = (req, res) => {
    const userRole = req.role;
    const redirectList = {
        "manufacturer": "/manufacturer",
        "distributor": "/distributor",
        "medicalunit": "/medical-unit",
    }
    const destination = redirectList[userRole];
    res.redirect(destination);
}

const getRole = async (userId) => {
    const roles = ["manufacturer", "distributor", "medicalunit"];
    let wallet = {};
    let mspId = "";
    for (const role of roles) {
        let walletFolder = "";

        if (role === "manufacturer") {
            walletFolder = "wallet";
        }
        if (role === "distributor") {
            walletFolder = "walletDistributor"
        }
        if (role == "medicalunit") {
            walletFolder = "walletMedic"
        }
        const walletPath = path.resolve(serverRoot, walletFolder);
        const tempWallet = await buildWallet(Wallets, walletPath);
        const userIdentity = await tempWallet.get(userId);
        if (userIdentity) {
            wallet = tempWallet;
            mspId = userIdentity.mspId;
            break;
        }
    }
    //Attach the role for later check
    const userRole = mspId.substring(0, mspId.length - 3).toLowerCase();
    return {
        wallet,
        userRole,
    };
}

/**
 * This utility function to calculate exxpire date of cookie
 */
const getExpireDate = (minute) => {
    const now = new Date();
    const time = now.getTime();
    const expireDate = time + 1000 * 60 * minute;
    now.setTime(expireDate);
    return now.toUTCString();
}

module.exports = {
    signup,
    authenticate,
    logout,
    checkRole,
    verifyToken,
    isManufacturer,
    isDistributor, 
    isMedicalUnit,
};