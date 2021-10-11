const bcrypt = require("bcrypt");

//Import helpers
const AuthService = require("../helpers/AuthService");

//Configuration
const mspOrg1 = 'ManufacturerMSP';
const salt = "$2b$10$J0HvW7R6cIMsagwfPPZ2JO";

const connectToManufacturerCA = async (req, res, next) => {
    const { caClient, ccp, wallet } = await AuthService.connectToCA("ca.Manufacturer.example.com")

    req.networkConnect = {
        caClient,
        ccp,
        wallet
    }
    next();
}

const signup = async (req, res) => {
    try{
        const {username, password} = req.body;
        const concatStr = username + password;
        const {caClient, ccp, wallet} = req.networkConnect;
        const userId = await bcrypt.hashSync(concatStr, salt);

        const userIdentity = await wallet.get(userId);
        if (userIdentity) {
			res.send(`An identity for the user ${userId} already exists in the wallet`);
            return;
        }

        await registerAndEnrollUser(caClient, wallet, mspOrg1, userId, 'manufacturer.department1'); 
        console.log(await wallet.list())
        res.send(`User ${userId} sign up successfully!`)}
    catch(err){
        console.log("[ERROR]: " + err);
    }
}

const login = async (req, res) => {
    try{
        const {username, password} = req.body;
        const concatStr = username + password;
        const {caClient, ccp, wallet} = req.networkConnect;
        const userId = await bcrypt.hashSync(concatStr, salt);
        const userIdentity = await wallet.get(userId);
        console.log(userIdentity);
        if (userIdentity) {

            const mspId = userIdentity.mspId;
            const role = mspId.substring(0, mspId.length - 3).toLowerCase();
            console.log("Role: " + role);
            res.cookie("userId", userId, {maxAge: 90000})
            res.send(`Access granted for ${userId}`);
            return;
        }

    }

    catch(err){
        console.log(err);
    }
}

module.exports = {
    connectToManufacturerCA,
    signup,
    login,
};