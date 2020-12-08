const inquirer = require("inquirer")
const mysql = require("mysql")
const table = require("console-table-printer")
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
            case 'View all Departments':
                showAllByDept();
                break;
            case 'View all Roles':
                showByRole();
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
            case 'Update Employee Manager':
                updateEmpMgr();
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
    connection.query('SELECT * FROM  employee', (err, res) => {
        if (err) throw err;
        table.printTable(res);
        console.log('All Employees')
        startApp()
    })
}

const showAllByDept = () => {
    connection.query("SELECT * FROM department", (err, res) => {
        if(err) throw err;
        table.printTable(res)
        console.log('All Departments');
        startApp();
    })
}
const showByRole = () => {
    connection.query('SELECT * FROM role',
  (err, res) => {
      if (err) throw err;
      table.printTable(res);
      console.log('All Roles');
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
        connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [res.firstName, res.lastName, res.roleID, res.managerID], function (err, res) {
          if (err) throw err;
          console.log("Successfully Inserted");
          console.log(" ")
          startApp()
        })
      }) 

}

const removeEmployee = () => {
    inquirer.prompt([
        {
        type: "input",
        message: "Which employee would you like to remove first name only? ",
        name: "firstName"
        }
    ]).then((res) => {
        connection.query('DELETE FROM employee WHERE first_name = (?)', [res.firstName], 
        function(err, res){
            if (err) throw err;
            console.log("Successfully Deleted");
            console.log(" ");
            startApp();
        })
    })
}

const updateRole = () => {
    inquirer.prompt([
        {
            type: "input",
            message: "Which employee would you like to update?",
            name: "name"
        },
        {
            type: "number",
            message: "Enter new role ID: ",
            name: "role_id"
        }
    ]).then(function(response) {
        connection.query("UPDATE employee SET role_id = ? WHERE first_name = ?", [response.role_id, response.name],
        function (err, res) {
            table.printTable(res);
            startApp();
        })
    })
}

const updateEmpMgr = () => {
    inquirer.prompt([
        {
            type: "input",
            message: "Which manager needs updated?",
            name: "name"
        },
        {
            type: "number",
            message: "Enter the new manager ID: ",
            name: "manager_id" 
        }
    ]).then(function(response) {
        connection.query("UPDATE `employee_trackerDB`.`employee` SET `manager_id` = ? WHERE (`id` ?", [response.name, response.manager_id], function (err, res) {
            console.log("Successfully Updated");
        })
    })
}

const addDept = () => {
    inquirer.prompt([
        {
            type: 'input',
            message: " Please enter the new Department Name: ",
            name: 'department_name',
        },
    ]).then((res) => {
        connection.query('INSERT INTO department (department_name) VALUES (?)', [res.department_name], function (err, res) {
            if (err) throw err;
            console.log("Department Successfully Added");
            startApp();
        })
    })
}

const addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            message: "Enter the new role: ",
            name: 'title',
        },
        {
            type: 'input',
            message: "Enter the salary: ",
            name: 'salary',
        },
        {
            type: 'input',
            message: "Enter the Department ID: ",
            name: 'department_id',
        },
      ]).then((res) => {
        connection.query('INSERT INTO role (title, salary, department_name) VALUES (?, ?, ?)', [res.title, res.salary, res.department_name], function (err, res){
            if (err) throw err;
            console.log("Role Successfully Made");
            startApp();
        })
      })
}



startApp()