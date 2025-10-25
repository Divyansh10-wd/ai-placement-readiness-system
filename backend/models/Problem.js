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
    slug: { type: String, unique: true, sparse: true },
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

// Auto-generate slug from title before saving
problemSchema.pre('save', function(next) {
  if (!this.slug && this.title) {
    // Create slug from title: lowercase, replace spaces with hyphens, remove special chars
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    // Add random suffix to ensure uniqueness
    this.slug += '-' + Date.now().toString(36);
  }
  next();
});

module.exports = mongoose.model('Problem', problemSchema);
