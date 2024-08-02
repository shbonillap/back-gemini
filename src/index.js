import express from "express";
import api from "./api.js"
const app = express();

app.get('/', (req, res) => {
  res.send('¡Hola Mundo!');
  api.run()
});

app.listen(3000, async() => {
  console.log('El servidor está en funcionamiento en el puerto 3000.');
});