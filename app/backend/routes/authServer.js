const express = require('express');
const cors = require('cors');
const db = require('./db'); 
const authRoutes = require('./routes/auth'); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Authentication server running on http://localhost:${PORT}`);
});
