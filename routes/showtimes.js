const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all showtimes, optional filter by show_id
router.get('/', async (req, res) => {
    const { show_id } = req.query;
    let query = 'SELECT * FROM showtimes WHERE 1';
    const params = [];
    if (show_id) {
        query += ' AND show_id = ?';
        params.push(show_id);
    }

    try {
        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Database error' });
    }
});

// Add a new showtime
router.post('/', async (req, res) => {
    const { show_id, show_date, show_time } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO showtimes (show_id, show_date, show_time) VALUES (?, ?, ?)',
            [show_id, show_date, show_time]
        );
        res.status(201).json({ showtime_id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Database error' });
    }
});

module.exports = router;