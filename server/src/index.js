const express = require("express");
const app = express();
const bodyParser=require('body-parser')

//Middleware configuration
const logginMiddleware = require("./middleware/log");
app.use(logginMiddleware);
app.use(bodyParser.json())                //npm -i --S express body-parser
app.use(bodyParser.urlencoded({extended: false}))

//Routes apply
const adminRoute = require("./routes/admin")
app.use("/admin", adminRoute);
const logsRoute = require('./routes/logs')
app.use("/logs", logsRoute)
const vaccineRoute = require('./routes/vaccinate')
app.use("/vaccinate", vaccineRoute)
const vaccineRoute2 = require("./routes/vaccine")
app.use("/vaccine", vaccineRoute2);

app.get("/", (req, res) => {
    res.send("Hello world from blockchain network!");
})

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
