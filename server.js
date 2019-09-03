const express = require('express');
const bodyParser = require("body-parser");
var cors = require("cors");
const app = express();
var fs = require('fs'), https = require('https');
var vhost = require('vhost');

var ssl = {
    key: fs.readFileSync('/home/ubuntu/virdio.key'),
    certificate: fs.readFileSync('/home/ubuntu/cert/f605fab6f6588f54.crt'),
    ca: [fs.readFileSync('/home/ubuntu/cert/gd1.crt'), fs.readFileSync('/home/ubuntu/cert/gd2.crt')] 
};


app.use(cors());
// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

require('./routes/route.js')(app);

const port = process.env.PORT || 8001;
app.listen(port, () => {
        console.log(`Server up and running on port ${port} !`);
});

//https.createServer(ssl, app).listen(port);
