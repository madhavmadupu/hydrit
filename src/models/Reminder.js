const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  time: {
    type: String,
    required: true // Format: "HH:mm"
  },
  enabled: {
    type: Boolean,
    default: true
  },
  days: [{
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Reminder', reminderSchema);