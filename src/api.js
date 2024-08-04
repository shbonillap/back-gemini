const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyDeZCT88OsDonbsg6RxpNfoNxTz8LZRRg4");

async function run() {
    // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
  
    const prompt = "Write a story about a magic backpack."
  
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
  }

module.exports = {run}

