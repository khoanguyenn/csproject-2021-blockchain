
const express = require("express")
const app = express.Router()

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser} = require('../../../blockchain/test-application/javascript/CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('../../../blockchain/test-application/javascript/AppUtil.js');
//require("../../../blockchain/asset-transfer-ledger-queries")
const mspOrg1 = 'ManufacturerMSP'; //to be changed to reflect user input data
const walletPath = path.join("C:/ProjectCSWinter/importing/csproject-2021-blockchain/blockchain/asset-transfer-ledger-queries/application-javascript", 'wallet');



function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}
app.get("/le", async (req,res)=>{
    res.send("okas")
})
app.post("/signup",async (req,res)=>{
    try{
    console.log("el")
    let packaged_data_field1 = String(req.body.username);
    let packaged_data_field2 = String(req.body.pwd);
    let concat = packaged_data_field1+packaged_data_field2
    console.log(concat)
    const ccp = buildCCPOrg1();
    const wallet = await buildWallet(Wallets, walletPath);
    const caClient = buildCAClient(FabricCAServices, ccp, 'ca.Manufacturer.example.com'); 
    console.log("trying to enroll")
    await registerAndEnrollUser(caClient, wallet, mspOrg1, concat, 'manufacturer.department1'); // change msporg1 dumb dumb
    console.log(await wallet.list())
    res.send("what?")}
    catch(err){
        console.log(err);
    }
})

app.post("/login",async (req,res)=>{
    try{
    let packaged_data_field1 = String(req.body.username);
    let packaged_data_field2 = String(req.body.pwd);
    let concat = packaged_data_field1+packaged_data_field2
    
    const wallet = await buildWallet(Wallets, walletPath); 
    var list1 =await wallet.list()
    console.log(list1)
    console.log("received "+concat)

    console.log(list1.includes(concat))

    
    res.send("khò khò")}
    catch(err){
        console.log(err);
    }
})


module.exports=app