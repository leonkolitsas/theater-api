const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all shows with optional filters
router.get('/', async (req, res) => {
    const { theatreId, title } = req.query;
    let query = 'SELECT * FROM shows WHERE 1';
    const params = [];

    if (theatreId) {
        query += ' AND theatre_id = ?';
        params.push(theatreId);
    }
    if (title) {
        query += ' AND title LIKE ?';
        params.push(`%${title}%`);
    }

    try {
        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Database error' });
    }
});

// Add a new show
router.post('/', async (req, res) => {
    const { theatre_id, title, description, duration, age_rating } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO shows (theatre_id, title, description, duration, age_rating) VALUES (?, ?, ?, ?, ?)',
            [theatre_id, title, description, duration, age_rating]
        );
        res.status(201).json({ show_id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Database error' });
    }
});

module.exports = router;