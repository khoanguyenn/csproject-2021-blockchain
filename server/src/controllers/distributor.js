const express = require("express")
const router = express.Router()
const {createContract, disconnetGateway}=require('../helpers/web_util')
const RenderMiddleware = require("../middleware/RenderMiddleware");

router.get("/", RenderMiddleware.distributorPage);
router.get("/delivery", RenderMiddleware.distributorDeliveryPage);
/**
 * @author Ha Xuan Huy
 * @returns all vaccine lots from distributor
 */
 router.get("/vaccines", async function (req, res) {
  try {
      const contract = await createContract();

      console.log(`GET all vaccine lots from distributor`)
      let data = await contract.evaluateTransaction('GetDistributorLots') 
      res.status(200).json(JSON.parse(data.toString()))
      
  } catch (err) {
      console.error("error: " + err)
      res.send(500)
  } finally {
    disconnetGateway();
  }
})

/**
 * @author Ha Xuan Huy
 * @returns a vaccine lot with given ID from distributor
 */
 router.get("/vaccines/:vaccineID", async function (req, res) {
   let key=req.params.vaccineID
  try {
      const contract = await createContract();
      console.log(`GET a vaccine lot with id ${key} from distributor`)
      let data = await contract.evaluateTransaction('GetDistributorLot', key) 
      res.status(200).json(JSON.parse(data.toString()))
  } catch (err) {
      console.error("error: " + err)
      res.send(500)
  } finally {
    disconnetGateway();
  }
})


// PUT /distributor/delivery with body request {"vaccineLot":"value"}
/**
 * @author Ha Xuan Huy
 * @returns deliver vaccine lot with given ID to medical unit
 */
 router.put("/delivery", async function (req, res) {
  
  try {
      var key =String(req.body.vaccineLot)
      const contract = await createContract();
      console.log(`Deliver vaccine lot with id ${key} to medical unit `)
      await contract.submitTransaction('DeliverToMedicalUnit', key) 
      res.sendStatus(200)
  } catch (err) {
      console.error("error: " + err)
      res.sendStatus(500)
  } finally {
    disconnetGateway();
  }
})


/**
 * @author Ha Xuan Huy
 * @coauthor Pham Minh Huy @return all vaccine lot that HAS BEEN, at some interval of time, under DISTRIBUTOR
 * @returns all distributor's delivery logs 
 */
 router.get("/logs", async function (req, res) {
  try {
      let dummyVal="dummy"
      const contract = await createContract();

      console.log(`GET all distributor's delivery logs`)
      let data = await contract.evaluateTransaction('GetDeliveryLogsOf',dummyVal,"distributor") 
      res.status(200).json(JSON.parse(data.toString()))
      
  } catch (err) {
      console.error("error: " + err)
      res.send(500)
  } finally {
    disconnetGateway();
  }
})



router.post('/parcip/test2',async (req, res)=>{
  var var1 = String(req.body.var1)
  var var2 = String(req.body.var2)
  try {
      const contract = await createContract();
      let result = await contract.submitTransaction('GetDeliveryLogsOf', var1, var2);
      res.send("results is "+result);
  } catch (error) {
      console.log('error: ' + error);
      res.send(404);
  } finally {
      disconnetGateway();
  }
})






// PUT /distributor/vaccines with body request {"vaccineLot":"value","name":"value","quantity":"value","dateOfManufacture":"value"}
/**
 * @author Ha Xuan Huy
 * @returns update a vaccine lot in distributor with specific ID
 */
 router.put("/vaccines", async function (req, res) {
  
  try {
      var key1 =String(req.body.vaccineLot)
      var key2 =String(req.body.name)
      var key3 =String(req.body.quantity)
      var key4 =String(req.body.dateOfManufacture)
      const contract = await createContract();

      console.log(`Update information of vaccine lot ${key1} in distributor `)
      await contract.submitTransaction('UpdateDistributorLot', key1,key2,key3,key4) 
      res.sendStatus(200)
  } catch (err) {
      console.error("error: " + err)
      res.sendStatus(500)
  } finally {
    disconnetGateway();
  }
})
//DELETE /distributor/vaccines with body request {"vaccineLot":"value"}
/**
 * @author Ha Xuan Huy
 * @returns delete a vaccine lot with specific ID in distributor
 */
 router.delete("/vaccines", async function (req, res) {
  
  try {
      var key =String(req.body.vaccineLot)
      const contract = await createContract();

      console.log(`Delete the vaccine lot ${key} in distributor `)
      await contract.submitTransaction('DeleteDistributorLot', key) 
      res.sendStatus(200)
  } catch (err) {
      console.error("error: " + err)
      res.sendStatus(500)
  } finally {
    disconnetGateway();
  }
})

module.exports = router
