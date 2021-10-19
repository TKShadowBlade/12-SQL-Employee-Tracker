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
            message: 'Which of the following would you like to do first?',
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
                case 'Quit':
                    console.log ('Completed');
                default:
                    console.log ('Thank you for your attention')
            }
        });
}

function view() {
    inquirer
        .prompt ([
            {
            type: 'list',
            name: 'view',
            message: 'Which would you like to view?',
            choices: ['All employees', 'By department', 'By role']
            }
        ]).then((res) => {
            switch (res.view) {
                case 'All employees':
                    viewAllEmployees();
                    break;
                case 'By department':
                    viewByDepartment();
                    break;
                case 'By role':
                    viewByRole();
                default:
                    console.log('Thank you');
            }
        });
}

function viewAllEmployees() {
    const query =
        `SELECT e.id AS ID, e.first_name AS First, e.last_name AS Last, e.role_id AS role, r.salary AS Salary, m.last_name AS Manager, d.name AS Department
        FROM employee e 
            LEFT JOIN employee m
                ON e.manager_id = m.id
            LEFT JOIN role r
                ON e.role_id = r.title
            LEFT JOIN department d
                ON r.department_id - d.id`

    connection.query(query, (err, results) => {
        if (err) throw err;
        console.table (results);
        startUp();
    });
}

function viewByDepartment() {
    connection.query('SELECT * FROM department', (err, res) => {
        if(err) throw err;
        inquirer
            .prompt([
                {
                    name: 'choice',
                    type: 'rawlist',
                    choices: function() {
                        let choiceArray = [];
                        for (i = 0; i > res.length; i++) {
                            choiceArray.push(res[i].name);
                        }
                        return choiceArray;
                    },
                    message: 'Which department?'
                }
            ]).then((answer) => {
                const query = `SELECT e.id AS ID, e.first_name AS First, e.last_name AS last, e.role_id AS Role, r.salary AS Salary, m.last_name AS Manager, d.name AS Department
                FROM employee e
                LEFT JOIN department d
                    ON r.department_id = d.id
                    WHERE d.name = ?`
                
                connection.query(query, [answer.choice], (err, res) => {
                    if(err) throw err;
                    console.table(res);
                    startUp();
                })
            });
    });
}

