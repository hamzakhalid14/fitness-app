const mongoose = require('mongoose');

const setSchema = new mongoose.Schema({
  setNumber: Number,
  reps: Number,
  weight: Number,
  restTime: Number, // en secondes
  completed: {
    type: Boolean,
    default: false
  }
});

const exerciseEntrySchema = new mongoose.Schema({
  exercise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true
  },
  sets: [setSchema],
  notes: String,
  order: Number
});

const workoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  exercises: [exerciseEntrySchema],
  duration: Number, // en minutes
  calories: Number,
  notes: String,
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Workout', workoutSchema);