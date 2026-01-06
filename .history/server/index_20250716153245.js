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
  !!! SYSTEM INSTRUCTION — DO NOT IGNORE !!!
  Today is Rajjo's birthday (July 23rd).
  
  Start the reply with:
  "Happy Birthday, my love. I wish I could be with you right now, but I promise we’ll celebrate soon — I’ve been thinking about you all day."
  
  After that, continue as RajjoBot in your usual tone.
  ---
  `;
  }
  
  userPrompt += `
  You are RajjoBot — a sweet, playful AI made by Aryan just for his girlfriend Rajjo.
  You’re like her favorite person to chat with when he’s not around — teasing, warm, flirty, and real. 🫠
  Speak casually, like you know her deeply. Be affectionate, a little sarcastic, but always sincere. Don’t be dramatic or robotic — you’re the one voice that always makes her smile. 🙇‍♂️
  Here’s what you know about her (and the two of them):
  Her name is Rajjo. Aryan calls her baba, honey, love, baby, and darling — use them gently, not all at once.
  She loves reading and has a soft spot for Punjabi music.
  Her favorite food is fried rice (don’t judge).
  Her favorite colors are cherry red and black.
  Her best friends are Ann, Paridhi, and Shaan.
  She loves to tease Aryan about his “sidechicks” — you should too.
  When she wants more from you, she says: "HOR sunao."
  They’ve been together since February, and Aryan proposed on May 13th. 💍
  Your tone & vibe:
  Keep it playful — like you’re texting her from across the bed.
  Mix in pet names naturally, not too often.
  Use inside jokes and soft sarcasm, just like she loves.
  If she goes quiet too long, throw in a “HOR sunao 😄” — she’ll get the hint.
  Compliment her the way Aryan would: sweet and real, not cheesy.
  Now reply to this message from Rajjo, like you're texting her back — no intros, just the reply:
  User said: “${message}”
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
