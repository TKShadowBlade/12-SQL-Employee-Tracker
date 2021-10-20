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
        `SELECT e.id AS ID, e.first_name AS First, e.last_name AS Last, e.role_id AS title, r.salary AS Salary, m.last_name AS Manager, d.name AS Department
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
                const query = `SELECT e.id AS ID, e.first_name AS First, e.last_name AS last, e.role_id AS Title, r.salary AS Salary, m.last_name AS Manager, d.name AS Department
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

function viewByRole() {
    connection.query('SELECT title FROM role', (err, res) => {
        if(err) throw err;

        inquirer
            .prompt([
                {
                    name: 'choice',
                    type: 'rawlist',
                    choices: function() {
                        const choiceArray = [];
                        for (i = 0; i < res.length; i++) {
                            choiceArray.push (res[i].title);
                        }
                        return choiceArray;
                    },
                    message: 'Which role would you like to see?'
                }
            ]).then((answer) => {
                const query = `SELECT e.id AS ID, e.first_name AS First, e.last_name AS Last, e.role_id AS Title, r.salary AS Salary, m.last_name AS Manager, d.name AS Department
                FROM employee e
                LEFT JOIN employee m
                    ON e.manager_id = m.id
                LEFT JOIN role r
                    ON e.role_id = r.title
                LEFT JOIN department d
                    ON r.department_id = d.id WHERE e.role_id = ?`
                
                connection.query(query, [answer.choice], (err, res) => {
                    if(err) throw err;
                    console.table(res);
                    startUp();
                })

            });
    });
}

function add() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'add',
                message: 'Choose which you would like to add:',
                choices: ['Department', 'Role', 'Employee']
            }
        ]).then((res) => {
            switch(res.add){
                case 'Department':
                    addDepartment();
                    break;
                case 'Role':
                    addRole();
                    break;
                case 'Employee':
                    addEmployee();
                    break;
                default:
                    console.log('Thank you for your choice')
            }
        })
}

function addDepartment() {
    inquirer
        .prompt([
            {
                name: 'department',
                type: 'input',
                message: 'Type the name of the department you wish to add:'
            }
        ]).then((answer) => {
            connection.query(
                'INSERT INTO department VALUES (DEFAULT, ?',
                [answer.department],
                (err) => {
                    if(err) throw err;
                    console.log ('Updated successfully');
                    startUp();
                }
            )
        })
}

function addRole() {
    inquirer
        .prompt([
            {
                name: 'role',
                type: 'input',
                message: 'Type in the role you would like to add:'
            },
            {
                name: 'salary',
                type: 'number',
                message: 'Input salary here:',
                validate: (value) => {
                    if(isNaN(value) === false) {
                        return true;
                    }
                    return false;
                    }
            },
            {
                name: 'department_id',
                type: 'number',
                message: 'Input department ID here',
                validate: (value) => {
                    if(isNaN(value) === false) {
                        return true;
                    }
                    return false;
                    }
            }
        ]).then((answer) => {
            connection.query(
                'INSERT INTO role SET ?',
                {
                    title: answer.role,
                    salary: answer.salary,
                    department_id: answer.department_id
                },
                (err) => {
                    if(err) throw err;
                    console.log ('Updated successfully');
                    startUp();
                }
            )
        })
}

function addEmployee() {
    connection.query ('SELCT * FROM role', (err, res) => {
        if(err) throw err;
        inquirer
        .prompt([
            {
                name: 'first',
                type: 'input',
                message: 'Input employee first name here:'
            },
            {
                name: 'last',
                type: 'input',
                message: 'Input employee last name here:'
            },
            {
                name: 'role',
                type: 'rawlist',
                choices: function() {
                    const choiceArray = [];
                    for (i = 0; i < res.length; i++) {
                        choiceArray.push(res[i].title)
                    }
                    return choiceArray;
                },
                message: 'Choose a title:'
            },
            {
                name: 'manager',
                type: 'number',
                validate: (value) => {
                    if(isNaN(value) === false) {
                        return true;
                    }
                    return false;
                },
                message: 'Input manager ID here:',
                default: '1'
            }
        ]).then ((answer) => {
            connection.query(
                'INSERT INTO employee SET ?',
                {
                    first_name: answer.firstName,
                    last_name: answer.lastName,
                    role_id: answer.role,
                    manager_id: answer.manager
                }
            )
            console.log ("Succesful Add");
            startUp()
        });
    });
}