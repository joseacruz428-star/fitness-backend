const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Progress = require('../models/progress');

/**
 * TEST RUTA COACH
 */
router.get('/coach', auth, async (req, res) => {
  try {
    if (req.user.role !== 'coach') {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    const progress = await Progress.find()
      .populate('user', 'email')
      .sort({ createdAt: -1 });

    res.json(progress);
  } catch (error) {
    console.error('❌ ERROR PROGRESS COACH:', error);
    res.status(500).json({ message: 'Error obteniendo progreso' });
  }
});

/**
 * PROGRESO DEL ALUMNO LOGUEADO
 */
router.get('/my', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Solo alumnos' });
    }

    const progress = await Progress.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json(progress);
  } catch (error) {
    console.error('❌ ERROR PROGRESS STUDENT:', error);
    res.status(500).json({ message: 'Error obteniendo progreso' });
  }
});

/**
 * GUARDAR PROGRESO DEL ALUMNO
 */
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Solo alumnos' });
    }

    const { workoutId, exerciseName, sets, notes, completed } = req.body;

    if (!workoutId || !exerciseName || !sets || sets.length === 0) {
      return res.status(400).json({ message: 'Faltan datos obligatorios' });
    }

    // 🔥 1. Buscar progresos anteriores del mismo ejercicio
    const previousProgress = await Progress.find({
      user: req.user.id,
      exerciseName: exerciseName
    });

    // 🔥 2. Obtener el peso máximo histórico
    let maxHistoricalWeight = 0;

    previousProgress.forEach(p => {
      p.sets.forEach(s => {
        if (s.weight > maxHistoricalWeight) {
          maxHistoricalWeight = s.weight;
        }
      });
    });

    // 🔥 3. Obtener el mejor peso actual
    let currentMaxWeight = 0;

    sets.forEach(s => {
      if (s.weight > currentMaxWeight) {
        currentMaxWeight = s.weight;
      }
    });

    // 🔥 4. Comparar para PR
    const isPR = currentMaxWeight > maxHistoricalWeight;

    const progress = new Progress({
      user: req.user.id,
      workout: workoutId,
      exerciseName,
      sets,
      notes: notes || '',
      completed: completed !== undefined ? completed : true,
      isPR: isPR
    });

    await progress.save();

    res.status(201).json({
      progress,
      message: isPR ? '🏆 Nuevo PR alcanzado!' : 'Progreso guardado'
    });

  } catch (error) {
    console.error('❌ ERROR GUARDANDO PROGRESS:', error);
    res.status(500).json({ message: 'Error guardando progreso' });
  }
});

module.exports = router;

