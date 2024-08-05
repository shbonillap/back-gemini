const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config()
const fs = require("fs");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


// Converts local file information to a GoogleGenerativeAI.Part object.
function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType
    },
  };
}

async function resume(name){
    const prompt = "Hazme un resumen en español";
    const pdf = [
        fileToGenerativePart("./uploads/"+name, "application/pdf"),
      ];
      const result = await model.generateContent([prompt, ...pdf]);
      const response = await result.response;
      const text = response.text();
      console.log(text);
      return text
}

async function exam(name){
    const prompt = "Hazme un examen con preguntas y respuestas en español";
    const pdf = [
        fileToGenerativePart("./uploads/"+name, "application/pdf"),
      ];
      const result = await model.generateContent([prompt, ...pdf]);
      const response = await result.response;
      const text = response.text();
      console.log(text);
      return text
}

async function exercisebychapter(name){
    const prompt = "Ponme un ejercicio por cada capítulo";
    const pdf = [
        fileToGenerativePart("./uploads/"+name, "application/pdf"),
      ];
      const result = await model.generateContent([prompt, ...pdf]);
      const response = await result.response;
      const text = response.text();
      console.log(text);
      return text
}


module.exports = {resume, exam,exercisebychapter}


