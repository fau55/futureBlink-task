const mongoose = require('mongoose');
const scheduledEmailSchema = new mongoose.Schema({
  sequenceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sequence' },
  to: { type: String, required: true },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  sendAt: { type: Date, required: true }, // When the email should be sent
  status: { type: String, enum: ['pending', 'sent'], default: 'pending' }
});

module.exports = mongoose.model('ScheduledEmail', scheduledEmailSchema);
