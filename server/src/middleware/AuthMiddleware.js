/**
 * This is the authentication middle, contains all function to authentication
 * and authorize the equivalent parties
 * @author Dang Khoa Nguyen
 * @version 1.0
 */

//Dependencies
const bcrypt = require("bcrypt");

//Helper functions
const AuthService = require("../helpers/AuthService");
const {registerAndEnrollUser} = require('../helpers/CAUtil');

//Configuration
const mspOrg1 = 'ManufacturerMSP';
const mspAddress = 'ca.Manufacturer.example.com'
const salt = "$2b$10$J0HvW7R6cIMsagwfPPZ2JO";

const signup = async (req, res) => {
    try{
        //Check if username and password are in correct form
        const {username, password} = req.body;
        if (!username && !password) {
            throw Error(`Please provide username and passsword!`);
        }
        
        //Create the hash string for username and password
        const concatStr = username + password;
        const { caClient, wallet } = await AuthService.connectToCA(mspAddress);
        const userId = await bcrypt.hashSync(concatStr, salt);

        //Find the available identities
        const userIdentity = await wallet.get(userId);
        if (!userIdentity) {
			throw Error(`An identity for the user ${userId} already exists in the wallet`);
        }

        //Enroll new user
        await registerAndEnrollUser(caClient, wallet, mspOrg1, userId, 'manufacturer.department1'); 
        // console.log(await wallet.list())

        req.userId = userId;
        res.send(`User ${userId} sign up successfully!`);
    }
    catch(err){
        console.log("[ERROR]: " + err);
        res.status(400).send(err);
    }
}

const login = async (req, res, next) => {
    try{
        const {username, password} = req.body;
        const concatStr = username + password;
        const { wallet } = await AuthService.connectToCA("ca.Manufacturer.example.com")

        //Check the available user identity
        const userId = await bcrypt.hashSync(concatStr, salt);

        const userIdentity = await wallet.get(userId);
        if (!userIdentity) {
            throw Error("Invalid username and password!");
        }

        req.userId = userId;
        res.cookie("userId", userId, {maxAge: 60 * 60 * 24});
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
        if (!token && !userId) {
            throw Error("Please login before moving on!");
        }
        req.userId = userId;
        next();
    } catch(err) {
        console.log("[ERROR]: " + err);
        res.status(400).send(err);
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
        const role = await getRole("ca.Manufacturer.example.com", req.userId);
        console.log("Role: " + role);
        if (role !== 'manufacturer') {
            throw Error("this route is not for you, only for manufacturer");
        }
        next();

    } catch(err) {
        res.send(err.message);
    }
}

const isDistributor = async (req, res, next) => {
    try {
        const role = await getRole("ca.Distributor.example.com", req.userId);
        if (role !== 'distributor') {
            throw Error("this route is not for you, only for manufacturer");
        }
        next();

    } catch(err) {
        res.send(err.message);
    }
}

const isMedicalUnit = async (req, res, next) => {
    try {
        const role = await getRole("ca.MedicalUnit.example.com", req.userId);
        if (role !== 'medicalunit') {
            throw Error("this route is not for you, only for manufacturer");
        }
        next();

    } catch(err) {
        res.send(err.message);
    }
}

/**
 * 
 * @param {String} CAHostName 
 * @param {String} userId 
 * @returns {String} role
 * This utilizity function try to find the role of given user's id
 */
const getRole = async (CAHostName, userId) => {
    const { wallet } = await AuthService.connectToCA(CAHostName)
    const userIdentity = await wallet.get(userId);
    if (!userIdentity) {
        throw Error("Invalid token!");
    }
    const { mspId } = userIdentity;
    //Attach the role for later check
    const role = mspId.substring(0, mspId.length - 3).toLowerCase();
    return role;
}

module.exports = {
    signup,
    login,
    logout,
    verifyToken,
    isManufacturer,
    isDistributor, 
    isMedicalUnit,
};