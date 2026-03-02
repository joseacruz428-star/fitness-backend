const express = require('express')
const router = express.Router()

const Workout = require('../models/Workout')
const protect = require('../middleware/auth')

const role = require('../middleware/role')


// ============================
// CREAR RUTINA (COACH)
// ============================
router.post('/', protect, role('coach'), async (req, res) => {
  try {
    const { title, exercises, student } = req.body

    if (!title || !exercises || exercises.length === 0) {
      return res.status(400).json({ message: 'Faltan datos' })
    }

    const workout = new Workout({
      title,
      exercises,
      coach: req.user.id,
      student: student || null
    })

    await workout.save()
    res.json({ message: 'Rutina creada correctamente' })

  } catch (err) {
    res.status(500).json({ message: 'Error creando rutina' })
  }
})


// ============================
// COACH — VER MIS RUTINAS
// ============================
router.get('/coach', protect, role('coach'), async (req, res) => {
  const workouts = await Workout.find({
    coach: req.user.id
  }).populate('student', 'name email')

  res.json(workouts)
})


// ============================
// COACH — ASIGNAR RUTINA A ALUMNO
// ============================
router.put('/assign/:workoutId/:studentId', protect, role('coach'), async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.workoutId)

    if (!workout) {
      return res.status(404).json({ message: 'Rutina no encontrada' })
    }

    if (workout.coach.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'No autorizado' })
    }

    workout.student = req.params.studentId
    await workout.save()

    res.json({ message: 'Rutina asignada al alumno' })

  } catch (err) {
    res.status(500).json({ message: 'Error asignando rutina' })
  }
})


// ============================
// ALUMNO — VER MIS RUTINAS
// ============================
router.get('/student', protect, role('student'), async (req, res) => {
  try {
    const workouts = await Workout.find({
      student: req.user.id
    })

    res.json(workouts)
  } catch (err) {
    res.status(500).json({ message: 'Error obteniendo rutinas' })
  }
})

module.exports = router;
