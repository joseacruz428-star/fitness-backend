exports.isCoach = (req, res, next) => {

  if (req.user.role !== 'coach') {
    return res.status(403).json({ message: 'Solo coaches pueden acceder' })
  }

  next()
}
