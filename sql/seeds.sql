USE employee_db;

INSERT INTO department (name)
VALUES ('Sales');
INSERT INTO department (name)
VALUES ('Engineering');
INSERT INTO department (name)
VALUES ('Finance');
INSERT INTO department (name)
VALUES ('Legal');

INSERT INTO role (title, salary, department_id)
VALUES ('Sales Lead', 110000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ('Lead Engineer', 150000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ('Software Engineer', 120000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ('Accountant', 125000, 3);
INSERT INTO role (title, salary, department_id)
VALUES ('Legal Team Lead', 255000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 1, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Megan', 'Bee', 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Rob', 'Roy', 3, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Jerry', 'Maguire', 4, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Martin', 'McFly', 5, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Barry', 'Watson', 2, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Gina', 'Thompson', 4, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Maggie', 'Davis', 1, 2);