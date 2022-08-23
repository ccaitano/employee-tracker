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
