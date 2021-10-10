const express = require("express");
const app = express();
const bodyParser=require('body-parser')




const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, enrollAdmin} = require('../../blockchain/test-application/javascript/CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('../../blockchain/test-application/javascript/AppUtil.js');
//require("../../../blockchain/asset-transfer-ledger-queries")
const mspOrg1 = 'ManufacturerMSP'; //to be changed to reflect user input data
const walletPath = path.join("C:/ProjectCSWinter/importing/csproject-2021-blockchain/blockchain/asset-transfer-ledger-queries/application-javascript", 'wallet');





//Middleware configuration
const logginMiddleware = require("./middleware/log");
app.use(logginMiddleware);
app.use(bodyParser.json())                //npm -i --S express body-parser
app.use(bodyParser.urlencoded({extended: false}))


async function main(){
    try{
        const ccp = buildCCPOrg1();
        const caClient = buildCAClient(FabricCAServices, ccp, 'ca.Manufacturer.example.com');
        const wallet = await buildWallet(Wallets, walletPath);
        await enrollAdmin(caClient, wallet, mspOrg1);
        const list1 = await wallet.list()
        console.log(list1)
    }
    catch (err){
        console.log(err)
    }
}



//Routes apply
const adminRoute = require("./routes/admin")
app.use("/admin", adminRoute);

const logsRoute = require('./routes/logs')
app.use("/logs", logsRoute)

const vaccineRoute = require('./routes/vaccinate')
app.use("/vaccinate", vaccineRoute)

const vaccineRoute2 = require("./routes/vaccine")
app.use("/vaccine", vaccineRoute2);


const authRoute = require("./routes/authentication")
app.use("/authentication", authRoute);




app.get("/", (req, res) => {
    res.send("Hello world from blockchain network!");
})
main()
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});