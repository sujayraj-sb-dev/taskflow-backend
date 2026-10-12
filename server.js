require('dotenv').config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const protect = require('./middleware/authMiddleware');
const adminOnly = require('./middleware/roleMiddleware');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: "Welcome to TaskFlow API" });
});

app.use('/api/auth', require('./routes/authRoutes'));

app.get('/api/admin-check', protect, adminOnly, (req, res) => {
 res.json({ message: `Welcome admin ${req.user.name}, access granted` });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});