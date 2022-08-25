// Require npm packages
const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

// Declare port and app variable
const PORT = process.env.PORT || 3001;
const app = express();

// Declare middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
    {
        host:'localhost',
        user:'root',
        password:'password',
        database: 'company_db'
    },
    console.log('Connected to the company_db database.')
);

// Function to view all employees
function viewEmployees(){
    db.query(`SELECT employee.id, employee.first_name, employee.last_name, emp_role.title, department.department_name, emp_role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name FROM employee JOIN emp_role ON employee.role_id = emp_role.id JOIN department ON department.id = emp_role.department_id LEFT JOIN employee manager ON manager.id = employee.manager_id`, function (err, results) {
        if (err) {
            console.log(err);
            return;
        }
        console.table(results);
        restartAction();
    });
}

// Function to add new employees
function addEmployee(firstName, lastName, newEmpRole, newEmpManager){
    db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?)`, [firstName, lastName, newEmpRole, newEmpManager], function (err, results) {
        if (err) {
            console.log(err);
            return;
        }
        console.log(newEmpManager);
        console.log("New Employee Added");
        viewEmployees();
    });
}

// Function to update existing employees
function updateEmployee(empFirstName, updatedRole){
    db.query(`UPDATE employee SET role_id = ? WHERE first_name = ? `, [updatedRole, empFirstName], function (err, results) {
        if (err) {
            console.log(err);
            return;
        }
        console.log("Employee Successfully Updated!");
        viewEmployees();
    });
}

// Function to view all roles
function viewRoles(){
    db.query(`SELECT emp_role.id, emp_role.title, department.department_name AS department, emp_role.salary FROM emp_role JOIN department ON department.id = emp_role.department_id`, function (err, results) {
        if (err) {
            console.log(err);
            return;
        }
        console.table(results);
        restartAction();
    });
}

// Function to add new roles
function addRole(newRole, newSalary, newRoleDep) {
    db.query(`INSERT INTO emp_role (title, salary, department_id) VALUES(?, ?, ?)`, [newRole, newSalary, newRoleDep], function (err, results) {
        if (err) {
            console.log(err);
            return;
        }
        console.log("New Role Added");
        viewRoles();
    });
}

// Function to view all departments
function viewDepartments() {
    db.query(`SELECT * FROM department`, function (err, results) {
        if (err) {
            console.log(err);
            return;
        }
        console.table(results);
        restartAction();
    });
}

// Function to add new departments
function addDepartment(newDepartmentName){
    db.query(`INSERT INTO department (department_name) VALUES(?)`, newDepartmentName, function (err, results) {
        if (err) {
            console.log(err);
            return;
        }
        console.log("New Department Added");
        viewDepartments();
    });
}

// Function to restart main menu
function restartAction() {
    inquirer
        .prompt([
            {
                type: "confirm",
                message: "Enter 'Y' to return to the Main Menu",
                name: "mainMenu",
                default: true
            }
        ])
        .then((response) => {
            const mainMenu = response.mainMenu;
            if (mainMenu) {
                requestAction();
                return;
            }
        })
}

// Funtion to initiate main menu
function requestAction() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                name: "requestAction",
                choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit"]
            }
        ])
        .then((response) => {
            const userAction = response.requestAction;
            switch(userAction){
                case "View All Employees":
                    viewEmployees();
                    break;
                case "Add Employee":
                    db.query(`SELECT * FROM emp_role`, function (err, results) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        var roles = results.map(({ id, title, salary, department_id }) => ({
                            value: id, name: `${title}`
                        }));
                        db.query(`SELECT id, CONCAT(first_name, ' ', last_name) AS manager_name FROM employee`, function (err, results) {
                            if (err) {
                                console.log(err);
                                return;
                            }
                            var noManager = {id: 0, manager_name: "None"};
                            results.push(noManager);
                            var managers = results.map(({ id, manager_name}) => ({
                                value: id, name: `${manager_name}`
                            }));
                            
                        inquirer
                        .prompt([
                            {
                                type: "input",
                                message: "Please Enter the New Employee's First Name:",
                                name: "firstName"
                            },
                            {
                                type: "input",
                                message: "Please Enter the New Employee's Last Name:",
                                name: "lastName"
                            },
                            {
                                type: "list",
                                message: "Please Enter the New Employee's Role: ",
                                name: "newEmpRole",
                                choices: roles
                            },
                            {
                                type: "list",
                                message: "Please Enter the New Employee's Manager: ",
                                name: "newEmpManager",
                                choices: managers
                            },
                        ])
                        .then((response) => {
                            const firstName = response.firstName;
                            const lastName = response.lastName;
                            const newEmpRole = response.newEmpRole;
                            const newEmpManager = response.newEmpManager;
                            addEmployee(firstName, lastName, newEmpRole, newEmpManager);
                        });
                    });
                });
                    break;
                case "Update Employee Role":
                    db.query(`SELECT * FROM employee`, function (err, results) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        var employees = results.map(({ id, first_name, last_name, role_id }) => ({
                            value: first_name, name: `${first_name} ${last_name}`
                        }));
                        db.query(`SELECT * FROM emp_role`, function (err, results) {
                            if (err) {
                                console.log(err);
                                return;
                            }
                            var roles = results.map(({ id, title, salary, department_id }) => ({
                                value: id, name: `${title}`
                            }));
                            inquirer
                            .prompt([
                                {
                                    type: "list",
                                    message: "Please Select the Employee Record to Update: ",
                                    name: "empFirstName",
                                    choices: employees
                                },
                                {
                                    type: "list",
                                    message: "Please Select a New Role for the Selected Employee: ",
                                    name: "updatedRole",
                                    choices: roles
                                }
                            ])
                            .then((response) => {
                                const empFirstName = response.empFirstName;
                                const updatedRole = response.updatedRole;
                                updateEmployee(empFirstName, updatedRole);
                            });
                        });
                    });
                    break;
                case "View All Roles":
                    viewRoles();
                    break;
                case "Add Role":
                    db.query(`SELECT * FROM department`, function (err, results) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        var departments = results.map(({ id, department_name }) => ({
                            value: id, name: `${department_name}`
                        }));
                        inquirer
                        .prompt([
                            {
                                type: "input",
                                message: "Please Enter a New Role:",
                                name: "newRole"
                            },
                            {
                                type: "input",
                                message: "Please Enter a Salary:",
                                name: "newSalary"
                            },
                            {
                                type: "list",
                                message: "Please Enter the Applicable Department",
                                name: "newRoleDep",
                                choices: departments
                            },
                        ])
                        .then((response) => {
                            const newRole = response.newRole;
                            const newSalary = response.newSalary;
                            const newRoleDep = response.newRoleDep;
                              addRole(newRole, newSalary, newRoleDep);
                            
                        });
                    });
                    break;
                case "View All Departments":
                    viewDepartments();
                    break;
                case "Add Department":
                    inquirer
                        .prompt([
                            {
                                type: "input",
                                message: "Please Enter a New Department Name:",
                                name: "newDepartment"
                            }
                        ])
                        .then((response) => {
                            const newDepartmentName = response.newDepartment;
                            addDepartment(newDepartmentName);
                        });
                    break;
                case "Quit":
                    db.end();
                    break;
            }
        });
}

// Initiante main menu
requestAction();
