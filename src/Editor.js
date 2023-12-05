import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import config from "./config";
import placeholderText from "./utils/placeholderText";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
// import OnChangePlugin from "./plugins/OnChangePlugin";
import ClearEditor from "./plugins/ClearEditor";
import HeadingPlugin from "./plugins/HeadingPlugin";
import MyListPlugin from "./plugins/MyListPlugin";
import TreeViewPlugin from "./plugins/TreeViewPlugin";
import EmojiPlugin from "./plugins/EmojiPlugin";
import RGBtoTextPlugin from "./plugins/RGBtoTextPlugin";

export default function Editor(props) {
  const { enableRichText } = props;

  return (
    <LexicalComposer initialConfig={config}>
      <HeadingPlugin />
      <ListPlugin />
      <MyListPlugin />
      <ClearEditorPlugin />
      <ClearEditor />
      {enableRichText ? (
        <>
          <RichTextPlugin
            contentEditable={<ContentEditable className="content-editable" />}
            placeholder={placeholderText}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <EmojiPlugin />
          <RGBtoTextPlugin />
        </>
      ) : (
        <PlainTextPlugin
          contentEditable={<ContentEditable className="content-editable" />}
          placeholder={placeholderText}
          ErrorBoundary={LexicalErrorBoundary}
        />
      )}
      <HistoryPlugin />
      {/* <OnChangePlugin
        onChange={(editor) => {
          console.log("EditorState", editor.editorState);
        }}
      /> */}
      <TreeViewPlugin />
    </LexicalComposer>
  );
}
