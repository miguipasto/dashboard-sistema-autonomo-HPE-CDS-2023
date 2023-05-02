const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rutas = require('./routes/routes');
const app = express();

// Configuración de Express
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use(rutas);

// Crea una ruta para la API
app.get('/', (req, res) => {
  res.json({ mensaje: 'LO HAREMOS?' });
});

// Inicio del servidor
app.listen(4000, () => {
  console.log('Server started on port 4000');
});

// Conexión a la base de datos
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost/HPE_FINAL', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to database'))
  .catch(error => console.log('Database connection error:', error));
