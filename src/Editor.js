import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { TreeView } from "@lexical/react/LexicalTreeView";
import theme from "./theme";
import { useEffect } from "react";

const MyOnChangePlugin = (props) => {
  const { onChange } = props;
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerUpdateListener((editor) => {
      onChange(editor);
    });
  }, [onChange, editor]);
};

const TreeViewPlugin = () => {
  const [editor] = useLexicalComposerContext();
  return (
    <TreeView
      viewClassName="tree-view-output"
      timeTravelPanelClassName="debug-timetravel-panel"
      timeTravelButtonClassName="debug-timetravel-button"
      timeTravelPanelSliderClassName="debug-timetravel-panel-slider"
      timeTravelPanelButtonClassName="debug-timetravel-panel-button"
      editor={editor}
    />
  );
};

export default function Editor() {
  const initialConfig = {
    namespace: "lexical-dev-editor",
    theme: theme,
  };

  const placeholderText = () => {
    return <div className="placeholder-text">Enter some text...</div>;
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <PlainTextPlugin
        contentEditable={<ContentEditable className="content-editable" />}
        placeholder={placeholderText}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      <MyOnChangePlugin
        onChange={(editor) => {
          console.log("EditorState", editor.editorState);
        }}
      />
      <TreeViewPlugin />
    </LexicalComposer>
  );
}
