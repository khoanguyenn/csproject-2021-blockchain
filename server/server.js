const express = require("express");
const app = express();

const { initApp, initLedger, initAdminAccounts } = require('./src/routes/index')
const config = require('./src/config')

//Configuration
config.applyParserConfig(app);
config.applyTemplateEngine(app);

//Routes apply
//initLedger(app);
initApp(app);
//initAdminAccounts(app);


app.listen(3000, async () => {
    console.log("Server is listening on port 3000");
});
