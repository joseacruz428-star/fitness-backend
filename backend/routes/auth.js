const verifyToken = require('../middleware/auth')

const express = require('express');
const router = express.Router();

const User = require('../models/user');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// =======================
// REGISTER
// =======================

router.post('/register', async (req, res) => {

  try {

    const { name, email, password, role } = req.body;

    // Si falta data básica
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Faltan datos' });
    }

    // Ver si ya existe un coach
    const coachExists = await User.findOne({ role: 'coach' });

    if (role === 'coach' && coachExists) {
      return res.status(403).json({ message: 'Coach ya existe' });
    }

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({ message: 'Usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    await user.save();

    res.json({
      message: 'Usuario creado correctamente'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }

});

  
// =======================
// LOGIN
// =======================

router.post('/login', async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Usuario no existe' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Password incorrecto' });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login correcto',
      token,
      role: user.role,
      name: user.name
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});


// =======================
// BORRAR USUARIO (DEV)
// =======================

router.delete('/delete', async (req, res) => {

  await User.deleteOne({ email: 'coach@fitness.com' });

  res.json({ message: 'Usuario eliminado' });

});

// =======================
// EXPORT
// =======================

module.exports = router;
