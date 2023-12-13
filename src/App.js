import "./App.css";
import Editor from "./Editor";
/*
const parser = new DOMParser();
const dom = parser.parseFromString(
  `
  <div>
  <span data-lexical-colored="true" style="color:pink">black</span>
  </div>
  <div>
  <span data-lexical-mention="true">Rahul Sharma</span>
  </div>
  `,
  "text/html"
);
*/
function App() {
  return (
    <div className="app-wrapper">
      <h1 style={{ textAlign: "center", margin: "8px" }}>
        Lexical Dev [Study]
      </h1>
      <div className="editor-wrapper">
        <Editor enableRichText />
      </div>
    </div>
  );
}

export default App;
