const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'letelemokapela0602',
    database: 'wings'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

// Registration API
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Insert the username and password directly, without hashing
    db.query(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, password],
        (err) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: 'Username already exists' });
                }
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ message: 'Registration successful' });
        }
    );
});

// Login API
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.query(
        'SELECT * FROM users WHERE username = ? AND password = ?',
        [username, password],
        (err, results) => {
            if (err || results.length === 0) return res.status(400).json({ error: 'Invalid username or password' });
            res.json({ message: 'Login successful' });
        }
    );
});

// Fetch all products
app.get('/products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
    });
});

// Add a new product
app.post('/products', (req, res) => {
    const { name, description, category, price, quantity } = req.body;
    db.query(
        'INSERT INTO products (name, description, category, price, quantity) VALUES (?, ?, ?, ?, ?)',
        [name, description, category, price, quantity],
        (err) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json({ message: 'Product added successfully' });
        }
    );
});

// Update a product
app.put('/products/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, category, price, quantity } = req.body;
    db.query(
        'UPDATE products SET name = ?, description = ?, category = ?, price = ?, quantity = ? WHERE id = ?',
        [name, description, category, price, quantity, id],
        (err) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json({ message: 'Product updated successfully' });
        }
    );
});

// Delete a product
app.delete('/products/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM products WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Product deleted successfully' });
    });
});

// Fetch all users
app.get('/users', (req, res) => {
    db.query('SELECT username, password FROM users', (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
    });
});

// Add a new user
app.post('/users', (req, res) => {
    const { username, password } = req.body;
    db.query(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, password],
        (err) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: 'Username already exists' });
                }
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ message: 'User added successfully' });
        }
    );
});

// Update a user
app.put('/users', (req, res) => {
    const { oldUsername, newUsername, newPassword } = req.body;
    db.query(
        'UPDATE users SET username = ?, password = ? WHERE username = ?',
        [newUsername, newPassword, oldUsername],
        (err) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json({ message: 'User updated successfully' });
        }
    );
});

// Delete a user
app.delete('/users', (req, res) => {
    const { username } = req.body;
    db.query('DELETE FROM users WHERE username = ?', [username], (err) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'User deleted successfully' });
    });
});

const PORT = 5300;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));