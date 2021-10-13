 'use strict';

const {Contract} = require('fabric-contract-api');

class ManufacturerChaincode extends Contract {  


 /**
     * @author Huynh Nhut Anh
     * @param {*} ctx 
     * @param {String} name 
     * @param {String} manufacturer
     * @param quantity
     * @returns create a new vaccine with name and ID

     */
async CreateVaccineLot(ctx, manufacturer, name, quantity) {
               
	       const lotNo =(+new Date()).toString(36).substr(2,6);
               const dateOfManufacture = new Date().toJSON().slice(0,10).replace(/-/g,'/');

               const exists = await this._VaccineLotExist(ctx, lotNo);
		if (exists) {
			throw new Error(`The asset ${lotNo} already exists`);
		}

		let vaccineLot = {
			docType: 'vaccineLot',
			vaccineLotName: name,
                        lotNo: lotNo,
	        	vaccineManufacturer: manufacturer,
			vaccineQuanity: quantity,
			dateOfManufacturer:dateOfManufacture,
                        owner: manufacturer
		};

		await ctx.stub.putState(lotNo, Buffer.from(JSON.stringify(vaccineLot)));
	}

/**
     * @author Huynh Nhut Anh
     * @param {*} ctx 
     * @param {String} lotNo
     * @param {String} toDistributor
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
     * @returns  delete the given lot's number
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
     * @returns  update new infomation of the lot
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
     * @returns 
     */
	async InitVaccineLot(ctx) {
		const vaccineLots = [
                         {
				vaccineLotName: 'astralot1',
				lotNo:'36254y' ,
				vaccineManufacturer: 'org1',
				vaccineQuanity:'10',
                                dateOfManufacturer: '2021/10/11'
		          },
                      
                            {
				vaccineLotName: 'astralot2',
				lotNo: '69132z',
				vaccineManufacturer: 'org1',
				vaccineQuanity:'20',
                                dateOfManufacturer: '2021/10/11'
			},
                      {
				vaccineLotName: 'astralot3',
				lotNo: '666z20',
				vaccineManufacturer: 'org2',
				vaccineQuanity:'30',
                                dateOfManufacturer: '2021/30/10'
			},
			
		];

		for (const vaccineLot of vaccineLots) {
			await this.CreateVaccineLot(
				ctx, 
                                vaccineLot.vaccineManufacturer,
				vaccineLot.vaccineLotName,       
                                vaccineLot.vaccineQuanity
			);
		}
	}

/** 
     * @author: Huynh Nhut Anh
     * @param {*} ctx
     * @returns get all vaccine lot by manufacturer
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
	async _VaccineLotExist(ctx, lotNo) {
		let vaccineLotState = await ctx.stub.getState(lotNo);
		return vaccineLotState && vaccineLotState.length > 0;
	}
/**
	 * @author Huynh Nhut Anh
	 * @param {*} ctx 
	 * @param {String} vaccineID
	 * @param {String} name
          @param {String} manufacturer
	 */

 async CreateVaccine(ctx, vaccineID, name, manufacturer) {
               const vaccineID =(+new Date()).toString(36).substr(2,6);
               const dateOfManufacture = new Date().toJSON().slice(0,10).replace(/-/g,'/');

		const exists = await this.VaccineExists(ctx, vaccineID);
		if (exists) {
			throw new Error(`The vaccine ${vaccineID} already exists`);
		}

		let vaccine = {
			docType: 'vaccine',
			vaccineName: name,
			vaccineID: vaccineID,
			vaccineManufacturer: manufacturer,
                        dateOfManufacturer,
			owner: manufacturer
		};

		await ctx.stub.putState(vaccineID, Buffer.from(JSON.stringify(vaccine)));
	}
	
async VaccineExists(ctx, vaccine) {
		let assetState = await ctx.stub.getState(vaccine);	
		return  assetState && (assetState.length > 0);
	}

 async InitVaccine(ctx) {
    const vaccines = [
      {
        vaccineID: 'ThaiVaccine',
        vaccineName: 'astra'
      },
      {
        vaccineID: 'HuyVaccine',
        vaccineName: 'mordena'
      }
    ];

    for (const vaccine of vaccines) {
      await this.CreateVaccine(
        ctx, 
        vaccine.vaccineID,
        vaccine.vaccineName
      );
    }}


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

module.exports = ManufacturerChaincode;
