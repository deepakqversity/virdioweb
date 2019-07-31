const express = require('express');
const bodyParser = require("body-parser");
var cors = require("cors")
const app = express();

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
