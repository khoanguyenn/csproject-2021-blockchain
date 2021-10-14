const express = require('express');
const router = express.Router();
const {createContract, disconnetGateway}=require('../helpers/web_util')
const TestMiddleware = require('../middleware/TestMiddleware');

router.get('/login', TestMiddleware.login);
router.post('/login', TestMiddleware.getInfo)
router.get('/user', TestMiddleware.userPage)






router.post('/parcip/init',async (req, res)=>{
    const contract = await createContract();

    let data = await contract.submitTransaction('TestInit') 
    res.send("done")
})
router.get('/parcip/getAllManu',async (req, res)=>{
    const contract = await createContract();
    let data = await contract.evaluateTransaction('GetAllManufacturerLots') 
    res.send(data)
})
//GROUP 1 ERROR, data NOT CHANGED 
router.post('/parcip/manu2dist',async (req,res)=>{
    var data1 = String(req.body.lotID)
    const contract = await createContract();
    let data = await contract.evaluateTransaction('DeliverToDistributor',data1) 
    console.log("confirmed vaccine lot "+ data1 +" is now under DISTRIBUTOR jurisdiction")
   
    res.send("work done, this implies theh vaccine lot "+data1+" has been moved to DISTRIBUTOR")
    const contract2 = await createContract();
    let data2 = await contract2.evaluateTransaction('GetManufacturerLogs')
    console.log(JSON.parse(data2.toString()))

})
router.post('/parcip/divideVacc',async (req, res)=>{
    var data1 = String(req.body.lotID)
    const contract = await createContract();
    let data = await contract.evaluateTransaction('DivideVaccineLot',data1) 
    res.send(data)
})
//end group 1 Error
router.post('/parcip/deliverMedUnit',async (req, res)=>{
    var data1 = String(req.body.lotID)
    const contract = await createContract();
    let data = await contract.evaluateTransaction('DeliverToMedicalUnit',data1) // err wtf ?
    res.send(data)
})

module.exports = router;