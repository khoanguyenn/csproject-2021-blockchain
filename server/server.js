const express = require("express");
const app = express();

const initApp = require('./src/routes/index')
const config = require('./src/config')

//Configuration
config.applyParserConfig(app);
config.applyServingConfig(app);

//Routes apply
initApp(app);

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});