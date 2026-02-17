const express = require('express')
const router = express.Router()

const { protect } = require('../middleware/authMiddleware')
const { isCoach } = require('../middleware/roleMiddleware')
const User = require('../models/User')

/* =========================
   COACH — ASIGNAR ALUMNO
========================= */
router.put('/assign/:studentId', protect, isCoach, async (req, res) => {
  try {
    const student = await User.findById(req.params.studentId)

    if (!student) {
      return res.status(404).json({ message: 'Alumno no encontrado' })
    }

    student.coach = req.user._id
    await student.save()

    res.json({ message: 'Alumno asignado correctamente' })

  } catch (err) {
    res.status(500).json({ message: 'Error asignando alumno' })
  }
})

module.exports = router

