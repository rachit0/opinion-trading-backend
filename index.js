const express = require('express');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const http = require('http');
const winston = require('winston');
require('dotenv').config();
const cors = require('cors');

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
  transports: [
    new winston.transports.File({ filename: 'logs/app.log' }),
    new winston.transports.Console(), // Added for immediate feedback
  ],
});

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection with debug logs
console.log('Attempting to connect to MongoDB...');
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB (console)');
    logger.info('Connected to MongoDB (logger)');

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/trades', tradeRoutes);

    // WebSocket setup
    io.on('connection', (socket) => {
      logger.info('Client connected');
      socket.emit('welcome', 'Connected to WebSocket');
    });
    

    // Start fetching data
    setInterval(async () => {
      const events = await fetchLiveData();
      io.emit('eventUpdate', events);
    }, 30000);

    // Start server
    server.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT} (console)`);
      logger.info(`Server running on port ${process.env.PORT} (logger)`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err);
    logger.error('MongoDB connection error:', err);
    process.exit(1); // Exit if connection fails
  });

// Error handling
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});