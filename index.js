const inquirer = require("inquirer")
const mysql = require("mysql")
const consoleOutPutter = require("console.table")
const queries = require("./db/queries")



const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employee_trackerDB"
});

connection.connect(function (err) {
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
                    uAddDepartment();
                    break;
                case "ROLE":
                    uAddRole();
                    break;
                case "EMPLOYEE":
                    uAddEmployee();
                    break;
                default:
                    break;
            }
        });
}

function uAddDepartment() {
    inquirer.prompt([
        {
            name: "addDepartment",
            type: "input",
            message: "What Department would you like to add?"
        }

    ])
        .then((answer) => {
            connection.query(
                queries.addDepartment.dept,
                {
                    name: answer.uAddDepartment
                },
                (err) => {
                    if (err) throw err;
                    console.log("Department was successfully made!")
                    start()
                }
            )
        })
}

function uAddRole() {
    connection.query(queries.addRole.getDeptCode, (err, results) => {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "uAddsRole",
                type: "input",
                message: "Type the role you would like to add."
            },
            {
                name: "uAddSalary",
                type: "input",
                message: "Type the salary ypu would like to have for this role.",
                validate: () => {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "uAddsDepartment",
                type: "list",
                choices: () => {
                    let choiceArray = [];
                    for (var i = 0; i < results.length; i++) {
                        choiceArray.push(results[i].name);
                    }
                    return choiceArray;
                },
                message: "What department would you like to put the role in?"
            }
        ])
            .then((answer) => {
                const deptartmentChosen = results.find(dept => dept.name === answer.uAddsDepartment);
                connection.query(
                    queries.addRole.role,
                    {
                        title: answer.uAddsRole,
                        salary: answer.uAddSalary,
                        department_id: deptartmentChosen.id
                    },
                    (err) => {
                        if (err) throw err;
                        console.log("Role has been added!");
                        start();
                    }
                );
            });
    });
};

function uAddEmployee() {
    connection.query(queries.addEmp.role, (err, results) => {
        if (err) throw err;
        let managers = null;

        connection.query(queries.addEmp.manager, (err2, results2) => {
            if (err2) throw err2;

            managers = results2;
            inquirer
                .prompt([
                    {
                        name: "uAddsFirstName",
                        type: "input",
                        message: "Please type the first name, then press Enter."
                    },
                    {
                        name: "uAddsLastName",
                        type: "input",
                        message: "Please type the last name, then press Enter."
                    },
                    {
                        name: "uAddsRole",
                        type: "list",
                        choices: () => {
                            let choiceArray = [];
                            for (var i = 0; i < results.length; i++) {
                                choiceArray.push(`${results[i].id.toString().padStart(3, '0')} ${results[i].title}`);
                            }
                            return choiceArray;
                        },
                        message: "What role would you like this employee to have?"
                    },
                    {
                        name: "uAddsManager",
                        type: "rawlist",
                        choices: () => {
                            let choiceArray = [];
                            choiceArray.push("000 No manager");

                            managers.forEach(element => {
                                choiceArray.push(`${element.id.toString().padStart(3, '0')} ${element.first_name} ${element.last_name}`);
                            });

                            return choiceArray;
                        },
                        message: "Who is the manager for this employee? Select zero if this employee has no manager."
                    }
                ])
                .then((answer) => {

                    const roleid = answer.uAddsRole.substring(0, 3);
                    const managerid = answer.uAddsManager.substring(0, 3);
                    connection.query(
                        queries.addEmp.insert,
                        {
                            first_name: answer.uAddsFirstName,
                            last_name: answer.uAddsLastName,
                            role_id: roleid,
                            manager_id: managerid === "000" ? null : managerid
                        },
                        (err) => {
                            if (err) throw err;

                            console.log("Employee was successfully added!");
                            start();
                        }
                    );
                });
        });
    })
}


function viewTable() {
    inquirer.prompt([{
        name: "tableView",
        type: "list",
        choices: ["Department", "Role", "Employee"],
        message: "Please select a table view."
    }])
        .then((answer) => {
            switch (answer.tableView) {
                case "Department":
                    viewDepartments();
                    break;
                case "Role":
                    viewRole();
                    break;
                case "Employee":
                    viewEmployee();
                    break;
                default:
                    console.log("Error in the TAble chosen. Please add a table");
                    break;
            }
        })
}

