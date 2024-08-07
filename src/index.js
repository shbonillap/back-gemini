const express = require('express')
const { resume, exam, exercisebychapter } = require("./api-text.js");
const app = express();
const multer = require('multer');
const cors = require('cors');
app.use(cors());



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directorio donde se guardarán los archivos
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Nombre del archivo en el servidor
  },
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('archivo'), (req, res) => { // Primera petición necesaria para cargar el archivo
  const archivo = req.file;
  if (!archivo) {
    return res.status(400).json({ mensaje: 'No se recibió ningún archivo' });
  }
  res.json({ mensaje: 'Archivo recibido con éxito', archivo });
});

app.get('/resume/:name', async (req, res) => { //Get de un resumen
  if (req.params.name) {
    const result = await resume(req.params.name)
    res.send(result)
  }
  else {
    res.send('No se ha podido crear el resumen');
  }
});

app.get('/exam/:name', async (req, res) => { // Get de un examen
  if (req.params.name) {
    const result = await exam(req.params.name)
    res.send(result)
  }
  else {
    res.send('No se ha podido crear el examen');
  }
});

app.get('/exercisebychapter/:name', async (req, res) => { //Get de ejercicios por capítulos
  if (req.params.name) {
    const result = await exercisebychapter(req.params.name)
    res.send(result)
  }
  else {
    res.send('No se han podido crear los ejercicios');
  }
});

app.listen(3000, async () => {
  console.log('El servidor está en funcionamiento en el puerto 3000.');
});