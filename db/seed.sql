USE employee_trackerDB

INSERT INTO department(title)
VALUES
    ('Management'),
    ('Sales'),
    ('Editing'),
    ('Accounting'),
    ('Branding'),
    ('Recording');
    
INSERT INTO role(title, salary, department_id)
VALUES
	('Regional Manager', 500000, 1),
    ('Sales Rep', 70000, 2),
    ('Brand Rep', 90000, 3),
    ('Editer', 50000, 4),
    ('Accountant', 100000, 5),
    ('Recording Rep', 120000, 6);
    
INSERT INTO employee(first_name, last_name, role_id)
VALUES
  ('Janet', 'Riggin', 1)
, ('Tiffani', 'Kicksey', 6)
, ('James', 'Jameson', 4)
, ('Toni', 'Reeves', 5)
, ('Toby', 'Majors', 3)
, ('Derrick', 'Thomas', 2);

UPDATE `employee_trackerDB`.`employee` SET `manager_id` = '1' WHERE (`id` > '1');
SELECT * FROM employee;
SELECT * FROM role;
SELECT * FROM department

