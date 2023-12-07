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
import TextToColoredPlugin from "./plugins/TextToColoredPlugin";
import HighlightPlugin from "./plugins/HighlightPlugin";
import LockEditor from "./plugins/LockEditor";
import MentionsPlugin from "./plugins/MentionsPlugin";

export default function Editor(props) {
  const { enableRichText } = props;

  return (
    <LexicalComposer initialConfig={config}>
      <HeadingPlugin />
      <ListPlugin />
      <MyListPlugin />
      <HighlightPlugin />
      <ClearEditorPlugin />
      <ClearEditor />
      <LockEditor />
      {enableRichText ? (
        <>
          <RichTextPlugin
            contentEditable={<ContentEditable className="content-editable" />}
            placeholder={placeholderText}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <EmojiPlugin />
          <TextToColoredPlugin />
          <MentionsPlugin />
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
