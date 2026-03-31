const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/auth'); // make sure this exports (req,res,next)

// GET /reservations/user - Get reservations of logged-in user
router.get('/user', authenticateToken, async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT r.reservation_id, r.user_id, r.showtime_id, r.seat_id,
                    s.seat_number, s.category,
                    st.show_date, st.show_time,
                    sh.title AS show_title,
                    t.name AS theatre_name
             FROM reservations r
             JOIN seats s ON r.seat_id = s.seat_id
             JOIN showtimes st ON r.showtime_id = st.showtime_id
             JOIN shows sh ON st.show_id = sh.show_id
             JOIN theatres t ON sh.theatre_id = t.theatre_id
             WHERE r.user_id = ?`,
            [req.user.userId]
        );

        res.json({ reservations: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Database error' });
    }
});

// POST /reservations - Create a new reservation
router.post('/', authenticateToken, async (req, res) => {
    const { showtime_id, seat_id } = req.body;

    if (!showtime_id || !seat_id) {
        return res.status(400).json({ message: 'showtime_id and seat_id are required' });
    }

    try {
        // Check if seat exists and is available
        const [seatRows] = await db.query(
            'SELECT is_reserved FROM seats WHERE seat_id = ?',
            [seat_id]
        );

        if (!seatRows[0]) {
            return res.status(404).json({ message: 'Seat not found' });
        }

        if (seatRows[0].is_reserved) {
            return res.status(400).json({ message: 'Seat already reserved' });
        }

        // Insert reservation
        const [result] = await db.query(
            'INSERT INTO reservations (user_id, showtime_id, seat_id) VALUES (?, ?, ?)',
            [req.user.userId, showtime_id, seat_id]
        );

        // Mark seat as reserved
        await db.query('UPDATE seats SET is_reserved = 1 WHERE seat_id = ?', [seat_id]);

        res.status(201).json({ message: 'Reservation created', reservationId: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Database error' });
    }
});

module.exports = router;