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
    enum: ['cardio', 'force', 'flexibilité'],
    required: true
  },
  muscleGroup: {
    type: String,
    enum: [
      'pectoraux', 'dos', 'épaules', 'biceps', 'triceps',
      'jambes', 'abdominaux', 'fessiers', 'cardio', 'full-body'
    ],
    required: true
  },
  equipment: {
    type: String,
    enum: ['aucun', 'haltères', 'barre', 'machine', 'poids corps', 'bandes'],
    default: 'aucun'
  },
  difficulty: {
    type: String,
    enum: ['débutant', 'intermédiaire', 'avancé'],
    default: 'débutant'
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