const express = require('express');
const cors = require('cors');
const { port, frontendUrl } = require('./config/env');

const authRoutes = require('./auth/routes/authRoutes');
const { authenticate, requireRole } = require('./auth/middleware/authenticate');
const errorHandler = require('./shared/middleware/errorHandler');

const userRoutes = require('./modules/user/routes/userRoutes');
const ownerRoutes = require('./modules/owner/routes/ownerRoutes');
const adminRoutes = require('./modules/admin/routes/adminRoutes');

const app = express();
const PORT = port;

app.use(cors({ origin: frontendUrl.split(',').map((s) => s.trim()), credentials: true }));
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'QuickCourt Backend API is running' });
});

// Central authentication (shared by all roles)
app.use('/api/auth', authRoutes);

// Member 1 User Module Routes
app.use('/api/user', authenticate, requireRole('USER', 'ADMIN'), userRoutes);

// Member 2 Owner Module Routes
app.use('/api/owner', authenticate, requireRole('OWNER', 'ADMIN'), ownerRoutes);

// Member 3 Admin Module Routes
app.use('/api/admin', authenticate, requireRole('ADMIN'), adminRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
});
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`QuickCourt Backend Server listening on port ${PORT}`);
});
