const express = require('express');
const router = express.Router();
const db = require('../db');

// Get seats for a showtime
router.get('/', async (req, res) => {
    const { showtime_id } = req.query;
    if (!showtime_id) return res.status(400).json({ message: 'showtime_id required' });

    try {
        const [rows] = await db.query('SELECT * FROM seats WHERE showtime_id = ?', [showtime_id]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Database error' });
    }
});

// Add a seat
router.post('/', async (req, res) => {
    const { showtime_id, seat_number, category } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO seats (showtime_id, seat_number, category) VALUES (?, ?, ?)',
            [showtime_id, seat_number, category]
        );
        res.status(201).json({ seat_id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Database error' });
    }
});

module.exports = router;