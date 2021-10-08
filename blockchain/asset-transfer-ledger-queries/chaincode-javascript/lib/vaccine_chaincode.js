'use strict';

const {Contract} = require('fabric-contract-api');

class VaccineChaincode extends Contract {

    /**
     * @author Ngo Quoc Thai
     * @param {*} ctx 
     * @param {String} name 
     * @param {String} vaccineID 
     * @returns Buffer of vaccine object 
     */
	async CreateVaccine(ctx, name, vaccineID) {
		const exists = await this.VaccineExists(ctx, vaccineID);
		if (exists) {
			throw new Error(`The vaccine ${vaccineID} already exists`);
		}
		
		let vaccine = {
			docType: 'vaccine',
			vaccineName: name,
			vaccineID: vaccineID,
			vaccineManufacturer: 'org1',
			owner: 'org1',
			deliverTo: 'org1'
		};

		await ctx.stub.putState(vaccineID, Buffer.from(JSON.stringify(vaccine)));
	}

    /**
     * @author Ngo Quoc Thai
     * @param {*} ctx 
     * @param {String} vaccineID 
     * @param {String} newOwner 
     * @returns updated Buffer of vaccine object 
     */
	async DispatchVaccine(ctx, vaccineID, newOwner){
		let vaccineAsBytes = await ctx.stub.getState(vaccineID);
		if (!vaccineAsBytes || !vaccineAsBytes.toString()) {
			throw new Error(`Vaccine ${vaccineID} does not exist`);
		}

		let vaccineToTransfer = {};
		try {
			vaccineToTransfer = JSON.parse(vaccineAsBytes.toString()); 
		} catch (err) {
			let jsonResp = {};
			jsonResp.error = 'Failed to decode JSON of: ' + vaccineID;
			throw new Error(jsonResp);
		}
		vaccineToTransfer.owner = newOwner; //change the owner
		vaccineToTransfer.deliverTo = 'org2';

		let vaccineJSONasBytes = Buffer.from(JSON.stringify(vaccineToTransfer));
		await ctx.stub.putState(vaccineID, vaccineJSONasBytes); 
	}

    /**
     * @author Ngo Quoc Thai
     * @param {*} ctx 
     * @returns JSON array
     */
	async GetDispatchLogs(ctx){
		let queryString = {};
		queryString.selector = {};
		queryString.selector.docType = 'vaccine';
		queryString.selector.deliverTo = 'org2';
		return await this.GetQueryResultForQueryString(ctx, JSON.stringify(queryString));
	}

    /**
     * @author Ngo Quoc Thai
     * @param {*} ctx 
     * @returns 
     */
	async InitVaccine(ctx) {
		const vaccines = [
			{
				vaccineID: 'astra123',
				vaccineName: 'astra',
				vaccineManufacturer: 'org1',
				owner: 'org1',
				deliverTo: 'org1'
			},
			{
				vaccineID: 'astra456',
				vaccineName: 'astra',
				vaccineManufacturer: 'org1',
				owner: 'org1',
				deliverTo: 'org1'
			},
			{
				vaccineID: 'astra789',
				vaccineName: 'astra',
				vaccineManufacturer: 'org1',
				owner: 'org1',
				deliverTo: 'org1'
			}
		];

		for (const vaccine of vaccines) {
			await this.CreateVaccine(
				ctx, 
				vaccine.vaccineName,
				vaccine.vaccineID
			);
		}
	}

    /** 
     * @author: Ha Xuan Huy
     * @param {*} ctx
     * @param {String} vaccineID
     * @returns Vaccine with a given ID
    */
    async GetVaccine(ctx, vaccineID) {
        const vaccineJSON = await ctx.stub.getState(vaccineID); 
        if (!vaccineJSON || vaccineJSON.length === 0) {
        throw new Error(`Vaccine ${id} does not exist`);
        }
        return vaccineJSON.toString();
    }
  
  
    /** 
     * @author: Ha Xuan Huy
     * @param {*} ctx
     * @param {String} vaccineID
     * @param {String} userID
     * @returns Updated buffer vaccine object
     */
    async VaccinateCitizen(ctx, vaccineID, userID) {
        let vaccineAsBytes = await ctx.stub.getState(vaccineID);
        if (!vaccineAsBytes || !vaccineAsBytes.toString()) {
        	throw new Error(`Vaccine ${vaccineID} does not exist`);
        }

        let vaccineToVaccinate = {};
        try {
        	vaccineToVaccinate = JSON.parse(vaccineAsBytes.toString()); 
        } catch (err) {
			let jsonResp = {};
			jsonResp.error = 'Failed to decode JSON of: ' + vaccineID;
			throw new Error(jsonResp);
        }
        if(vaccineToVaccinate.deliverTo!=='org2'){
        	throw new Error(`Vaccine ${vaccineID} does not available at the distributor`);
        }
        vaccineToVaccinate.owner = userID; 
        vaccineToVaccinate.deliverTo= 'user';
    
        let vaccineJSONasBytes = Buffer.from(JSON.stringify(vaccineToVaccinate));
        await ctx.stub.putState(vaccineID, vaccineJSONasBytes); 
    }
    
    
    /** 
     * @author: Ha Xuan Huy
     * @param {*} ctx
     * @returns All vaccines from distributor that have been used for all users 
     */
    async GetDeliveryLogs(ctx) {
        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType = 'vaccine';
        queryString.selector.deliverTo = 'user';
        return await this.GetQueryResultForQueryString(ctx, JSON.stringify(queryString)); 
    }
    
    
    /** 
     * @author: Ha Xuan Huy
     * @param {*} ctx
     * @param {String} userID
     * @returns Vaccine(s) from distributor that have been used for a specific userID
     */
    async CheckVaccinateState(ctx,userID) {
        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType = 'vaccine';
        queryString.selector.owner = userID;
        return await this.GetQueryResultForQueryString(ctx, JSON.stringify(queryString)); 
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


    // *********************** helper functions *****************************

	// GetQueryResultForQueryString executes the passed in query string.
	// Result set is built and returned as a byte array containing the JSON results.
	async GetQueryResultForQueryString(ctx, queryString) {

		let resultsIterator = await ctx.stub.getQueryResult(queryString);
		let results = await this._GetAllResults(resultsIterator, false);

		return JSON.stringify(results);
	}

	// This is JavaScript so without Funcation Decorators, all functions are assumed
	// to be transaction functions
	//
	// For internal functions... prefix them with _
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
}

module.exports = VaccineChaincode;
