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
        switch (answer.selectMenu) {
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
        if (err) throw err;
        console.log(results);
        startApp();
    })
}

const addEmployee = () => {
    inquirer.prompt([{
        type: 'input',
        message: "What's the employees first name?",
        name: 'firstName',
    },
    {
        type: 'input',
        message: "What's the employees last name?",
        name: 'lastName',
    },
    {
        type: 'number',
        message: "What's the employees role ID?",
        name: 'roleID',
    },
    {
        type: 'number',
        message: "What's the employees manager's ID?",
        name: 'managerID',
    }
    ]).then((res) => {
        connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [res.firstName, res.lastName, res.roleID, res.managerID], function (err, results) {
            if (err) throw err;
            console.table("Successfully Inserted");
        })
    })
}

const removeEmployee = () => {
    inquirer.prompt([
        {
          type: "input",
          message: "Which employee would you like to remove?",
          name: "title"
        }
      ]).then((res) => {
        connection.query('DELETE FROM employee WHERE (?);', [res.employee],
          function (err, results) {
            if (err) throw err;
            console.log("Successfully Removed");
            beginApp();
          })
      })
}

const updateRole = () => {

}

const addDept = () => {

}

const addRole = () => {

}



startApp()