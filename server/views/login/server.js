const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false}));

app.use(express.static(path.join(__dirname, 'html')));

app.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    res.send(`Username: ${username} Password: ${password}`);
})

app.listen(4000);
console.log('Server started at PORT 4000');