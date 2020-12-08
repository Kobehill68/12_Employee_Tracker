const inquirer = require("inquirer")
const mysql = require("mysql")
const consTable = require("console.table");
const { start } = require("repl");


const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employee_trackerDB"
});
  
connection.connect(function(err) {
    if (err) throw err;
    start()
});

function start() {
    inquirer.prompt([{

    }])
}

function addToTable() {

}

function addDepartment() {

}

function addRole() {

}

function addEmployee() {

}


function viewTable() {

}

function viewDepartments() {

}

function viewRole() {

}

function viewEmployee() {

}

function removeEmployee() {

}

function updateEmployee() {
    
}

function updateRole() {
    
}

function updateManager() {
    
}

function utilReturnChoice() {

}

function determineMananger() {

}

function getManagerId() {

}

function returnEmployee(element) {
    return `ID:${element.Employee_ID.toString().padStart(3, 'O')}`
}

  