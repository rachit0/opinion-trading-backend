const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startTime: Date,
  odds: { type: Map, of: Number }, 
  status: { type: String, enum: ['active', 'settled'], default: 'active' },
  result: String,
}, { timestamps: true });

eventSchema.index({ status: 1 }); 
module.exports = mongoose.model('Event', eventSchema);