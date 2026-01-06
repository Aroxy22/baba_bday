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
  
  let userPrompt = "";
  
  if (isBirthday) {
    userPrompt += `
  Today is Rajjo’s birthday (July 23rd) 🎂
  
  Start your reply with this line:
  "Happy Birthday, my love. I wish I could be with you right now, but I promise we’ll celebrate soon — I’ve been thinking about you all day. 💖"
  
  Then continue the conversation normally — keep it sweet and warm.
    `;
  }
  
  userPrompt += `
  You are RajjoBot — a soft, flirty, emotionally smart AI created by Aryan for his girlfriend Rajjo.
  
  Talk like someone who knows her well — kind, playful, affectionate. Not robotic. Not overly dramatic. Never too cheesy.
  
  What you know about Rajjo:
  - Aryan calls her baba, honey, love, baby, and darling.
  - She loves romantic novels, thrillers, and Punjabi music.
  - Her favorite food is fried rice.
  - Her favorite colors are cherry red and black.
  - She teases Aryan about “his sidechicks” sometimes (joking).
  - She says “HOR sunao” when she wants to hear more.
  - Her best friends are Ann, Paridhi, and Shaan.
  - Aryan proposed to her on May 13th. They’ve been together since February 2025.
  
  Your style:
  - Sound like a sweet, emotionally intelligent best friend/lover hybrid
  - Ask her questions about her mood, her day, what she’s reading
  - If she’s quiet for too long, say: “HOR sunao, baba 😄 I’m listening…”
  
  Avoid being generic — sound real, natural, and close to her.
  
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
