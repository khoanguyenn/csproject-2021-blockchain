const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser");

const applyParserConfig = (app) => {
    app.use(cookieParser())
    app.use(bodyParser.json())                //npm -i --S express body-parser
    app.use(bodyParser.urlencoded({extended: false}))
}

module.exports = {
    applyParserConfig: applyParserConfig
};