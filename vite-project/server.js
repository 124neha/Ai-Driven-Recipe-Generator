import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

// Initialize Express app
const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for frontend to access the backend

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost', // MySQL server host
  user: 'root', // Your MySQL username
  password: 'root', // Your MySQL password
  database: 'userDB', // Your MySQL database name
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL');
});

// Registration endpoint
app.post('/register', (req, res) => {
  const { firstName, lastName, username, password } = req.body;

  // Validate input
  if (!firstName || !lastName || !username || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Check if username already exists
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error.' });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'Username already exists.' });
    }

    // Insert new user into the database with plain-text password
    const query = 'INSERT INTO users (firstName, lastName, username, password) VALUES (?, ?, ?, ?)';
    db.query(query, [firstName, lastName, username, password], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Registration failed. Please try again.' });
      }

      // Respond with a success message
      res.status(201).json({ message: 'User registered successfully.' });
    });
  });
});

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and Password are required.' });
  }

  // Check if user exists
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error.' });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: 'Invalid username or password.' });
    }

    const user = results[0];

    // Directly compare the entered password with the stored plain-text password
    if (password === user.password) {
      // Passwords match, login successful
      return res.status(200).json({ message: 'Login successful!' });
    } else {
      // Passwords don't match
      return res.status(400).json({ message: 'Invalid username or password.' });
    }
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
