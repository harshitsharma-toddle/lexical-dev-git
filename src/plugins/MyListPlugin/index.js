import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";

export default function MyListPlugin() {
  const [editor] = useLexicalComposerContext();
  const onClick = (listType) => {
    if (listType === "ol") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
      return;
    }
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  };
  return (
    <>
      {["ol", "ul"].map((listType) => (
        <button
          className="toolbar-btn"
          onClick={() => {
            onClick(listType);
          }}
          key={listType}
        >
          {listType.toUpperCase()}
        </button>
      ))}
    </>
  );
}
