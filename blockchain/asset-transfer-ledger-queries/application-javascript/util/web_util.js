
const { Wallets, Gateway } = require('fabric-network');
const path = require('path');
const { buildCCPOrg1, buildWallet } = require('../../../test-application/javascript/AppUtil.js');

const walletPath = path.join(__dirname, '../wallet');
const channelName = 'mychannel';
const chaincodeName = 'ledger';
const userId = 'appUser';
let gateway;

/**
 * @author Ngo Quoc Thai
 * @description create a gateway for user to interact with network through returned object contract
 * @returns an object that can call chaincode functions
 */
exports.createContract = async function () {
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