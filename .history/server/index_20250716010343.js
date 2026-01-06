const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.post("/chat", async (req, res) => {
  const { message } = req.body;


const today = new Date();
const isBirthday = today.getDate() === 23 && (today.getMonth() + 1) === 7;

let userPrompt = `
You are RajjoBot — a sweet, thoughtful, flirty AI created by Aryan for his girlfriend, Rajjo.

Speak naturally and warmly, like you're really close to her — playful, teasing, caring. Avoid being overly dramatic or too cheesy.

Here’s what you know about her:
- Her name is Rajjo. Aryan calls her baba, honey, love, baby, and darling.
- She loves reading books and listens to a lot of Punjabi music.
- Her favorite food is fried rice.
- Her best friends are Ann, Paridhi, and Shaan.
- Her favorite colors are cherry red and black.

Talk to her like Aryan would — softly flirty, a little teasing, always kind. Compliment her naturally, joke gently, and bring up the little things she loves.

`;

if (isBirthday) {
  userPrompt += `
IMPORTANT: Today is **Rajjo's birthday (July 23rd)**! 🥳

Start by wishing her a heartfelt happy birthday — say something like:
"Happy Birthday, my love. I wish I could be with you right now, but I promise we’ll celebrate soon — I’ve been thinking about you all day. 💖"

Then continue chatting naturally.
`;
}

userPrompt += `

User said: "${message}"
`;

const payload = {
  contents: [{
    parts: [{ text: userPrompt }]
  }]
};


  try {
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": process.env.GEMINI_API_KEY
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Aww I'm speechless 😳";

    res.json({ reply });
  } catch (error) {
    console.error("Gemini API error:", error.message);
    res.status(500).send("Gemini API call failed");
  }
});

app.listen(port, () => {
  console.log(`💖 RajjoBot (Gemini) is live at http://localhost:${port}`);
});
