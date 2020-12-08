const mysql = require("mysql")
const util = require("util")

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employee_trackerDB"
});
  
connection.connect(function(err) {
    if (err) {
      console.error("error connecting: " + err.stack);
      return;
    }
  
    console.log("connected as id " + connection.threadId);
});

function findAllEmployees() {
    connection.query("SELECT name FROM employee list", function(err, res) {
        if (err) throw err;
        console.log(res);
        connection.end;
    });
}

connection.query = util.promisify(connection.query);

module.exports = connection;