const utf8 = require("utf8");
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
    throw new Error(`The file ${name} is too big.`);
  }

  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(filePath)).toString("base64"),
      mimeType
    },
  };
}

async function resume(name) {
  const prompt = "Summarize this content";
  try {
    const pdf = [fileToGenerativePart(name, "application/pdf")];
    const result = await model.generateContent([prompt, ...pdf]);
    const response = await result.response;
    const text = await response.text();
    return text;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

async function extendResume(name, resume) {
  resume = utf8.decode(resume);
  const prompt = "Extend this summary: " + resume;
  try {
    const pdf = [fileToGenerativePart(name, "application/pdf")];
    const result = await model.generateContent([prompt, ...pdf]);
    const response = await result.response;
    const text = await response.text();
    return text;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

async function exam(name) {
  const prompt = "Create a multiple-choice test with 10 questions. The questions and answers should be in English, and the output should be a JSON with the following format: { \"preguntas\": [ { \"enunciado\": \"Write here the first question.\", \"respuesta1\": \"Option 1 for this question\", \"respuesta2\": \"Option 2 for this question\", \"respuesta3\": \"Option 3 for this question\", \"respuesta4\": \"Option 4 for this question\", \"solucion\": \"Number for correct answer (1, 2, 3 or 4)\" } ] }";

  try {
    const pdf = [fileToGenerativePart(name, "application/pdf")];
    const result = await model.generateContent([prompt, ...pdf]);
    const response = await result.response;
    let text = await response.text();
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text);
  }
  catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

async function exercisebychapter(name) {
  const prompt = "Give me a non-multiple-choice exercise with its answer. The question and the answer should be in English, and the output should be a JSON with the following format: (\"pregunta\": [ { \"enunciado\": \"Write the exercise here.\", \"respuesta\": \"Write the solution here\")";
  try {
    const pdf = [fileToGenerativePart(name, "application/pdf")];
    const result = await model.generateContent([prompt, ...pdf]);
    const response = await result.response;
    let text = await response.text();
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return text;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

module.exports = { resume, exam, exercisebychapter, extendResume };
