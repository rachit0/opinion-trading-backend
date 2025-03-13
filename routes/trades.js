const express = require('express');
const { auth } = require('../middleware/auth');
const Trade = require('../models/Trade');
const User = require('../models/User');
const Event = require('../models/Event');

const router = express.Router();

router.use(auth);

router.post('/', async (req, res) => {
  const { eventId, option, amount } = req.body;
  const user = await User.findById(req.user.id);
  if (user.balance < amount) return res.status(400).json({ message: 'Insufficient balance' });

  const event = await Event.findById(eventId);
  if (!event || event.status !== 'active') return res.status(400).json({ message: 'Invalid event' });

  const trade = new Trade({ userId: req.user.id, eventId, option, amount });
  user.balance -= amount;
  await Promise.all([trade.save(), user.save()]);
  res.status(201).json(trade);
});

module.exports = router;