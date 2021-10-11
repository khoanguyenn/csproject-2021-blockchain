//Global import
const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const bcrypt = require("bcrypt");
const path = require('path');
const express = require('express');
const router = express.Router();

//File path resolving 
const { serverRoot } = require("../helpers/pathUtil");
const caPath = path.join(serverRoot, 'src', 'helpers', 'CAUtil.js');
const appPath = path.join(serverRoot, 'src', 'helpers', 'AppUtil.js');
const walletPath = path.join(serverRoot, 'wallet');
const salt = "$2b$10$J0HvW7R6cIMsagwfPPZ2JO";

//Import helpers
const { buildCAClient, registerAndEnrollUser} = require(caPath);
const { buildCCPOrg1, buildWallet } = require(appPath);

//Configuration
const mspOrg1 = 'ManufacturerMSP';


const connect2CA = async (req, res, next) => {
    const ccp = buildCCPOrg1();
    const wallet = await buildWallet(Wallets, walletPath);
    const caClient = buildCAClient(FabricCAServices, ccp, 'ca.Manufacturer.example.com');
    
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
        const {caClient, ccp, wallet} = req.networkConnect;
        const concatStr = username + password;
        const userId = await bcrypt.hashSync(concatStr, salt);

        const userIdentity = await wallet.get(userId);
        if (userIdentity) {
			res.send(`An identity for the user ${userId} already exists in the wallet`);
            return;
        }

        await registerAndEnrollUser(caClient, wallet, mspOrg1, userId, 'manufacturer.department1'); 
        console.log(await wallet.list())
        res.send("what?")}
    catch(err){
        console.log("[ERROR]: " + err);
    }
}

const login = async (req, res) => {
    try{
        const {username, password} = req.body;
        const {caClient, ccp, wallet} = req.networkConnect;
        const concatStr = username + password;
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
    connect2CA: connect2CA,
    signup,
    login,
};