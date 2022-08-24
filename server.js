// Require npm packages
const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');

// Declare port and app variable
const PORT = process.env.PORT || 3001;
const app = express();

// Declare middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

function addEmployee(){

}

function updateEmployee(){

}

function viewRoles(){

}

function addRole() {

}

function viewDepartments() {

}

function addDepartment(){

}

function restartAction() {

}

function requestAction() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                name: "requestAction",
                choices: ["Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit"],
                default: "Quit"
            }
        ])
        .then((response) => {
            const userAction = response.requestAction;
            switch(userAction){
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