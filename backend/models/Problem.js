const mongoose = require('mongoose');

const sampleSchema = new mongoose.Schema(
  {
    input: String,
    output: String,
    explanation: String,
  },
  { _id: false }
);

const hiddenSchema = new mongoose.Schema(
  {
    input: String,
    output: String,
  },
  { _id: false }
);

const problemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    statement: { type: String, required: true },
    inputFormat: { type: String },
    outputFormat: { type: String },
    constraints: { type: String },
    samples: [sampleSchema],
    hiddenTests: [hiddenSchema],
    timeLimitMs: { type: Number, default: 2000 },
    memoryLimitMB: { type: Number, default: 256 },
    publisherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    publisherName: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Problem', problemSchema);
