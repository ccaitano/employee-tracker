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
        password:'Toshio_10',
        database: 'company_db'
    },
    console.log('Connected to the company_db database.')
);
// Declare global variables
db.query(`SELECT * FROM department`, function (err, results) {
    if (err) {
        console.log(err);
        return;
    }
    var departments = results.map(({ id, department_name }) => ({
        value: id, name: `${department_name}`
    }));
    console.log(departments);
    requestAction(departments);
});


function viewEmployees(){
    db.query(`SELECT employee.id, employee.first_name, employee.last_name, emp_role.title, department.department_name, emp_role.salary FROM employee JOIN emp_role ON employee.role_id = emp_role.id JOIN department ON department.id = emp_role.department_id`, function (err, results) {
        if (err) {
            console.log(err);
            return;
        }

        console.table(results);
        restartAction();
    });
}

function addEmployee(){

}

function updateEmployee(){

}

function viewRoles(){
    db.query(`SELECT id, title, salary FROM emp_role`, function (err, results) {
        if (err) {
            console.log(err);
            return;
        }

        console.table(results);
        restartAction();
    });
}

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

function requestAction(departments) {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                name: "requestAction",
                choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit"],
                default: "Quit"
            }
        ])
        .then((response) => {
            const userAction = response.requestAction;
            switch(userAction){
                case "View All Employees":
                    viewEmployees();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Update Employee Role":
                    updateEmployee();
                    break;
                case "View All Roles":
                    viewRoles();
                    break;
                case "Add Role":
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
                    restartAction();
                    break;
            }
        })
}

