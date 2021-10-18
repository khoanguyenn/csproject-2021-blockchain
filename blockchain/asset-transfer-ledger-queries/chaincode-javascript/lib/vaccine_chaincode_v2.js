'use strict';
const {Contract} = require('fabric-contract-api');

class Chaincode extends Contract {

     /** 
     * @author Huynh Nhut Anh
     * @param {*} ctx 
     * @param {String} manufacturer
     * @param {String} name
     * @param {String} quantity
     * @param {String} dateOfManufacture
     * @returns create a new vaccine lot 
     */

async CreateVaccineLot(ctx, manufacturer, name, quantity,dateOfManufacture) {
               
  const lotNo =manufacturer.substring(0, 3) + name.substring(0, 3);

  const exists = await this.VaccineLotExist(ctx, lotNo);
if (exists) {
throw new Error(`The vaccine lot ${lotNo} already exists`);
}

let vaccineLotobj = {
docType: 'vaccineLot',
vaccineLot: lotNo,
vaccineManufacturer: manufacturer,
vaccineName: name,
vaccineQuantity: quantity,
dateOfManufacturer:dateOfManufacture,
owner: 'manufacturer'
};

await ctx.stub.putState(lotNo, Buffer.from(JSON.stringify(vaccineLotobj)));
}

/**
* @author Huynh Nhut Anh
* @param {*} ctx 
* @param {String} lotNo
* @returns transfers vaccine from vaccine manufacturer to distributor
*/

async DeliverToDistributor(ctx, lotNo){
        
let vaccineLotAsBytes = await ctx.stub.getState(lotNo);
if (!vaccineLotAsBytes || !vaccineLotAsBytes.toString()) {
throw new Error(`Vaccine lot ${lotNo} does not exist`);
}
let vaccineLotToTranfer = {};
try {
vaccineLotToTranfer = JSON.parse(vaccineLotAsBytes.toString()); 
} catch (err) {
let jsonResp = {};
jsonResp.error = 'Failed to decode JSON of: ' + lotNo;
throw new Error(jsonResp);
}
if(vaccineLotToTranfer.owner!=='manufacturer'){
throw new Error(`Vaccine lot ${lotNo} does not available at the manufacturer`);
}
vaccineLotToTranfer.owner = 'distributor'; 


let vaccineLotJSONasBytes = Buffer.from(JSON.stringify(vaccineLotToTranfer));
await ctx.stub.putState(lotNo, vaccineLotJSONasBytes); 
}


/** 
* @author: Huynh Nhut Anh
* @param {*} ctx
* @param {String} lotNo
* @returns  get a vaccine lot of manufacturer
*/
async GetManufacturerLot(ctx, lotNo){
const vaccineLotJSON = await ctx.stub.getState(lotNo); 
if (!vaccineLotJSON || vaccineLotJSON.length === 0) {
throw new Error(`Vaccine lot ${lotNo} does not exist`);
}

let vaccineLotToTranfer = {};
try {
vaccineLotToTranfer = JSON.parse(vaccineLotJSON.toString()); 
} catch (err) {
let jsonResp = {};
jsonResp.error = 'Failed to decode JSON of: ' + lotNo;
throw new Error(jsonResp);
}
if(vaccineLotToTranfer.owner!=='manufacturer'){
throw new Error(`Vaccine lot ${lotNo} does not available at the manufacturer`);
}


return vaccineLotJSON.toString();
}

/** 
 * @author: Ha Xuan Huy
 * @param {*} ctx
 * @param {String} lotNo
 * @returns  delete a vaccine lot with given ID in manufacturer
*/

async DeleteManufacturerLot(ctx, lotNo) {

let vaccineLotAsBytes = await ctx.stub.getState(lotNo);
if (!vaccineLotAsBytes || !vaccineLotAsBytes.toString()) {
throw new Error(`Vaccine lot ${lotNo} does not exist`);
}
let vaccineLotToTranfer = {};
try {
vaccineLotToTranfer = JSON.parse(vaccineLotAsBytes.toString()); 
} catch (err) {
let jsonResp = {};
jsonResp.error = 'Failed to decode JSON of: ' + lotNo;
throw new Error(jsonResp);
}
if(vaccineLotToTranfer.owner!=='manufacturer'){
throw new Error(`Vaccine lot ${lotNo} does not available at the manufacturer`);
}
await ctx.stub.deleteState(lotNo);
}

/** 
 * @author: Ha Xuan Huy
 * @param {*} ctx
 * @param {String} lotNo
 * @param {String} name
 * @param {String} quantity
 * @param {String} dateOfManufacture
 * @returns  update information of a vaccine lot with given ID in manufacturer
*/

async UpdateManufacturerLot(ctx, lotNo,name,quantity,dateOfManufacture) {

let vaccineLotAsBytes = await ctx.stub.getState(lotNo);
if (!vaccineLotAsBytes || !vaccineLotAsBytes.toString()) {
throw new Error(`Vaccine lot ${lotNo} does not exist`);
}
let vaccineLotToTranfer = {};
try {
vaccineLotToTranfer = JSON.parse(vaccineLotAsBytes.toString()); 
} catch (err) {
let jsonResp = {};
jsonResp.error = 'Failed to decode JSON of: ' + lotNo;
throw new Error(jsonResp);
}
if(vaccineLotToTranfer.owner!=='manufacturer'){
throw new Error(`Vaccine lot ${lotNo} does not available at the manufacturer`);
}
vaccineLotToTranfer.vaccineName=name;
vaccineLotToTranfer.vaccineQuantity=quantity
vaccineLotToTranfer.dateOfManufacturer=dateOfManufacture;


let vaccineLotJSONasBytes = Buffer.from(JSON.stringify(vaccineLotToTranfer));
await ctx.stub.putState(lotNo, vaccineLotJSONasBytes); 
}


/** 
* @author: Huynh Nhut Anh
* @param {*} ctx
* @returns get all manufacturer logs
*/
async GetManufacturerLogs(ctx) {
let queryString = {};
queryString.selector = {};
queryString.selector.docType = 'vaccineLot';
queryString.selector.owner = 'distributor';
return await this.GetQueryResultForQueryString(ctx, JSON.stringify(queryString)); 
}


/**
* @author Huynh Nhut Anh
* @param {*} ctx 
* @returns init vaccine lots
*/
async InitVaccineLot(ctx) {
const vaccineLots = [
{
  vaccineLot:'coac' ,
  vaccineManufacturer: 'org1',
 vaccineName: 'astra',
 vaccineQuantity:'3',
 dateOfManufacturer: '12/10/2021'
},
               
{
  vaccineLot:'caoz' ,
  vaccineManufacturer: 'org2',
 vaccineName: 'mordena',
 vaccineQuantity:'5',
 dateOfManufacturer: '13/10/2021'
},
{
  vaccineLot:'aloalo' ,
  vaccineManufacturer: 'org1',
 vaccineName: 'pfizer',
 vaccineQuantity:'3',
 dateOfManufacturer: '12/10/2021'
},

];

for (const vaccineLot of vaccineLots) {
await this.CreateVaccineLot(
 ctx, 
 vaccineLot.vaccineManufacturer,
 vaccineLot.vaccineName,       
vaccineLot.vaccineQuantity,
vaccineLot.dateOfManufacturer
);
}
}

/** 
* @author: Huynh Nhut Anh
* @param {*} ctx
* @returns get all vaccine lots in manufacturer
*/

async GetAllManufacturerLots(ctx){
let queryString ={};
queryString.selector={};
queryString.selector.docType='vaccineLot';
queryString.selector.owner = 'manufacturer';
return await this.GetQueryResultForQueryString(ctx, JSON.stringify(queryString)); 
}


/**
* @author Huynh Nhut Anh
* @param {*} ctx 
* @param {String} lotNo
* @returns boolean value
*/
async VaccineLotExist(ctx, lotNo) {
let vaccineLotState = await ctx.stub.getState(lotNo);
return vaccineLotState && vaccineLotState.length > 0;
}

/**
* @author Huynh Nhut Anh
* @param {*} ctx 
* @param {String} vaccineID
* @param {String} name
* @param {String} manufacturer
* @param {String} dateManufacture
* @returns create new vaccine
*/
async CreateVaccine(ctx, vaccineID,name, manufacturer,dateManufacture) {

const exists = await this.VaccineExists(ctx, vaccineID);
if (exists) {
throw new Error(`The vaccine ${vaccineID} already exists`);
}

let vaccine = {
docType: 'vaccine',
vaccineID: vaccineID,
vaccineManufacturer: manufacturer,
vaccineName: name,
dateOfManufacturer:dateManufacture,
owner: 'medicalunit'
};

await ctx.stub.putState(vaccineID, Buffer.from(JSON.stringify(vaccine)));
}

/**
* @author Ngo Quoc Thai
* @param {*} ctx 
* @returns init vaccines
*/
async InitVaccine(ctx) {
const vaccines = [
{
 vaccineID: 'Thai12',
 vaccineName: 'astra',
 vaccineManufacturer: 'org1',
 dateOfManufacturer:'69/69/69'
},
{
 vaccineID: 'Huy012',
 vaccineName: 'mordena',
 vaccineManufacturer: 'org1',
 dateOfManufacturer:'69/69/69'
}
];

for (const vaccine of vaccines) {
await this.CreateVaccine(
 ctx, 
 vaccine.vaccineID,
 vaccine.vaccineName,
 vaccine.vaccineManufacturer,
 vaccine.dateOfManufacturer
);
}
}


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
  const vaccineID = lotNo.substring(0,5) + i;
   await this.CreateVaccine(ctx,vaccineID,vaccineLotObject.vaccineName,vaccineLotObject.vaccineManufacturer,vaccineLotObject.dateOfManufacture)
}
vaccineLotObject.vaccineQuantity = '0';
let vaccineLotAsBytes = Buffer.from(JSON.stringify(vaccineLotObject));
await ctx.stub.putState(lotNo, vaccineLotAsBytes); 
}

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
 * @param {*} userID 
 */
