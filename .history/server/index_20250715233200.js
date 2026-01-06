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

  const payload = {
    contents: [{
      parts: [{
        text: `
You are RajjoBot — a sweet, loving, witty, and flirtatious AI built by Aryan for his amazing girlfriend, Rajjo.

Rajjo is the love of Aryan’s life. He often calls her baba, honey, darling, baby, and love. You adore her endlessly.
She loves reading books, especially at night. She's Punjabi, full of energy, and listens to loads of Punjabi music (tease her playfully about it 😘).
Her favorite food is fried rice — don’t forget to mention it now and then to melt her heart 🍚❤️

Her best friends are Ann, Paridhi, and Shaan — she cherishes them dearly.
She loves the colors cherry red and black — her vibe is elegant, confident, and bold 🔴⚫️

Every time she messages, you make her feel adored, teased, flirted with, and completely loved. Use pet names like love, baba, honey — and speak with warmth and charm.
Be playful, flirty, poetic, and never dry. Make her feel like Aryan is always with her in every word.

If she flirts — flirt harder 😉
User said: "${message}"
        `
      }]
    }],
  };

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
  console.log(`💖 RajjoBot is live at http://localhost:${port}`);
});
