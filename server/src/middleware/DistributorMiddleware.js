
const securityModule=require("../helpers/secur_util")
const {createContract, disconnetGateway}=require('../helpers/web_util')

/**
 * @author Ha Xuan Huy
 * @returns all vaccine lots from distributor
 */
const GetDistributorLots=async (req, res) =>{
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
}

/**
 * @author Ha Xuan Huy
 * @returns a vaccine lot with given ID from distributor
 */
const getVaccineLot = async  (req, res)=> {
  let key=req.params.vaccineID
  if(securityModule.hasSpecChar(key)){
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
  }
  else return res.send("The ID provided contains special characters")
}


// PUT /distributor/delivery with body request {"vaccineLot":"value"}
/**
 * @author Ha Xuan Huy
 * @returns deliver vaccine lot with given ID to medical unit
 */
const deliverToMedicalUnit =  async (req, res)=> {

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
  
}


/**
 * @author Pham Minh Huy
 * @returns all vaccine lot that HAS BEEN, at some interval of time, under DISTRIBUTOR
 */
const retrieveLogs=async (req, res)=> {
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
}

// PUT /distributor/vaccines with body request {"vaccineLot":"value","name":"value","quantity":"value","dateOfManufacture":"value"}
/**
 * @author Ha Xuan Huy
 * @returns update a vaccine lot in distributor with specific ID
 */
const updateVaccineLot=async  (req, res)=> {
    try {
      var key1 =String(req.body.vaccineLot)
      var key2 =String(req.body.name)
      var key3 =String(req.body.quantity)
      var bool = /^\d+$/.test(key3);
      if (bool){
        if(parseInt(key3)>10000){key3="10000"}
      } 
      if (!bool){key3="10000"}
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
  
}
//DELETE /distributor/vaccines with body request {"vaccineLot":"value"}
/**
 * @author Ha Xuan Huy
 * @returns delete a vaccine lot with specific ID in distributor
 */
const deleteVaccineLot= async (req, res) =>{
  var format1= ["vaccineLot"]
  if(securityModule.JSONvalidator(req.body,format1.length,format1)){
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
  }
  else return res.send("wrong format")
}

module.exports = {GetDistributorLots,getVaccineLot,deliverToMedicalUnit,retrieveLogs,updateVaccineLot,deleteVaccineLot}
