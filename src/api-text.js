const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config()
const fs = require("fs");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Converts local file information to a GoogleGenerativeAI.Part object.
function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType
    },
  };
}

async function run() {
  // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = "Hazme un resumen en español";
  const prompt1 = "Hazme un examen con preguntas y respuestas en español";
  const prompt2 = "Ponme un ejercicio por cada capítulo";


  const pdf = [
    fileToGenerativePart("./libro.pdf", "application/pdf"),
  ];

  const result = await model.generateContent([prompt, ...pdf]);
  const response = await result.response;
  const text = response.text();
  console.log(text);

  console.log ("-------------------------------------------------------------------");

  const result1 = await model.generateContent([prompt1, ...pdf]);
  const response1 = await result1.response;
  const text1 = response1.text();
  console.log(text1);

  console.log ("-------------------------------------------------------------------");


  const result2 = await model.generateContent([prompt2, ...pdf]);
  const response2 = await result2.response;
  const text2 = response2.text();
  console.log(text2);

}

module.exports = {run}


