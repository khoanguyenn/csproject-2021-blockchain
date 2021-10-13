'use strict';

const {Contract} = require('fabric-contract-api');

class MedicalUnitChaincode extends Contract {

    /**
     * @author Ngo Quoc Thai
     * @param {*} ctx 
     * @param {*} userID 
     * @returns array of vaccine objs that were vaccinated to userID
     */
    async CheckVaccinateState(ctx, userID){
        let queryString = {};
		queryString.selector = {};
		queryString.selector.docType = 'vaccine';
		queryString.selector.owner = userID;
		return await this.GetQueryResultForQueryString(ctx, JSON.stringify(queryString));
    }

    /**
     * @author Ngo Quoc Thai
     * @param {*} ctx 
     * @param {*} userID 
     * @returns true or false whether user has vaccinated 2 shots.
     */
    async IsFullyVaccinated(ctx, userID) {
        let queryString = {};
		queryString.selector = {};
		queryString.selector.docType = 'vaccine';
		queryString.selector.owner = userID;
		let result = await this.GetQueryResultForQueryString(ctx, JSON.stringify(queryString));

        result = JSON.parse(result.toString());
        if (result.length < 2) {
			return false;
		}
		return true;
    }

    /**
     * @author Ngo Quoc Thai
     * @param {*} ctx 
     * @param {*} lotNo 
     */
    async DivideVaccineLot(ctx, lotNo) {
		const vaccineLotJSON = await ctx.stub.getState(lotNo); 
		if (!vaccineLotJSON || vaccineLotJSON.length === 0) {
			throw new Error(`Vaccine lot ${lotNo} does not exist`);
		}

		let vaccineLotObject = {};
		try {
			vaccineLotObject = JSON.parse(vaccineLotJSON.toString()); 
		} catch (err) {
			let jsonResp = {};
			jsonResp.error = 'Failed to decode JSON of: ' + lotNo;
			throw new Error(jsonResp);
		}

		if(vaccineLotObject.owner!=='medicalunit'){
			throw new Error(`Vaccine lot ${lotNo} does not available at the distributor`);
		}

		let size = parseInt(vaccineLotObject.vaccineQuantity);
		for (let i = 0; i < size; i++) {
			// const vaccineID = vaccineLotObject.vaccineLot + i;
			// await this.CreateVaccine(ctx, vaccineID, 'astra');
		}
		vaccineLotObject.vaccineQuantity = '0';
		let vaccineLotAsBytes = Buffer.from(JSON.stringify(vaccineLotObject));
		await ctx.stub.putState(lotNo, vaccineLotAsBytes); 

    }

    /**
     * @author Ngo Quoc Thai
     * @param {*} ctx 
     * @param {*} userID 
     */
    async VaccinateCitizen(ctx, vaccineID, userID){
		if (await this.CheckVaccinateState(ctx, userID)) {
			throw new Error(`This user: ${userID} has fully vaccinated`);
		}

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
        if(vaccineToVaccinate.owner !=='medicalunit'){
        	throw new Error(`Vaccine ${vaccineID} does not available at the distributor`);
        }
        vaccineToVaccinate.owner = userID; 
    
        let vaccineJSONasBytes = Buffer.from(JSON.stringify(vaccineToVaccinate));
        await ctx.stub.putState(vaccineID, vaccineJSONasBytes); 
    }
	// ======================= * helper functions *============================

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

module.exports = MedicalUnitChaincode;