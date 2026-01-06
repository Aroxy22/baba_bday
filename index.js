const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Chat endpoint removed - chatbot feature no longer needed

app.listen(port, () => {
  console.log(`🎂 Birthday website is live at http://localhost:${port}`);
});
