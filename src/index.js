const express = require('express');
const { resume, exam, exercisebychapter,extendResume } = require("./api-text.js");
const app = express();
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads/'); // Aseguramos que los archivos se guarden en `src/uploads/`
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('archivo'), (req, res) => { // Primera petición necesaria para cargar el archivo
  const archivo = req.file;
  console.log('Archivo recibido:', archivo);
  if (!archivo) {
    return res.status(400).json({ mensaje: 'No se recibió ningún archivo' });
  }
  res.json({ mensaje: 'Archivo recibido con éxito', archivo });
});

app.get('/resume/:name', async (req, res) => { // Get de un resumen
  if (req.params.name) {
    const result = await resume(req.params.name)
    res.send(result)
  } else {
    res.send('No se ha podido crear el resumen');
  }
});

app.get('/extendResume/:name/:resume', async (req, res) => { // Get de un resumen
  if (req.params.name) {
    const result = await extendResume(req.params.name,req.params.resume)
    res.send(result)
  } else {
    res.send('No se ha podido crear el resumen');
  }
});

app.get('/exam/:name', async (req, res) => { // Get de un examen
  if (req.params.name) {
    const result = await exam(req.params.name)
    res.send(result)
  } else {
    res.send('No se ha podido crear el examen');
  }
});

app.get('/exercisebychapter/:name', async (req, res) => { // Get de ejercicios por capítulos
  if (req.params.name) {
    const result = await exercisebychapter(req.params.name)
    res.send(result)
  } else {
    res.send('No se han podido crear los ejercicios');
  }
});

app.listen(3000, async () => {
  console.log('El servidor está en funcionamiento en el puerto 3000.');
});
