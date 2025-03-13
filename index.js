const express = require('express');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const http = require('http');
const winston = require('winston');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const tradeRoutes = require('./routes/trades');
const { fetchLiveData } = require('./services/dataFetch');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [new winston.transports.File({ filename: 'logs/app.log' })],
});

// Middleware
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => logger.info('Connected to MongoDB'))
  .catch((err) => logger.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/trades', tradeRoutes);

// WebSocket setup
io.on('connection', (socket) => {
  logger.info('Client connected');
  socket.emit('welcome', 'Connected to WebSocket');
});

// Simulate live data fetch every 30 seconds
setInterval(async () => {
  const events = await fetchLiveData();
  io.emit('eventUpdate', events); 
}, 30000);

// Error handling
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

server.listen(process.env.PORT, () => logger.info(`Server running on port ${process.env.PORT}`));