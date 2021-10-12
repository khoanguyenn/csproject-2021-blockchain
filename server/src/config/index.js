const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser");
const expressHbs = require('express-handlebars');

const { serverRoot, blockchainRoot, rootDir } = require("../helpers/pathUtil");

const applyParserConfig = (app) => {
    app.use(cookieParser())
    app.use(bodyParser.json())                //npm -i --S express body-parser
    app.use(bodyParser.urlencoded({extended: false}))
}

const applyTemplateEngine = (app) => {
    app.use(express.static(path.join(serverRoot, 'public')));
    app.engine('handlebars', expressHbs());
    app.set('view engine', 'handlebars');
}

module.exports = {
    applyParserConfig,
    applyTemplateEngine,
};