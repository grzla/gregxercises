// Import the mysql2 library
const mysql = require('mysql2');

// Create a connection
const connection = mysql.createConnection({
  host: 'localhost', // or your database host
  user: 'root', // your MySQL username
  password: 'your_password', // your MySQL password
  database: 'your_database_name' // the name of your database
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    return;
  }
  console.log('Connected to MySQL');
});

// Execute a query (optional)
connection.query('SELECT * FROM your_table_name', (err, results) => {
  if (err) {
    console.error('Error executing query:', err.message);
    return;
  }
  console.log('Query results:', results);
});

// Close the connection (when done)
connection.end();
