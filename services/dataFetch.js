const axios = require('axios');
const Event = require('../models/Event');

async function fetchLiveData() {
  try {

    const mockData = [
      { name: 'Will it rain today?', startTime: new Date(), odds: { Yes: 1.8, No: 2.1 } },
    ];
    await Event.deleteMany({}); 
    const events = await Event.insertMany(mockData);
    return events;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

module.exports = { fetchLiveData };