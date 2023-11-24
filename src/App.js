import "./App.css";
import Editor from "./Editor";

function App() {
  return (
    <div className="app-wrapper">
      <h1 style={{ textAlign: "center", margin: "8px" }}>
        Lexical Dev [Study]
      </h1>
      <div className="editor-wrapper">
        <Editor />
      </div>
    </div>
  );
}

export default App;
