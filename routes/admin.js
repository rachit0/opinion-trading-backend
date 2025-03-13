const express = require('express');
const { auth, adminOnly } = require('../middleware/auth');
const Event = require('../models/Event');
const Trade = require('../models/Trade');

const router = express.Router();

router.use(auth, adminOnly);

router.get('/events', async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

router.post('/events', async (req, res) => {
  const { name, startTime, odds } = req.body;
  const event = new Event({ name, startTime, odds });
  await event.save();
  res.status(201).json(event);
});

router.get('/trades', async (req, res) => {
  const trades = await Trade.find().populate('userId', 'username').populate('eventId', 'name');
  res.json(trades);
});

module.exports = router;