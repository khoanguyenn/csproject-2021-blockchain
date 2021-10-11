const express = require("express");
const router = express.Router();
const {createContract, disconnetGateway} = require ('../helpers/web_util')

/**
 * @author Ngo Quoc Thai
 * @returns json array
 */
router.get('/manufacturer', async function (req, res){
    try {
        const contract = await createContract();
        let logs = await contract.evaluateTransaction('GetDispatchLogs');
        res.json(JSON.parse(logs.toString()));
    } catch (error) {
        console.log('error: ' + error);
        res.send(404);
    } finally {
        disconnetGateway();
    }
})  


/**
 * @author Ngo Quoc Thai
 * @returns json array
 */
router.get('/distributor', async function (req, res) {
    try {
        const contract = await createContract();
        let logs = await contract.evaluateTransaction('GetDeliveryLogs');
        res.json(JSON.parse(logs.toString()));
    } catch (error) {
        console.log('error: ' + error);
        res.send(404);
    } finally {
        disconnetGateway();
    }
})

module.exports = router