function viewDepartments() {
    connection.query(queries.viewAllDepts.all, (err, results) => {
        if (err) throw err;
        const gTable = consoleOutPutter.getTable(results);
        console.log(gTable);
        start();
    })
}

function viewRole() {
    inquirer.prompt ([
        {
            name: "uViewRole",
            type: "list",
            choices: ["View all Roles", "View Summ"],
            message: "View all Roles or View Summ of salaries of employees for a department"
        }
    ])
    .then(answer => {
        switch (answer.uViewRole) {
            case "View all Role":
                connection.query(queries.viewAllRoles.all, (err, results) => {
                    if (err) throw err;
                    const goTable = consoleOutPutter.getTable(results);
                    console.log(goTable);
                    start();
                })
                break;
            case "View Summ":
                connection.query(queries.viewAllDepts.all, (err, results) => {
                    if (err) throw err;
                    inquirer.prompt ([
                        {
                            name: "chooseDeptGroup",
                            type: "list",
                            choices: () => {
                                deptOptions = [];
                                for(let i = 0; i < results.length; i++) {
                                    deptOptions.push(`ID:${results[i].ID.toString().padStart(3, '0')}, ${results[i].Department}`)
                                }

                                if(deptOptions.length < 1) {
                                    deptOptions.push("No departments available");
                                }
                            },
                            message: "Please choose a department you want to group by."
                        }
                    ])
                    .then(answer => {
                        connection.query(queries.sumSalaries.salaries, [ answer.chooseDeptGroup.substring(3, 6)],
                        (err, results) => {
                            if (err) throw err;
                            const goTable = consoleOutPutter.getTable(results);
                            console.log(goTable);
                            start()
                        })
                    });
                });
                break
            default:
                break;
        };
    });

};

function viewEmployee() {
    connection.query(queries.viewAllEmployees.all, (err, results) => {
        inquirer
      .prompt([
        {
          name: "viewByEmpOrMan",
          type: "list",
          message: "Do you want to View All Employees or View Employees by Manager?",
          choices: ["[View All Employees]", "[View Employees by Manager]"]
        }
      ])
      .then(answer => {
          switch (answer.viewByEmpOrMan) {
            case "View All Employees":
                const gotTable = consoleOutputter.getTable(results);
                console.log(gotTable);
                start();
                break;
            case "View Employees by Manager":
            inquirer
            .prompt([
              {
                name: "viewByManager",
                type: "list",
                message: "Select a manager you want to search by.",
                choices: () => {
                  arrayDisplayEmps = [];

                  for (let i = 0; i < results.length; i++) {
                    if (results[i].Manager_Id !== null) {
                      const foundMan = results.find(element => element.Employee_ID === results[i].Manager_Id);
                      const foundString = arrayDisplayEmps.find(element =>
                        foundMan.Employee_ID.toString().padStart(3, '0') === element.substring(3, 6));

                      if (foundString === undefined || foundString === null) {
                        arrayDisplayEmps.push(returnEmployeeInStringFormat(foundMan));
                      }
                    }

                  }

                  if (arrayDisplayEmps.length < 1) {
                    arrayDisplayEmps.push("No managers found. Press Enter");
                  }

                  return arrayDisplayEmps;
                }
              }
            ])
            .then(answer => {
              if (answer.viewByManager.includes("No managers found")) {
                start();
              }
              else {
                const manid = answer.viewByManager.substring(3, 6);
                connection.query(myqueries.viewByManager.all, [manid], (err, resultSet) => {
                  if (err) throw err;
                  const goTable = consoleOutputter.getTable(resultSet);
                  console.log(goTable);
                  start();
                });
              }
            });
          break;
        default:
          break;  
          }
      })
    })
}

function removeEmployee() {
    connection.query(queries.viewAllEmployees.all, (err, results) => {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "removeEmp",
                type: "rawlist",
                choices: () => {
                    arrayEmps = [];
                    results.forEach(elem => {
                        arrayEmps.push(returnEmployee(elem));
                    });
                    return arrayEmps;
                },
                message: "Which Employee would you like to remove?"
            }
        ])
            .then(answer => {
                const empToRemove = answer.removeEmp.substring(3, 6);
                connection.query(queries.removeEmployee.deleteIt, [empToRemove], (err, results) => {
                    if (err) throw err;
                    console.log("Removal Successful")
                    start();
                });
            });
    });
};

