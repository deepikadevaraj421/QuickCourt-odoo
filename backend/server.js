const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./modules/user/routes/userRoutes');
const ownerRoutes = require('./modules/owner/routes/ownerRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'QuickCourt Backend API is running' });
});

// Member 1 User Module Routes
app.use('/api/user', userRoutes);

// Member 2 Owner Module Routes
app.use('/api/owner', ownerRoutes);

app.listen(PORT, () => {
  console.log(`QuickCourt Backend Server listening on port ${PORT}`);
});
