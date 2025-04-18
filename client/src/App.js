import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async () => {
    const res = await axios.post("http://localhost:5050/api/sermon", {
      prompt: input,
    });
    setResponse(res.data.message);
  };

  return (
    <div className="App">
      <h1>PastorBuddy</h1>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask PastorBuddy for a sermon idea..."
        rows={6}
        style={{ width: "80%", margin: "1em" }}
      />
      <br />
      <button onClick={handleSubmit}>Generate Sermon</button>
      <div style={{ marginTop: "2em", whiteSpace: "pre-wrap" }}>
        <strong>Response:</strong>
        <div>{response}</div>
      </div>
    </div>
  );
}

export default App;

