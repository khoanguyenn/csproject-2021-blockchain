
const { Wallets, Gateway } = require('fabric-network');
const path = require('path');
//const { buildCCPOrg1, buildWallet } = require('../../../../server/utils/javascript/AppUtil.js.js');
const { buildCCPOrg1, buildWallet } =require('../helpers/AppUtil')// Note _Pham Minh Huy: you guys missed this line, rendering contract creation failure
const walletPath = path.join(__dirname, '../../wallet');
const channelName = 'mychannel';
const chaincodeName = 'ledger';
let gateway;

/**
 * @author Ngo Quoc Thai
 * @description create a gateway for user to interact with network through returned object contract
 * @updated 9 Oct 2021 by Pham Minh Huy, bringing userid to the contract parameter for future updates regarding logins
 * @returns an object that can call chaincode functions
 */


exports.createContract = async function (userId = 'admin') {
    const ccp = buildCCPOrg1();
    const wallet = await buildWallet(Wallets, walletPath);
    gateway = new Gateway();
    try {
        await gateway.connect(ccp, {
            wallet,
            identity: userId,
            discovery: {enabled: true, asLocalhost: true}
        });
        const network = await gateway.getNetwork(channelName);
        return network.getContract(chaincodeName);
    } catch (error) {
        console.log('error' + error); 
    }
}

/**
 * @author Ngo Quoc Thai
 * @description close gateway, not let user interact with network
 */
exports.disconnetGateway = function () {
    gateway.disconnect();
}