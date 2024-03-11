const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

// To establish the connection with sql
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'database'
});

// To create mysql table if not exits
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL');

  const createtable = `
    CREATE TABLE IF NOT EXISTS employees (
      id INT AUTO_INCREMENT PRIMARY KEY,
      full_name VARCHAR(100) NOT NULL,
      age INT,
      date_of_birth DATE,
      salary DECIMAL(10, 2),
      department VARCHAR(100)
    )
  `;
  db.query(createtable, (err) => {
    if (err) {
      throw err;
    }
  });
  console.log("employees table is created");
});

app.use(express.json());

// To add an Employee
app.post('/employees', (req, res) => {
  const { full_name, age, date_of_birth, salary, department } = req.body;
  const query = 'INSERT INTO employees (full_name, age, date_of_birth, salary, department) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [full_name, age, date_of_birth, salary, department], (err, result) => {
    if (err) {
      throw err;
    }
    res.json({ message: 'Employee is added', employee: { id: result.insertId, full_name, age, date_of_birth, salary, department } });
  });
});

// To get all employees
app.get('/employees', (req, res) => {
  const query = 'SELECT * FROM employees';
  db.query(query, (err, result) => {
    if (err) {
      throw err;
    }
    res.json(result);
  });
});

// To update details of employee
app.put('/employees/:id', (req, res) => {
  const { full_name, age, date_of_birth, salary, department } = req.body;
  const { id } = req.params;
  const query = 'UPDATE employees SET full_name=?, age=?, date_of_birth=?, salary=?, department=? WHERE id=?';
  db.query(query, [full_name, age, date_of_birth, salary, department, id], (err) => {
    if (err) {
      throw err;
    }
    res.json({ message: 'Employee details are updated', employee: { id, full_name, age, date_of_birth, salary, department } });
  });
});

// To delete an employee
app.delete('/employees/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM employees WHERE id=?';
  db.query(query, id, (err) => {
    if (err) {
      throw err;
    }
    res.json({ message: 'Employee is deleted', id });
  });
});


// To start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
