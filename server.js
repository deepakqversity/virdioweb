const express = require('express');
const bodyParser = require("body-parser");

const app = express();

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

require('./routes/route.js')(app);

const port = process.env.PORT || 3001;
app.listen(port, () => {
	console.log(`Server up and running on port ${port} !`);
});
