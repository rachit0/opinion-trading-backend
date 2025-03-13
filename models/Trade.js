const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  option: { type: String, required: true }, 
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'settled'], default: 'pending' },
}, { timestamps: true });

tradeSchema.index({ userId: 1, eventId: 1 });
module.exports = mongoose.model('Trade', tradeSchema);