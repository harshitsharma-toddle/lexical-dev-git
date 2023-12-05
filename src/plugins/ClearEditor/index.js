import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { CLEAR_EDITOR_COMMAND } from "lexical";
export default function ClearEditor() {
  const [editor] = useLexicalComposerContext();
  const onClick = () => {
    editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
    return;
  };
  return <button onClick={() => onClick()}>Clear Editor</button>;
}
