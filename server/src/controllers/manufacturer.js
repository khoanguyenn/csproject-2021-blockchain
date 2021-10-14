const express = require("express")
const router = express.Router()
const {createContract, disconnetGateway}=require('../helpers/web_util')


/**
 * @author Ha Xuan Huy
 * @returns all vaccine lots of manufacturer
 */
 router.get("/vaccines", async function (req, res) {
  
  try {
      const contract = await createContract();

      console.log(`GET all vaccine lots from manufacturer`)
      let data = await contract.evaluateTransaction('GetAllManufacturerLots') 
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
 * @returns a vaccine lot with given ID from manufacturer
 */
 router.get("/vaccines/:vaccineID", async function (req, res) {
  let key=req.params.vaccineID
 try {
     const contract = await createContract();
     console.log(`GET a vaccine lot with id ${key} from Manufacturer`)
     let data = await contract.evaluateTransaction('GetManufacturerLot', key) 
     res.status(200).json(JSON.parse(data.toString()))
 } catch (err) {
     console.error("error: " + err)
     res.send(500)
 } finally {
   disconnetGateway();
 }
})

//POST /manufacturer/vaccines with body request {"manufacturer":"value","name":"value","quantity":"value","dateOfManufacture":"value"}
/**
 * @author Ha Xuan Huy
 * @returns create a new vaccine lot
 */
router.post('/vaccines', async function (req, res){
    try {
      var key1 =String(req.body.manufacturer)
      var key2 =String(req.body.name)
      var key3 =String(req.body.quantity)
      var key4 =String(req.body.dateOfManufacture)
        const contract = await createContract();
        await contract.submitTransaction('CreateVaccineLot', key1,key2,key3,key4);
        res.sendStatus(200)
    } catch (error) {
        console.log('error: ' + error);
        res.send(500);
    } finally {
        disconnetGateway();
    }
})  

// PUT /manufacturer/delivery with body request {"vaccineLot":"value"}
/**
 * @author Ha Xuan Huy
 * @returns  transfer vaccine lot from manufacturer to distributor
 */
 router.put("/delivery", async function (req, res) {
  
  try {
      var key =String(req.body.vaccineLot)
      const contract = await createContract();

      console.log(`Deliver vaccine lot with id ${key} to distributor `)
      await contract.submitTransaction('DeliverToDistributor', key) 
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
 * @returns all manufacturer's delivery logs 
 */
 router.get("/logs", async function (req, res) {
  try {
      const contract = await createContract();
      console.log(`all manufacturer's delivery logs`)
      let data = await contract.evaluateTransaction('GetManufacturerLogs') 
      res.status(200).json(JSON.parse(data.toString()))
      
  } catch (err) {
      console.error("error: " + err)
      res.send(500)
  } finally {
    disconnetGateway();
  }
})

// PUT /manufacturer/vaccines with body request {"vaccineLot":"value","name":"value","quantity":"value","dateOfManufacture":"value"}
/**
 * @author Ha Xuan Huy
 * @returns update a vaccine lot in Manufacturer with specific ID
 */
 router.put("/vaccines", async function (req, res) {
  
  try {
      var key1 =String(req.body.vaccineLot)
      var key2 =String(req.body.name)
      var key3 =String(req.body.quantity)
      var key4 =String(req.body.dateOfManufacture)
      const contract = await createContract();

      console.log(`Update information of vaccine lot ${key1} in Manufacturer`)
      await contract.submitTransaction('UpdateManufacturerLot', key1,key2,key3,key4) 
      res.sendStatus(200)
  } catch (err) {
      console.error("error: " + err)
      res.sendStatus(500)
  } finally {
    disconnetGateway();
  }
})

//DELETE /manufacturer/vaccines with body request {"vaccineLot":"value"}
/**
 * @author Ha Xuan Huy
 * @returns delete a vaccine lot with specific ID in Manufacturer
 */
 router.delete("/vaccines", async function (req, res) {
  
  try {
      var key =String(req.body.vaccineLot)
      const contract = await createContract();

      console.log(`Delete the vaccine lot ${key} in Manufacturer `)
      await contract.submitTransaction('DeleteManufacturerLot', key) 
      res.sendStatus(200)
  } catch (err) {
      console.error("error: " + err)
      res.sendStatus(500)
  } finally {
    disconnetGateway();
  }
})


module.exports = router