INSERT INTO department(title)
VALUES
	  ('Management')
	, ('Sales')
    , ('Editing')
    , ('Accounting')
    , ('Human Resources')
    , ('Brand');
    
INSERT INTO role(title, salary, department_id)
VALUES
	  ('Regional Manager', 350000, 1)
    , ('Sales Rep', 78000, 2)
    , ('HR Rep', 82000, 3)
    , ('Editing', 55000, 4)
    , ('Accountant', 90000, 5)
    , ('Brand Rep', 55000, 6);
    
INSERT INTO employee(first_name, last_name, role_id)
VALUES
  ('Kobe', 'Hill', 1)
, ('Joe', 'Boe', 6)
, ('James', 'Tall', 4)
, ('Tony', 'Reeves', 5)
, ('Toby', 'Phillips', 3)
, ('Copi', 'Thomas', 2);

UPDATE `employee_tracker`.`employee` SET `manager_id` = '1' WHERE (`id` > '1');
SELECT * FROM employee;
SELECT * FROM role;
SELECT * FROM department

