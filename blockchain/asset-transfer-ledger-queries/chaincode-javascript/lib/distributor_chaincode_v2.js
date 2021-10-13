'use strict';
const {Contract} = require('fabric-contract-api');

class DistributorChaincode extends Contract {
  /** 
   * @author: Ha Xuan Huy
   * @param {*} ctx
   * @param {String} lotNo
   * @returns Vaccine lot with a given lotNo in distributor
  */
  async GetDistributorLot(ctx, lotNo) {
    const vaccineLotJSON = await ctx.stub.getState(lotNo); 
    if (!vaccineLotJSON || vaccineLotJSON.length === 0) {
      throw new Error(`Vaccine lot ${lotNo} does not exist`);
    }

    let vaccineLotToVaccinate = {};
    try {
      vaccineLotToVaccinate = JSON.parse(vaccineLotJSON.toString()); 
    } catch (err) {
      let jsonResp = {};
      jsonResp.error = 'Failed to decode JSON of: ' + lotNo;
      throw new Error(jsonResp);
    }
    if(vaccineLotToVaccinate.owner!=='distributor'){
      throw new Error(`Vaccine lot ${lotNo} does not available at the distributor`);
    }
   

    return vaccineLotJSON.toString();
  }
    
  /** 
   * @author: Ha Xuan Huy
   * @param {*} ctx
   * @param {String} lotNo
   * @returns Updated buffer vaccineLot object
  */

  async DeliverToMedicalUnit(ctx, lotNo) {
  
    let vaccineLotAsBytes = await ctx.stub.getState(lotNo);
    if (!vaccineLotAsBytes || !vaccineLotAsBytes.toString()) {
      throw new Error(`Vaccine lot ${lotNo} does not exist`);
    }
    let vaccineLotToVaccinate = {};
    try {
      vaccineLotToVaccinate = JSON.parse(vaccineLotAsBytes.toString()); 
    } catch (err) {
      let jsonResp = {};
      jsonResp.error = 'Failed to decode JSON of: ' + lotNo;
      throw new Error(jsonResp);
    }
    if(vaccineLotToVaccinate.owner!=='distributor'){
      throw new Error(`Vaccine lot ${lotNo} does not available at the distributor`);
    }
    vaccineLotToVaccinate.owner = 'medicalunit'; 

  
    let vaccineLotJSONasBytes = Buffer.from(JSON.stringify(vaccineLotToVaccinate));
    await ctx.stub.putState(lotNo, vaccineLotJSONasBytes); 
  }

  /** 
   * @author: Ha Xuan Huy
   * @param {*} ctx
   * @returns All vaccine lots from distributor 
  */
  async GetDistributorLots(ctx) {
    let queryString = {};
    queryString.selector = {};
    queryString.selector.docType = 'vaccineLot';
    queryString.selector.owner = 'distributor';
    return await this.GetQueryResultForQueryString(ctx, JSON.stringify(queryString)); 
  }
  
  
  /** 
   * @author: Ha Xuan Huy
   * @param {*} ctx
   * @param {String} userID
   * @returns All vaccine lots that transfer from distributor to medical units (distributor logs)
  */
  async GetDistributorLogs(ctx) {
    let queryString = {};
    queryString.selector = {};
    queryString.selector.docType = 'vaccineLot';
    queryString.selector.owner = 'medicalunit';
    return await this.GetQueryResultForQueryString(ctx, JSON.stringify(queryString)); 
  }
  
  /** 
   * @author: Ha Xuan Huy
   * @param {*} ctx
   * @param {String} lotNo
   * @param {String} name
   * @param {int} quantity
   * @param {String} dateOfManufacture
   * @returns Updated a vaccine lot in distributor with given ID
  */
async UpdateDistributorLot(ctx, lotNo,name,quantity,dateOfManufacture) {
  
  let vaccineLotAsBytes = await ctx.stub.getState(lotNo);
  if (!vaccineLotAsBytes || !vaccineLotAsBytes.toString()) {
    throw new Error(`Vaccine lot ${lotNo} does not exist`);
  }
  let vaccineLotToVaccinate = {};
  try {
    vaccineLotToVaccinate = JSON.parse(vaccineLotAsBytes.toString()); 
  } catch (err) {
    let jsonResp = {};
    jsonResp.error = 'Failed to decode JSON of: ' + lotNo;
    throw new Error(jsonResp);
  }
  if(vaccineLotToVaccinate.owner!=='distributor'){
    throw new Error(`Vaccine lot ${lotNo} does not available at the distributor`);
  }
  vaccineLotToVaccinate.vaccineName=name;
  vaccineLotToVaccinate.vaccineQuantity=quantity
  vaccineLotToVaccinate.dateOfManufacturer=dateOfManufacture;


  let vaccineLotJSONasBytes = Buffer.from(JSON.stringify(vaccineLotToVaccinate));
  await ctx.stub.putState(lotNo, vaccineLotJSONasBytes); 
}

/** 
   * @author: Ha Xuan Huy
   * @param {*} ctx
   * @param {String} lotNo
   * @returns delete a vaccine lot in distributor with given ID
  */
async DeleteDistributorLot(ctx, lotNo) {
  
  let vaccineLotAsBytes = await ctx.stub.getState(lotNo);
  if (!vaccineLotAsBytes || !vaccineLotAsBytes.toString()) {
    throw new Error(`Vaccine lot ${lotNo} does not exist`);
  }
  let vaccineLotToVaccinate = {};
  try {
    vaccineLotToVaccinate = JSON.parse(vaccineLotAsBytes.toString()); 
  } catch (err) {
    let jsonResp = {};
    jsonResp.error = 'Failed to decode JSON of: ' + lotNo;
    throw new Error(jsonResp);
  }
  if(vaccineLotToVaccinate.owner!=='distributor'){
    throw new Error(`Vaccine lot ${lotNo} does not available at the distributor`);
  }
  await ctx.stub.deleteState(lotNo);
}
  
  //helper functions 
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
