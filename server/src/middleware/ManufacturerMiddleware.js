const {createContract, disconnetGateway}=require('../helpers/web_util')


/**
 * @author Ha Xuan Huy
 * @param {Request} req
 * @param {Response} res 
 * @returns All vaccine lot of the manufacturer. For example,  
 * {
        "Key": "orgast",
        "Record": {
            "dateOfManufacturer": "12/10/2021",
            "docType": "vaccineLot",
            "owner": "manufacturer",
            "vaccineLot": "orgast",
            "vaccineManufacturer": "org1",
            "vaccineName": "astra",
            "vaccineQuantity": "3"
        }
    }
 */
const getAllVaccineLot = async (req, res) => {
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
}

/**
 * @author Ha Xuan Huy
 * @returns A vaccine lot with given ID from manufacturer
 */
 const getVaccineLot = async (req, res) => {
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
}

//POST /manufacturer/vaccines with body request {"manufacturer":"value","name":"value","quantity":"value","dateOfManufacture":"value"}
/**
 * @author Ha Xuan Huy
 * @returns create a new vaccine lot
 */
const createVaccineLot = async (req, res) => {
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
}

// PUT /manufacturer/delivery with body request {"vaccineLot":"value"}
/**
 * @author Ha Xuan Huy
 * @returns  transfer vaccine lot from manufacturer to distributor
 */
const deliverToDistributor =  async (req, res) => {
  
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
}


/**
 * @author Ha Xuan Huy
 * @coauthor Pham Minh Huy @return all vaccine lot that HAS BEEN, at some interval of time, under MANUUFACTURER
 * @returns all VaccineLot that was under manufacturer
 */
const getLogs = async (req, res) => {
  try {
    let dummyVal="dummy"
    const contract = await createContract();
    console.log(`GET manufacturer's delivery logs`)
    let data = await contract.evaluateTransaction('GetDeliveryLogsOf',dummyVal,"manufacturer") 
    res.status(200).json(JSON.parse(data.toString()))
      
  } catch (err) {
      console.error("error: " + err)
      res.send(500)
  } finally {
    disconnetGateway();
  }
}

// PUT /manufacturer/vaccines with body request {"vaccineLot":"value","name":"value","quantity":"value","dateOfManufacture":"value"}
/**
 * @author Ha Xuan Huy
 * @returns update a vaccine lot in Manufacturer with specific ID
 */
const updateVaccineLot = async (req, res) => {
  
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
}

//DELETE /manufacturer/vaccines with body request {"vaccineLot":"value"}
/**
 * @author Ha Xuan Huy
 * @returns delete a vaccine lot with specific ID in Manufacturer
 */
const deleteVaccineLot =  async (req, res) => {
  
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
}


module.exports = {
    getAllVaccineLot,
    getVaccineLot,
    createVaccineLot,
    deliverToDistributor,
    getLogs,
    updateVaccineLot,
    deleteVaccineLot,
}