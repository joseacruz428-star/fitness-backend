module.exports = function (roleRequired) {

  return function (req, res, next) {

    if (!req.user || !req.user.role) {
      return res.status(401).json({ msg: 'No autorizado' })
    }

    if (req.user.role !== roleRequired) {
      return res.status(403).json({ msg: 'Rol no permitido' })
    }

    next()

  }

}
