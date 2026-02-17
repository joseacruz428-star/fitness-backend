const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/dashboard', auth, (req, res) => {

  res.json({
    msg: 'Acceso autorizado',
    user: req.user
  });

});

module.exports = router;
