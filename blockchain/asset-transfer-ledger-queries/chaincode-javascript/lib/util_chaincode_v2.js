'use strict';

const {Contract} = require('fabric-contract-api');

class UtilChaincode extends Contract {

    /**
     * @author Ngo Quoc Thai
     * @param {*} ctx 
     * @param {*} owner 
     * @returns array of vaccineLot objects owned by specific owner
     */
	async GetAllLotsOf(ctx, owner) {
        let queryString = {};
		queryString.selector = {};
		queryString.selector.docType = 'vaccineLot';
		queryString.selector.owner = owner;
		return await this.GetQueryResultForQueryString(ctx, JSON.stringify(queryString));
	}

    /**
     * @author Ngo Quoc Thai
     * @param {*} ctx 
     * @param {*} owner 
     * @param {*} lotNo 
	 * @returns object vaccineLot 
     */
    async GetALotOf(ctx, owner, lotNo) {
        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType = 'vaccineLot';
        queryString.selector.vaccineLot = lotNo;
        queryString.selector.owner = owner;
        return await this.GetQueryResultForQueryString(ctx, JSON.stringify(queryString));
    }

	/**
	 * @author Ngo Quoc Thai
	 * @param {*} ctx 
	 * @param {*} lotNo 
	 * @param {*} owner 
	 * @returns array of vaccineLot objects
	 */
	async GetDeliveryLogsOf(ctx, lotNo, owner){
		let queryString = {};
        queryString.selector = {};
        queryString.selector.docType = 'vaccineLot';
        queryString.selector.vaccineLot = lotNo;
        queryString.selector.owner = owner;
        return await this.GetQueryResultForQueryString(ctx, JSON.stringify(queryString));
	}

    /**
     * @author Ngo Quoc Thai
     * @param {*} ctx 
     * @param {*} vaccineID 
     * @returns true or false whether vaccine exist
     */
	async VaccineExists(ctx, vaccineID) {
		let assetState = await ctx.stub.getState(vaccineID);	
		return  assetState && (assetState.length > 0);
	}

    /**
     * @author Ngo Quoc Thai
     * @param {*} ctx 
     * @param {*} owner 
     * @returns array of vaccine objs owned by specific owner
     */
    async GetAllVaccinesOf(ctx, owner) {
        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType = 'vaccine';
        queryString.selector.owner = owner;
        return await this.GetQueryResultForQueryString(ctx, JSON.stringify(queryString));
    }

    /**
     * @author Ngo Quoc Thai
     * @param {*} ctx 
	 * @returns all unvaccinated and vaccinated vaccines in the database
     */
    async GetAllVaccines(ctx) { // vaccinated vaccines + unvaccinated vaccines
        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType = 'vaccine';
        return await this.GetQueryResultForQueryString(ctx, JSON.stringify(queryString));
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

module.exports = UtilChaincode;