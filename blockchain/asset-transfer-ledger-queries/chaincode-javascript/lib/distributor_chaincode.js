'use strict';

const {Contract} = require('fabric-contract-api');


class DistributorChaincode extends Contract {

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
  vaccineToVaccinate.deliverTo='user';

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
}

module.exports = DistributorChaincode;