async VaccinateCitizen(ctx, vaccineID, userID){
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

/**
* @author Ngo Quoc Thai
* @param {*} ctx 
* @param {String} vaccine
* @returns boolean value
*/
async VaccineExists(ctx, vaccineID) {
  let assetState = await ctx.stub.getState(vaccineID);	
  return  assetState && (assetState.length > 0);
}

/**
 * @author Pham Minh Huy
 * @param {*} ctx
 * @param {String} owner 
 * @return vaccine lots of an owner 
 */
  async GetAllLotsOf(ctx,owner){
    let queryString = {};
    queryString.selector = {};
    queryString.selector.docType = 'vaccineLot';
    queryString.selector.owner = owner;
    return await this.GetQueryResultForQueryString(ctx, JSON.stringify(queryString));
  }


/**
 * @author Pham Minh Huy
 * @param {*} ctx
 * @param {String} lotNo
 * @param {String} owner 
 * @return transactions of a specific vaccine lot 
 */
  
  async GetDeliveryLogsOf(ctx,lotNo,owner){
    let iterator = await ctx.stub.getHistoryForKey(lotNo);
    let result = [];
    let res = await iterator.next();
    while (!res.done) {
      if (res.value) {
        console.info(`found state update with value: ${res.value.value.toString('utf8')}`);
        const obj = JSON.parse(res.value.value.toString('utf8'));
        obj.timestamp=toDate(res.value.timestamp)
        result.push(obj);
      }
      res = await iterator.next();
    }
    await iterator.close();
    return result;  
    function toDate(timestamp) {
      const milliseconds = (timestamp.seconds.low + (timestamp.nanos / 1000000000)) * 1000;
      return new Date(milliseconds).toString();
    }

    
  }




}
  
  module.exports = Chaincode;
