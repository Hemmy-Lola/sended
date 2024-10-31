// authServer.js
const express = require('express');
const cors = require('cors');
const db = require('./db'); // Database connection file
const authRoutes = require('./routes/auth'); // Authentication routes

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Authentication server running on http://localhost:${PORT}`);
});
