const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded( {extended: false}));

app.use(express.static(path.join(__dirname, 'html')));
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname,'html','home.html'));
// })

app.listen(3000, () => console.log('Server started on PORT 3000...'));