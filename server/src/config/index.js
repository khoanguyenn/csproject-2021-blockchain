const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser");

const { serverRoot } = require("../helpers/pathUtil");

const applyParserConfig = (app) => {
    app.use(cookieParser())
    app.use(bodyParser.json())                //npm -i --S express body-parser
    app.use(bodyParser.urlencoded({extended: false}))
}

const applyServingConfig = (app) => {
    app.use(express.static(path.join(serverRoot, "views")))
}

module.exports = {
    applyParserConfig,
    applyServingConfig,
};