function updateEmployee() {
    connection.query(queries.viewAllEmployees.all, (err, results) => {
        if (err) throw err;
        connection.query(queries.viewAllRoles.all, (err, resultsRoles) => {
            if (err) throw err;
            inquirer.prompt ([{
                name: "updateEmp",
                type: "rawlist",
                choices: () => {
                return utilReturnChoice(results);
                },
                message: "Which employee would you like to update?"
            }])
            .then((gotEmp) => {
                inquirer.prompt ([
                    {
                        name: "roleORManager",
                        type: "list",
                        choices: ["Employee Role", "Employee Manager"],
                        message: "Please select which one you want to update."
                    }
                ])
                .then(gotEmpOrMan => {
                    switch(gotEmpOrMan.roleOrMananger) {
                        case "Employee Role":
                        updateRole(gotEmp, resultsRoles);
                        break;
                    case "Employee Manager":
                        updateManager(gotEmp, results);
                        break;
                    default:
                        break;
                    }
                });
            });
        });

    });
};

function updateRole(gotEmp, resultsRoles) {
    inquirer.prompt([
        {
            name: "updateRole",
            type: "list",
            choices: () => {
                let choiceArray = [];
                for(let i = 0; i < resultsRoles.length; i++) {
                    choiceArray.push(`ID:${resultsRoles[i].ID.toString().padStart(3, '0')}, Title:${resultsRoles[i].Title}, Salary:${resultsRoles[i].Salary}, Dept:${resultsRoles[i].Department}`);
                }
                return choiceArray;
            },
            message: " Which Role do you want to update?"
        }
    ])
    .then(( goProperty) => {
        const roleId = goProperty.updateRole.substring(3, 6);
        const empId = gotEmp.updateEmp.substring(3, 6);
        connection.query(queries.updateEmployeeRole.update,
            [
                roleId, empId
            ],
            (err, resultsUpdate) => {
                if (err) throw err;
                console.log("Successfully updated a employees role!")
                start()
            }
        );
    });
};

function updateManager(gotEmp, listOfEmps) {
    inquirer.prompt ([
        {
            name: "updateMan",
            type: "rawlist",
            choices: () => {
                const eligManagers = determineMananger(listOfEmps, gotEmp);
                let oEligManagers = [];
                for( let i =0; i < eligManagers.length; i++) {
                    oEligManagers.push(returnEmployee(eligManagers[i]));
                }

                if(oEligManagers.length < 2) {
                    console.log("There are no employees who cna be the manager")
                }

                return oEligManagers;
            },
            message: "Choose the Manager."

        }
    ])
    .then((answer) => {
        let params = [null, gotEmp.updateEmp.substring(3, 6)]

        if(!answer.updateMan.includes("No Manager")) {
            params[0] = answer.updateMan.substring(3, 6);
        
        }
        connection.query(queries.updateEmployeeManager.update, params, (err, updateMan) => {
            if (err) throw err;
            console.log("success updating the manager")
            start();
        })
    })
}

function utilReturnChoice(results) {
    let choiceArray = [];
    results.forEach(element => {
        choiceArray.push(returnEmployee(element));
    });
    
    return choiceArray;
}

function determineMananger(results, emp) {
    managers = [];
    let found = false;

    const empid = emp.updateEmp.substring(3, 6);
    const empint = parseInt(empid);

    for (let i = 0; i < results.length; i++) {
        const elem = results[i];
        const iemel = elem.Employee_ID;
        let manId = elem.Manager_Id;
        if (empint === iemel || empint === manId) {
            continue;
        }

        let useit = true;
        while(empint !== manId && manId !==null) {
            const felem = results.find(element => {
                return element.Employee_ID === manId;
            })
            manId = felem.Manager_Id;

            if(manId === empint) {
                useit = false;
                break;
            }
        }
        if(useit) {
            managers.push(elem);
        }
    }
    return managers;
}

function getManagerId(gotman) {
    const index = gotman.indexOf("Manager ID:");
    const endindex = index + "Manager ID:".length; //11;
    const manId = gotman.substring(endindex, endindex + 3);
    return manId;
}

function returnEmployee(element) {
    return `ID:${element.Employee_ID.toString().padStart(3, '0')} Name:${element.First_Name} ${element.Last_Name}, Title:${element.Title}, Salary:${element.Salary}, Department:${element.Department}, Manager ID:${element.Manager_Id !== null ? element.Manager_Id.toString().padStart(3, '0') : null}, Manager:${element.Manager_Name}`;
}

