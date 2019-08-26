const mysql = require("mysql");

// Configuration
const config = require(process.cwd() + "/config/config");

// Connect to Mysql
var connection = mysql.createConnection({
  host     : config.mysql.host,
  user     : config.mysql.user,
  password : config.mysql.pwd,
  database : config.mysql.db
});
 
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
 
  console.log('connected as id ' + connection.threadId);
});

module.exports = connection;
