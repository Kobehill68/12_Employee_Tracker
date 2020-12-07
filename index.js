const inquirer = require("inquirer")
const mysql = require("mysql")
const consTable = require("console.table")
const connection = require("./db/connection");

const startScreen = ["View all Employees", "View all Employees by Department", "Add Employee", "Remove Employee", "Update Employee Role", "Add Department", "Add Role", "Exit"]

const startApp = () => {
    inquirer.prompt({
        name: "selectMenu",
        type: "list",
        message: "Select an option",
        choices: startScreen
    }).then((answer) => {
        switch(answer.selectMenu) {
            case 'View all Employees':
                showAllEmp();
                break;
            case 'View all Employees by Department':
                showAllByDept();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Remove Employee':
                removeEmployee();
                break;
            case 'Update Employee Role':
                updateRole();
                break;
            case 'Add Department':
                addDept();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'Exit':
                connection.end();
                break;
        }
    }) 

}

const showAllEmp = () => {
    connection.query("SELECT * FROM department, role, employee", (err, results) => {
        console.log(results);
        startApp()
    })
}

const showAllByDept = () => {
    connection.query("SELECT * FROM department", (err, results) => {
        if(err) throw err;
        console.log(results);
        startApp();
    })
}

const addEmployee = () => {
    
}



startApp()