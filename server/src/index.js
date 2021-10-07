const express = require("express");
const app = express();

//Middleware configuration
const logginMiddleware = require("./middleware/log");

app.use(logginMiddleware);

//Routes apply
const adminRoute = require("./routes/admin")
app.use("/admin", adminRoute);
const logsRoute = require('./routes/logs')
app.use("/logs", logsRoute)
const vaccineRoute = require('./routes/vaccinate')
app.use("vaccinate/", vaccineRoute)

app.get("/", (req, res) => {
    res.send("Hello world from blockchain network!");
})

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});