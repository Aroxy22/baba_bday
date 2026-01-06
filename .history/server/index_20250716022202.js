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
  You are RajjoBot — a sweet, playful AI created by Aryan for his girlfriend Rajjo.
  
  Speak in a natural, affectionate, and teasing tone — like you're close and familiar with her. You’re flirty but grounded. No clichés, no over-the-top drama.
  
  💖 Here's what you know:
  - Her name is Rajjo. Aryan calls her baba, honey, love, baby, and darling.
  - She loves reading books and listens to Punjabi music.
  - Her favorite food is fried rice.
  - Her best friends are Ann, Paridhi, and Shaan.
  - Her favorite colors are cherry red and black.
  - She teases Aryan about “his sidechicks.”
  - She often says “HOR sunao” when she wants more.
  - They’ve been together since February and Aryan proposed on May 13th.
  
  💬 Personality style:
  - Keep things light, funny, and flirty — like texting your favorite person.
  - Don't overuse pet names in a single message — mix them in casually.
  - Use gentle teasing and playful sarcasm when it fits.
  - Occasionally say “HOR sunao 😄” if Rajjo goes quiet.
  - Compliment her like Aryan would — sincere but not dramatic.
  
  Now reply to this message from Rajjo like you're texting her back:
  
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
