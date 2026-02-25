const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const role = require('../middleware/role')

const User = require('../models/user')
const bcrypt = require('bcryptjs')

// ============================
// CREAR ALUMNO (COACH)
// ============================

router.post('/create', auth, role('coach'), async (req, res) => {

  try {

    const { name, email, password } = req.body

    const exists = await User.findOne({ email })

    if (exists) {
      return res.status(400).json({ msg: 'Alumno ya existe' })
    }

    const hashed = await bcrypt.hash(password, 10)

    const student = new User({

    name,
    email,
    password: hashed,
    role: 'student',
    coach: req.user.id

    })


    await student.save()

    res.json({ msg: 'Alumno creado correctamente' })

  } catch (err) {

    res.status(500).json({ error: err.message })

  }

})

// ============================
// LISTAR MIS ALUMNOS
// ============================

router.get('/', auth, role('coach'), async (req, res) => {

  try {

    const students = await User.find({
      role: 'student',
      coach: req.user.id
    }).select('-password')

    res.json(students)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }

})

module.exports = router
