const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB Init
const db = new sqlite3.Database('./data/form.db', (err) => {
  if (err) console.error('Error al abrir la DB', err.message);
  else {
    db.run(`CREATE TABLE IF NOT EXISTS formulario (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT,
      correo TEXT,
      telefono TEXT,
      mensaje TEXT
    )`);
  }
});

// Ruta para guardar formulario
app.post('/formulario', (req, res) => {
  const { nombre, correo, telefono, mensaje } = req.body;
  db.run(
    `INSERT INTO formulario (nombre, correo, telefono, mensaje) VALUES (?, ?, ?, ?)`,
    [nombre, correo, telefono, mensaje],
    function (err) {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Error al guardar' });
      }
      res.status(201).json({ id: this.lastID, mensaje: 'Guardado exitosamente' });
    }
  );
});

app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});
