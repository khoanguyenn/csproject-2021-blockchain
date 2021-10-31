//Global import
const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');

//File path resolving 
const { serverRoot } = require("./pathUtil");
const { buildCCPOrg } = require('./AppUtil');
const caPath = path.join(serverRoot, 'src', 'helpers', 'CAUtil.js');
const appPath = path.join(serverRoot, 'src', 'helpers', 'AppUtil.js');
const walletPath = path.join(serverRoot, 'wallet');

//Import helpers
const { buildCAClient } = require(caPath);
const { buildCCPOrg1, buildWallet } = require(appPath);



const connectToCA = async (caHostName) => {
    const ccp = buildCCPOrg1();
    const wallet = await buildWallet(Wallets, walletPath);
    const caClient = buildCAClient(FabricCAServices, ccp, caHostName);

    return {
        caClient: caClient,
        ccp: ccp,
        wallet: wallet,
    };
}

const getMaterials = async (caHostName, walletPath, ccpOrg) => {
    const ccp = buildCCPOrg(ccpOrg);
    const wallet = await buildWallet(Wallets, walletPath);
    const caClient = buildCAClient(FabricCAServices, ccp, caHostName);

    return {
        caClient,
        wallet,
    }
}

module.exports = {
    connectToCA,
    getMaterials
};