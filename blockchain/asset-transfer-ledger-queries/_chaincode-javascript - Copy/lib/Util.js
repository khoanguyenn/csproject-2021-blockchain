//ASSUMING ORC 1 is standing for group of vaccine maker and ORG 2 is for distributor
'use strict';

const {Contract} = require('fabric-contract-api');

class Chaincode extends Contract {
/** 
 * @author: Pham Minh Huy
 * @param {*} ctx
 * @param {String} name
 * @param {String} vaccineID
 * @returns add one new vaccine with designated ID into the ledger IF said ID is not occupied
*/
	async CreateVaccine(ctx, name, vaccineID) {
		const exists = await this.VaccineExists(ctx, vaccineID);
		if (exists) {
			throw new Error(`The asset ${vaccineID} already exists`);
		}
		let vaccine = {
			docType: 'vaccine',
			vaccineName: name,
			vaccineID: vID,
			vaccineManufacturer: 'org1',
			owner: 'org1',
			deliverTo: 'org1'
		};
		await ctx.stub.putState(vaccineID, Buffer.from(JSON.stringify(vaccine)));
	}
/** 
 * @author: Pham Minh Huy
 * @param {*} ctx
 * @param {String} vaccineID
 * @returns boolean value on whether a vaccine with an explicit ID existed or not
*/
	async VaccineExists(ctx, vaccineID) {
		let assetState = await ctx.stub.getState(vaccineID);	
		return  assetState && (assetState.length > 0);
	}
/** 
 * @author: Pham Minh Huy
 * @param {*} ctx
 * @param {String} owner
 * @returns  list of all vaccines assigned to an owner
*/
	async GetAllVaccinesOf(ctx, owner){
		let queryString = {};
  		queryString.selector = {};
		queryString.selector.owner = owner;//might wanna add uppercase all
		return await this.GetQueryResultForQueryString(ctx, JSON.stringify(queryString)); 
	}

/** 
 * @author: Pham Minh Huy
 * @param {*} ctx
 * @returns list of all vaccines that are stored in the ledger 
*/
	async GetAllVaccines(ctx){
		let queryString ={};
		queryString.selector={};
		queryString.selector.docType=`vaccine`;
		return await this.GetQueryResultForQueryString(ctx, JSON.stringify(queryString)); 
	}


	async GetQueryResultForQueryString(ctx, queryString) {
		let resultsIterator = await ctx.stub.getQueryResult(queryString);
		let results = await this._GetAllResults(resultsIterator, false);
		return JSON.stringify(results);
	  }
	  
	  async _GetAllResults(iterator, isHistory) {
		let allResults = [];
		let res = await iterator.next();
		while (!res.done) {
		  if (res.value && res.value.value.toString()) {
			let jsonRes = {};
			console.log(res.value.value.toString('utf8'));
			if (isHistory && isHistory === true) {
			  jsonRes.TxId = res.value.txId;
			  jsonRes.Timestamp = res.value.timestamp;
			  try {
				jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
			  } catch (err) {
				console.log(err);
				jsonRes.Value = res.value.value.toString('utf8');
			  }
			} else {
			  jsonRes.Key = res.value.key;
			  try {
				jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
			  } catch (err) {
				console.log(err);
				jsonRes.Record = res.value.value.toString('utf8');
			  }
			}
			allResults.push(jsonRes);
		  }
		  res = await iterator.next();
		}
		iterator.close();
		return allResults;
	  }
	// InitLedger creates sample assets in the ledger
	async InitLedger(ctx) { //HIGHLY DEBATABLE, THIS IS WORKING AS TEST / DUMMY DATA FOR ERROR CHECKING 
		const vaccines = [
			{
				vaccineID:`1`, 
				vaccineName: `Sinofarm`,
				vaccineManufacturer:`MNFP 1` ,
				owner: 'org1',
				deliverTo: 'org2'

			},
			{
				vaccineID:`1`, 
				vaccineName: `Sinofarm`,
				vaccineManufacturer:`MNFP 1` ,
				owner:`Citizen1`,
				deliverTo: `org2`
			},
			{
				vaccineID:`2`, 
				vaccineName: `AZ`,
				vaccineManufacturer:`MNFP 2` ,
				owner:`Citizen1`,
				deliverTo: `org3`
			},
			{
				vaccineID:`4`, 
				vaccineName: `Pfi`,
				vaccineManufacturer:`MNFP 3` ,
				owner:`Citizen2`,
				deliverTo: `org4`
			},
			{
				vaccineID:`9`, 
				vaccineName: `Sinofarm`,
				vaccineManufacturer:`MNFP 12` ,
				owner:`Citizen4`,
				deliverTo: `org7`
			},
			{
				vaccineID:`13`, 
				vaccineName: `Sinofarm`,
				vaccineManufacturer:`MNFP 4` ,
				owner:`Citizen17`,
				deliverTo: `org2`
			},
		];

		for (const item of vaccines) {
			await this.CreateDummyVaccine(ctx,item.vaccineName,item.vaccineID,item.vaccineManufacturer,item.owner,item.deliverTo);
		}
	}

	// DEBUG AREA, FEEL FREE TO TOUCH ANYTHING BELOW THIS 
	/** 
 * @author: Pham Minh Huy
 * @param {*} ctx
 * @param {String} name
 * @param {String} vID
 * @param {String} vMNF
 * @param {String} vOwn
 * @param {String} vDeli
 * @returns add a new specific vaccine with all custom field to the ledger
 * @classdesc this is used to STAGE the test for functions with EXPLICIT,CODER DESIGNED TEST CASES
*/
	async CreateDummyVaccine(ctx, name, vID,vMNF,vOwn,vDeli) {
		const exists = await this.VaccineExists(ctx, vID);
		if (exists) {
			throw new Error(`The asset ${vID} already exists`);
		}
		let vaccine = {
			docType: 'vaccine',
			vaccineName: name,
			vaccineID: vID,
			vaccineManufacturer: vMNF,
			owner: vOwn,
			deliverTo: vDeli
		};
		await ctx.stub.putState(vID, Buffer.from(JSON.stringify(vaccine)));
	}
}
module.exports = Chaincode;
