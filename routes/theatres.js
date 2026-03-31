const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all theatres
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM theatres');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Database error' });
    }
});

// Add a new theatre (protected later)
router.post('/', async (req, res) => {
    const { name, location, description } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO theatres (name, location, description) VALUES (?, ?, ?)',
            [name, location, description]
        );
        res.status(201).json({ theatre_id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Database error' });
    }
});

module.exports = router;