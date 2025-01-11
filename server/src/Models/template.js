const mongoose = require('mongoose');
const templateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Template', templateSchema);