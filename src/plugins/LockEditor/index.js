import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useState } from "react";

export default function LockEditor() {
  const [editor] = useLexicalComposerContext();
  const [isEditable, setIsEditable] = useState(true);

  function onClick() {
    if (isEditable) {
      editor.setEditable(false);
      setIsEditable(false);
    } else {
      editor.setEditable(true);
      setIsEditable(true);
    }
  }

  return (
    <button className="toolbar-highlight" onClick={() => onClick()}>
      {isEditable ? "Lock " : "Unlock"} Editor
    </button>
  );
}
