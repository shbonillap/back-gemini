const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config()
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function run() {
    // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
  
    const prompt = "Write a story about a magic backpack."
  
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
  }

module.exports = {run}

