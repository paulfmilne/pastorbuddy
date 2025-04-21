import { useState } from "react";
import "./App.css";
import logo from './assets/logo.png';

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
    <div className="App">
<img
  src={logo}
  alt="PastorBuddy Logo"
  style={{ width: "80px", height: "80px", marginBottom: "1rem" }}
/>
      <h1>PastorBuddy</h1>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask PastorBuddy for a sermon idea..."
        rows={6}
        style={{ width: "80%", margin: "1em" }}
      />
      <br />
      <button onClick={handleSubmit} disabled={isGenerating}>
        {isGenerating ? "Generating..." : "Generate Sermon"}
      </button>
      <div style={{ marginTop: "2em", whiteSpace: "pre-wrap" }}>
        <strong>Response:</strong>
        <div>{response}</div>
      </div>
    </div>
  );
}

export default App;
