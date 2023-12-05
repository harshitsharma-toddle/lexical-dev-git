import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
export default function OnChangePlugin(props) {
  const { onChange } = props;
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener((editor) => {
      onChange(editor);
    });
  }, [onChange, editor]);
}
