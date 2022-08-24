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
    db.query(`SELECT * FROM emp_role`, function (err, results) {
        if (err) {
            console.log(err);
            return;
        }

        console.table(results);
        restartAction();
    });
}

function addRole() {

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

function addDepartment(){

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

function requestAction() {
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
                    addRole();
                    break;
                case "View All Departments":
                    viewDepartments();
                    break;
                case "Add Department":
                    addDepartment();
                    break;
                case "Quit":
                    restartAction();
                    break;
            }
        })
}

requestAction();