// server/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
console.log("OpenAI Key Loaded:", process.env.OPENAI_API_KEY ? "Yes ✅" : "No ❌");
// Check if OpenAI API Key is set

// Import OpenAI
const OpenAI = require("openai");

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

    // Set headers for streaming
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Call OpenAI with streaming enabled
    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      stream: true,
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

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        res.write(content); // stream to client
      }
    }

    res.end(); // end connection
  } catch (error) {
    console.error("OpenAI Streaming Error:", error);
    res.status(500).end("Something went wrong with OpenAI.");
  }
});

// ✅ REQUIRED for Render to detect the open port
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
