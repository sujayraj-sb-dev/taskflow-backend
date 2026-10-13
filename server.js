require('dotenv').config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const protect = require('./middleware/authMiddleware');
const adminOnly = require('./middleware/roleMiddleware');

connectDB();

const app = express();

// Added in Module 6: in development CLIENT_URL is unset, so cors() falls
// back to allowing any origin, exactly as it did before. In production it
// is set to the deployed Vercel URL, so only that frontend can call this API.
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: "Welcome to TaskFlow API" });
});

app.use('/api/auth', require('./routes/authRoutes'));

app.get('/api/admin-check', protect, adminOnly, (req, res) => {
 res.json({ message: `Welcome admin ${req.user.name}, access granted` });
});

app.use('/api/boards', require('./routes/boardRoutes'));
app.use('/api/cards', require('./routes/cardRoutes'));

app.use('/api/users', require('./routes/userRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});