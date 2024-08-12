const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
const fs = require("fs");
const path = require('path');

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const MAX_FILE_SIZE = 20971520; // 20 MB

function fileToGenerativePart(name, mimeType) {
  const filePath = path.join(__dirname, 'uploads', name);
  const fileSize = fs.statSync(filePath).size;

  if (fileSize > MAX_FILE_SIZE) {
    throw new Error(`El archivo ${name} es demasiado grande para procesar.`);
  }

  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(filePath)).toString("base64"),
      mimeType
    },
  };
}

async function resume(name) {
  const prompt = "Hazme un resumen en español";
  try {
    const pdf = [fileToGenerativePart(name, "application/pdf")];
    const result = await model.generateContent([prompt, ...pdf]);
    const response = await result.response;
    const text = await response.text();
    console.log(text);
    return text;
  } catch (error) {
    console.error("Error procesando el archivo:", error.message);
    throw error;
  }
}

async function extendResume(name, resume) {
  const prompt = "Extiendeme este resumen:"+resume;
  try {
    const pdf = [fileToGenerativePart(name, "application/pdf")];
    const result = await model.generateContent([prompt, ...pdf]);
    const response = await result.response;
    const text = await response.text();
    console.log(text);
    return text;
  } catch (error) {
    console.error("Error procesando el archivo:", error.message);
    throw error;
  }
}

async function exam(name) {
  const prompt = "Hazme un examen tipo test de 10 preguntas.Las preguntas y respuestas en español dandome como resultado un json con el siguiente formato { \"preguntas\": [ { \"enunciado\": \"Escribe aquí el enunciado de la primera pregunta.\", \"respuesta1\": \"Opción de respuesta 1\", \"respuesta2\": \"Opción de respuesta 2\", \"respuesta3\": \"Opción de respuesta 3\", \"respuesta4\": \"Opción de respuesta 4\", \"solucion\": \"Número de la respuesta correcta (1, 2, 3 o 4)\" } ] }";

  try {
    const pdf = [fileToGenerativePart(name, "application/pdf")];
    const result = await model.generateContent([prompt, ...pdf]);
    const response = await result.response;
    let text = await response.text();
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text);
    } 
    catch (error) {
    console.error("Error procesando el archivo:", error.message);
    throw error;
  }
}

async function exercisebychapter(name) {
  const prompt = "Ponme un ejercicio que no sea de test con su respuesta. La pregunta y la respuesta en español dandome como resultado un JSON con el siguiente formato (\"pregunta\": [ { \"enunciado\": \"Escribe aquí el enunciado de la pregunta.\", \"respuesta\": \"Respuesta a la pregunta\")";
  try {
    const pdf = [fileToGenerativePart(name, "application/pdf")];
    const result = await model.generateContent([prompt, ...pdf]);
    const response = await result.response;
    let text = await response.text();
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    console.log(text);
    return text;
  } catch (error) {
    console.error("Error procesando el archivo:", error.message);
    throw error;
  }
}

module.exports = { resume, exam, exercisebychapter,extendResume };
