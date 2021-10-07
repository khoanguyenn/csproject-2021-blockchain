const express = require("express")
const router = express.Router()
const {createContract, disconnetGateway}=require('../../../blockchain/asset-transfer-ledger-queries/application-javascript/util/web_util')


// PUT /vaccinate?vaccineID=<vaccineID>&userID=<userID>

/**
 * @author Ha Xuan Huy
 * @returns Updated buffer vaccine object
 */
router.put("/", async function (req, res) {
  let key1 = req.query.vaccineID;
  let key2=req.query.userID;
  try {
      const contract = await createContract();

      console.log(`Vaccinate vaccine ${key1} to user with userID of ${key2}`)
      await contract.submitTransaction('VaccinateCitizen', key1,key2) 
      res.sendStatus(200)
  } catch (err) {
      console.error("error: " + err)
      res.sendStatus(500)
  } finally {
    disconnetGateway();
  }
})

// GET /vaccinate?id=<userID>

/**
 * @author Ha Xuan Huy
 * @returns vaccine state of a user with given userID
 */
router.get("/", async function (req, res) {
  let key = req.query.id 
  try {
      const contract = await createContract();

      console.log(`GET vaccinate state of user with userID ${key}`)
      let data = await contract.evaluateTransaction('CheckVaccinateState', key) 
      res.status(200).json(JSON.parse(data.toString()))
      
  } catch (err) {
      console.error("error: " + err)
      res.send(500)
  } finally {
    disconnetGateway();
  }
})


module.exports = router
