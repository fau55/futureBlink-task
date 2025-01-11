const mongoose = require('mongoose');
const sequenceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  nodes: { type: Array, required: true }, // JSON structure to represent nodes
  edges: { type: Array, required: true }, // JSON structure to represent edges
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sequence', sequenceSchema);
