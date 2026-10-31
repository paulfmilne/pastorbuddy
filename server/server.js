const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not configured.");
  process.exit(1);
}

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5050;
const MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ status: "ok", service: "pastorbuddy-api" });
});

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = gemini.getGenerativeModel({ model: MODEL });
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const generateContentStreamWithRetry = async (contents) => {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await model.generateContentStream({ contents });
    } catch (error) {
      const isTemporaryError = error?.status === 429 || error?.status === 503;
      if (!isTemporaryError || attempt === 2) {
        throw error;
      }
      await wait(1000 * (attempt + 1));
    }
  }
};

app.post("/api/sermon", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ error: "A non-empty prompt is required." });
    }

    // Set headers for streaming
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const contents = [
      {
        role: "user",
        parts: [
          {
            text: `You are PastorBuddy, a compassionate AI assistant helping pastors prepare inclusive, relevant, and Scripture-based sermons.\n\n${prompt}`,
          },
        ],
      },
    ];
    const result = await generateContentStreamWithRetry(contents);

    for await (const chunk of result.stream) {
      const content = chunk.text();
      if (content) {
        res.write(content);
      }
    }

    res.end(); // end connection
  } catch (error) {
    console.error("Gemini Streaming Error:", error);
    if (res.headersSent) {
      res.end();
    } else {
      const status = error?.status === 429 || error?.status === 503 ? 503 : 500;
      res.status(status).json({
        error:
          status === 503
            ? "Gemini is temporarily unavailable. Please try again shortly."
            : "Unable to generate a sermon.",
      });
    }
  }
});

// ✅ REQUIRED for Render to detect the open port
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
