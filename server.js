// Required dependencies
const inquirer = require ("inquirer");
const mysql = require ("mysql");
require ("console.table");

// mysql connection setup
const connection = mysql.createConnection ({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'PasswordHere',
    database: 'employeeDB'
});

connection.connect((err) => {
    if (err) throw err;

});