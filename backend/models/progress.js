const mongoose = require('mongoose');

const setSchema = new mongoose.Schema({
  reps: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  rpe: {
    type: Number,
    default: null,
  }
});

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  workout: { type: mongoose.Schema.Types.ObjectId, ref: 'Workout' },
  exerciseName: String,
  sets: [
    {
      reps: Number,
      weight: Number
    }
  ],
  notes: String,
  completed: Boolean,
  isPR: Boolean
}, { timestamps: true })
;

module.exports = mongoose.model('Progress', progressSchema);

