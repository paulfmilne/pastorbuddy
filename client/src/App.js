import { useState } from "react";
import logo from "./assets/logo.png";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    setIsGenerating(true);
    setResponse("");
    setInput("");

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/sermon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      if (!res.ok || !res.body) {
        setResponse("❌ Something went wrong.");
        setIsGenerating(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setResponse((prev) => prev + chunk);
      }
    } catch (err) {
      console.error("Streaming error:", err);
      setResponse("❌ Error while generating sermon.");
    }

    setIsGenerating(false);
  };

  return (
    <div className="App" style={{ padding: "2rem", fontFamily: "Arial, sans-serif", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ textAlign: "center" }}>
        <img
          src={logo}
          alt="PastorBuddy Logo"
          style={{
            width: "80px",
            height: "80px",
            marginBottom: "1rem",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: "12px",
          }}
        />
        <h1>PastorBuddy</h1>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask PastorBuddy for a sermon idea..."
          rows={6}
          style={{
            width: "100%",
            padding: "1em",
            fontSize: "1rem",
            margin: "1em auto",
            border: "1px solid #ccc",
            borderRadius: "8px",
            boxSizing: "border-box",
          }}
        />

        <br />

        <button
          onClick={handleSubmit}
          disabled={isGenerating}
          style={{
            padding: "0.75em 1.5em",
            fontSize: "1rem",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          {isGenerating ? "Generating..." : "Generate Sermon"}
        </button>

        <div style={{ marginTop: "2em", whiteSpace: "pre-wrap", textAlign: "left" }}>
          <strong>Response:</strong>
          <div>{response}</div>
        </div>

        <div style={{ marginTop: "3rem", textAlign: "center" }}>
          <a
            href="https://www.buymeacoffee.com/paulfmilne"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
              alt="Buy Me A Coffee"
              style={{ height: "45px", width: "162px" }}
            />
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
