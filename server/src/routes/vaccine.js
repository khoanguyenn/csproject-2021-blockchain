const express = require("express")
const app = express.Router()
const {createContract, disconnetGateway}=require('../../../blockchain/asset-transfer-ledger-queries/application-javascript/util/web_util')

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}

/**
 * @author Pham Minh Huy
 * @event GET request with a body {vaccineID : var}to /vaccine/distributor
 * @returns information stored about that vaccineID, if any from the database
 */
app.get("/distributor", async (req, res) => {
		try {
			let packaged_data_field1 = String(req.body.vaccineID);
			const contract = await createContract();
			let result = await contract.evaluateTransaction('GetVaccine',packaged_data_field1)
			res.send(result);
		} catch (err) {
			console.error("error: " + err)
			res.sendStatus(500)
		} finally {
		  disconnetGateway();
		}
	})
/**
 * @author Pham Minh Huy
 * @event POST request with a body {vaccineID : var1, vaccineName: var2}to /vaccine/manufacturer
 * @returns add new vaccineID if possible to the ledger under factory-newlycreated state
 */
app.post("/manufacturer",async (req,res)=>{
		try {
			var packaged_data_field1 = String(req.body.vaccineName)
			var packaged_data_field2 = String(req.body.vaccineID)
			const contract = await createContract();
			results = await contract.submitTransaction('CreateVaccine',packaged_data_field1,packaged_data_field2);
			res.sendStatus(200);
		}
		 catch (err) {
			console.error("error: " + err)
			res.sendStatus(500)//internal error ... do we have code for duplication?
		} finally {
			disconnetGateway();
		}
	})
/**
 * @author Pham Minh Huy
 * @event PUT request with a body {vaccineID : var1, newOwnerName: var2}to /vaccine/manufacturer
 * @returns change owner of a vaccine to a new owner and the org to the distributor group 
 */
app.put("/manufacturer",async (req,res)=>{
		try {
			var packaged_data_field1 = String(req.body.vaccineID)
			var packaged_data_field2 = String(req.body.newOwnerName)
			const contract = await createContract();
			results = await contract.submitTransaction('DispatchVaccine',packaged_data_field1,packaged_data_field2);
			res.sendStatus(200);
		}
		catch (err) {
			console.error("error: " + err)
			res.sendStatus(500)//internal error ... do we have code for duplication?
		} finally {
			disconnetGateway();
		}
	})

module.exports=app