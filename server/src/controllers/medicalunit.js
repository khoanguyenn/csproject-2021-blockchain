const express = require("express");
const router = express.Router();
const {createContract, disconnetGateway} = require ('../helpers/web_util')
const RenderMiddleware = require('../middleware/RenderMiddleware');


router.get('/', RenderMiddleware.medicalUnitPage)

/**
 * @author Ngo Quoc Thai
 * @description divide the vaccine lot into ready-to-use vaccines
 * @returns status code
 */
router.post('/vaccinate', async function (req, res){
    let vaccineLotID = String(req.body.vaccineLot)
    try {
        const contract = await createContract();
        await contract.submitTransaction('DivideVaccineLot', vaccineLotID);
        res.sendStatus(200)
    } catch (error) {
        console.log('error: ' + error);
        res.send(404);
    } finally {
        disconnetGateway();
    }
})  

/**
 * @author Ngo Quoc Thai
 * @description transfer owner of the vaccine to user 
 * @returns status code
 */
router.put('/vaccinate', async function (req, res){
    let vaccineID = String(req.body.vaccineID);
    let userID = String(req.body.userID);
    try {
        const contract = await createContract();
        await contract.submitTransaction('VaccinateCitizen', vaccineID, userID);
        res.sendStatus(200);
    } catch (error) {
        console.log('error: ' + error);
        res.send(404);
    } finally {
        disconnetGateway();
    }
})  

/**
 * @author Ngo Quoc Thai
 * @description get used vaccines of specific userID
 * @returns JSON array
 */
router.get('/vaccinate', async function (req, res) {
    let userID = req.query.userID;
    try {
        const contract = await createContract();
        let result = await contract.evaluateTransaction('CheckVaccinateState', userID);
        res.json(JSON.parse(result.toString()));
    } catch (error) {
        console.log('error: ' + error);
        res.send(404);
    } finally {
        disconnetGateway();
    }
})



module.exports = router;


