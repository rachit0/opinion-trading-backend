const Trade = require('../models/Trade');
const User = require('../models/User');
const Event = require('../models/Event');

async function settleTrades(eventId, result) {
  const event = await Event.findById(eventId);
  if (!event) return;

  event.status = 'settled';
  event.result = result;
  await event.save();

  const trades = await Trade.find({ eventId, status: 'pending' });
  for (const trade of trades) {
    const user = await User.findById(trade.userId);
    if (trade.option === result) {
      const payout = trade.amount * event.odds.get(result); // Calculate winnings
      user.balance += payout;
    }
    trade.status = 'settled';
    await Promise.all([trade.save(), user.save()]);
  }
}



module.exports = { settleTrades };