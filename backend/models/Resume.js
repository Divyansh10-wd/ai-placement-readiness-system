const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  location: String,
  startDate: { type: String, required: true },
  endDate: String,
  current: { type: Boolean, default: false },
  description: [String],
  technologies: [String]
});

const educationSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  field: String,
  location: String,
  startDate: String,
  endDate: String,
  gpa: String,
  achievements: [String]
});

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  technologies: [String],
  link: String,
  github: String,
  highlights: [String]
});

const certificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  issuer: String,
  date: String,
  credentialId: String,
  link: String
});

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    default: 'My Resume'
  },
  template: {
    type: String,
    enum: [
      'modern',
      'classic',
      'minimal',
      'professional',
      'creative',
      'executive',
      'technical',
      'academic',
      'simple',
      'elegant',
      'bold',
      'compact',
      'infographic',
      'timeline',
      'two-column'
    ],
    default: 'modern'
  },
  personalInfo: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    location: String,
    linkedin: String,
    github: String,
    portfolio: String,
    summary: String
  },
  experience: [experienceSchema],
  education: [educationSchema],
  projects: [projectSchema],
  skills: {
    technical: [String],
    languages: [String],
    frameworks: [String],
    tools: [String],
    soft: [String]
  },
  certifications: [certificationSchema],
  achievements: [String],
  aiSuggestions: {
    summaryImprovement: String,
    skillsToAdd: [String],
    experienceImprovements: [{
      index: Number,
      suggestions: [String]
    }],
    overallScore: Number,
    atsScore: Number,
    improvements: [String]
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for faster queries
resumeSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Resume', resumeSchema);
