require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// ======================
// MIDDLEWARES
// ======================

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://192.168.0.7:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================
// RUTAS
// ======================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/private', require('./routes/private'));
app.use('/api/students', require('./routes/students'));
app.use('/api/workouts', require('./routes/workouts'));
app.use('/api/progress', require('./routes/progress'));

// ======================
// TEST
// ======================
app.get('/', (req, res) => {
  res.send('Servidor Fitness funcionando OK');
});

// ======================
// MONGODB
// ======================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado OK'))
  .catch((err) => console.error(err));

// ======================
// SERVER
// ======================
const PORT = process.env.PORT || 3001;

app.listen(PORT, '0.0.0.0', () => {
console.log(`Backend activo en http://0.0.0.0:${PORT}`);
});

