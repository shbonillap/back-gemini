const express = require('express')
//const {run} =  require("./api.js");
const {run} =  require("./api-text.js");
const app = express();

app.get('/', (req, res) => {
  res.send('¡Hola Mundo!');
  run()
});

app.listen(3000, async() => {
  console.log('El servidor está en funcionamiento en el puerto 3000.');
});