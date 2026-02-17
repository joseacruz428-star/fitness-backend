const mongoose = require('mongoose')

const WorkoutSchema = new mongoose.Schema({
  title: { type: String, required: true },
  exercises: [
    {
      name: String,
      sets: Number,
      reps: String,
      weight: String
    }
  ],
  coach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  type: {
    type: String,
    enum: ['template', 'personal'],
    default: 'personal'
  }
}, { timestamps: true })

module.exports = mongoose.model('Workout', WorkoutSchema)

