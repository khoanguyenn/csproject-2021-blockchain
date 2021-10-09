
const express = require("express")
const app = express.Router()
const {createContract, disconnetGateway}=require('../../../blockchain/asset-transfer-ledger-queries/application-javascript/util/web_util')

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
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
 * @event POST request with a body {vaccineName: var2}to /vaccine/manufacturer
 * @returns add new vaccine with a randomized ID to the ledger under factory-newlycreated state
 */
app.post("/manufacturer",async (req,res)=>{
		try {
			var packaged_data_field1 = String(req.body.vaccineName)
		
			const contract = await createContract();
			let world_state= JSON.parse(await contract.evaluateTransaction('GetAllVaccines'))

			do {
				var hasMatch =false;
				var random_ID = makeid(6)
				for (const item of world_state) {
					var loc=JSON.stringify(item).indexOf('{"vaccineID":') //naiive method but will do for now 
					if( loc > -1 ){
						let vID =JSON.stringify(item).at(loc);
						if (vID.localeCompare(random_ID)==true){
							hasMatch = true;break;
						}
					}
				}
			} while(hasMatch==true)
	
			results = await contract.submitTransaction('CreateVaccine',packaged_data_field1,random_ID);
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