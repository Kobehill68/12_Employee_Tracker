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
        name: "actionToPerform",
      type: "list",
      message: "What would you like to do--[ADD], [VIEW], [UPDATE], or [DELETE]--a table? Select EXIT to end",
      choices: ["ADD", "VIEW", "UPDATE", "DELETE", "EXIT"]
    }])
    .then((answer) => {
        switch (answer.actionToPerform) {
          case "ADD":
            addToTable(); //call add
            break;
          case "VIEW": // view
            viewTable();
            break;
          case "UPDATE": // update
            updateEmployee();
            break;
          case "DELETE":
            removeEmployee(); // only delete employees for now
            break;
          default:
            connection.end();
            break;
        }
    });
}

function addToTable() {
    inquirer // which table do you want to add to?  See the choices
    .prompt([{
      name: "whichTableToAddTo",
      type: "list",
      message: "Do you want to add a [DEPARTMENT], a [ROLE], or an [EMPLOYEE]?",
      choices: ["DEPARTMENT", "ROLE", "EMPLOYEE"]
    }]) 
    .then((answer) => { // which one did the user choose?
        switch (answer.whichTableToAddTo) {
          case "DEPARTMENT":
            addDepartment();
            break;
          case "ROLE":
            addRole();
            break;
          case "EMPLOYEE":
            addEmployee();
            break;
          default:
            break;
        }
    });
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

  