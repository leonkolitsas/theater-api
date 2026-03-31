// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Import routes
const authRoutes = require('./routes/auth');
const theatresRoutes = require('./routes/theatres');
const showsRoutes = require('./routes/shows');
const showtimesRoutes = require('./routes/showtimes');
const seatsRoutes = require('./routes/seats');
const reservationsRoutes = require('./routes/reservations');

// Use routes
app.use('/auth', authRoutes);
app.use('/theatres', theatresRoutes);
app.use('/shows', showsRoutes);
app.use('/showtimes', showtimesRoutes);
app.use('/seats', seatsRoutes);
app.use('/reservations', reservationsRoutes);

// Test route
app.get('/', (req, res) => {
    res.send('🎭 Theatre Booking Backend is running!');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});