// Required dependencies
const inquirer = require ("inquirer");
const mysql = require ("mysql");
const consoleTable = require ("console.table");
const { start } = require("repl");

// mysql connection setup
const connection = mysql.createConnection ({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'PasswordHere',
    database: 'employee_db'
});

connection.connect((err) => {
    if (err) throw err;
    console.log ('Connection successful');

    startUp();
});

function startUp() {
    inquirer
        .prompt([
            {
            type: 'list',
            name: 'begin',
            message: 'Which of the following would you like to access first?',
            choices: ['View', 'Add', 'Update', 'Quit']
            }
        ]).then((res) => {
            switch(res.begin){
                case 'View':
                    view();
                    break;
                case 'Add':
                    add();
                    break;
                case 'Update':
                    updateEmployee();
                    break;
                case 'Exit':
                    console.log ('Completed');
                    break;
                default:
                    console.log ('Thank you for your attention')
            }
        });
}