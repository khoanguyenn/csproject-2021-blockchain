const express = require("express")
const router = express.Router()
const {createContract, disconnetGateway}=require('../helpers/web_util')

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
 * @returns all distributor's delivery logs 
 */
 router.get("/logs", async function (req, res) {
  try {
      const contract = await createContract();

      console.log(`GET all distributor's delivery logs`)
      let data = await contract.evaluateTransaction('GetDistributorLogs') 
      res.status(200).json(JSON.parse(data.toString()))
      
  } catch (err) {
      console.error("error: " + err)
      res.send(500)
  } finally {
    disconnetGateway();
  }
})

module.exports = router