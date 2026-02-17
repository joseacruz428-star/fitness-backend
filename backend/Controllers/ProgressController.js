const Progress = require('../models/Progress')

// Crear progreso
exports.createProgress = async (req, res) => {
  try {
    const progress = await Progress.create({
      user: req.user._id,
      weight: req.body.weight,
      rm: req.body.rm,
      notes: req.body.notes
    })

    res.status(201).json(progress)
  } catch (error) {
    res.status(400).json({ message: 'Error al guardar progreso' })
  }
}

// Ver progreso propio
exports.getMyProgress = async (req, res) => {
  const progress = await Progress.find({ user: req.user._id })

  res.json(progress)
}
