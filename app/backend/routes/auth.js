const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

// User Registration
router.post('/register', async (req, res) => {
    const { firstname, lastname, mail, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.query(
            'INSERT INTO users (firstname, lastname, mail, password) VALUES (?, ?, ?, ?)',
            [firstname, lastname, mail, hashedPassword],
            (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Error creating user' });
                }
                res.status(201).json({ message: 'User created successfully' });
            }
        );
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// User Login
router.post('/login', (req, res) => {
    const { mail, password } = req.body;

    db.query('SELECT * FROM users WHERE mail = ?', [mail], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    });
});

module.exports = router;
