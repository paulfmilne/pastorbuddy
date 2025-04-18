// server/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
console.log("OpenAI Key Loaded:", process.env.OPENAI_API_KEY ? "Yes ✅" : "No ❌");
// Check if OpenAI API Key is set

// FIX: Import OpenAI correctly
const { OpenAI } = require("openai");

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5050;
app.use(cors());
app.use(express.json());

// Setup OpenAI with API Key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/sermon", async (req, res) => {
    try {
      const { prompt } = req.body;
  
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are PastorBuddy, a compassionate AI assistant helping pastors prepare inclusive, relevant, and Scripture-based sermons.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      });
  
      res.json({ message: completion.choices[0].message.content });
    } catch (error) {
      console.error("OpenAI API Error:", error);
      res.status(500).json({ message: "Something went wrong with OpenAI." });
    }
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
