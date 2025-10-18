const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['cardio', 'force', 'core', 'flexibility'],
    required: true
  },
  muscleGroup: {
    type: String,
    required: true
  },
  equipment: {
    type: String,
    enum: ['aucun', 'haltères', 'barre', 'machine', 'poids corps', 'bandes'],
    default: 'aucun'
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  instructions: [String],
  videoUrl: String,
  imageUrl: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Exercise', exerciseSchema);