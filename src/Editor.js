import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { TreeView } from "@lexical/react/LexicalTreeView";
import {
  // $createTextNode,
  // $getRoot,
  $getSelection,
  $isRangeSelection,
  ParagraphNode,
  TextNode,
} from "lexical";
// import { $createColoredNode, ColoredNode } from "./ColoredNode";
// import { CustomParagraphNode } from "./CustomParagraphNode";
import { HeadingNode, $createHeadingNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import {
  ListNode,
  ListItemNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";

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

const HeadingPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const onClick = (tag) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(tag));
      }
    });
  };
  return ["h1", "h2", "h3", "h4", "h5", "h6"].map((tag) => (
    <button onClick={() => onClick(tag)} key={tag}>
      {tag}
    </button>
  ));
};

const MyListPlugin = () => {
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
          onClick={() => {
            onClick(listType);
          }}
          key={listType}
        >
          {listType}
        </button>
      ))}
    </>
  );
};

export default function Editor(props) {
  const { enableRichText } = props;
  const initialConfig = {
    namespace: "lexical-dev-editor",
    theme: theme,
    onError(error) {
      throw error;
    },
    nodes: [
      TextNode,
      ParagraphNode,
      HeadingNode,
      ListNode,
      ListItemNode,
      // ColoredNode,
      // CustomParagraphNode,
      /*
      {
        replace: TextNode,
        with: (node) => {
          return $createColoredNode(node.__text, "red");
        },
      },
      */
      /*{
        replace: ParagraphNode,
        with: (node) => {
          return new CustomParagraphNode();
        },
      },
      */
    ],
  };

  const placeholderText = () => {
    return <div className="placeholder-text">Enter some text...</div>;
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <HeadingPlugin />
      <ListPlugin />
      <MyListPlugin />
      {enableRichText ? (
        <RichTextPlugin
          contentEditable={<ContentEditable className="content-editable" />}
          placeholder={placeholderText}
          ErrorBoundary={LexicalErrorBoundary}
        />
      ) : (
        <PlainTextPlugin
          contentEditable={<ContentEditable className="content-editable" />}
          placeholder={placeholderText}
          ErrorBoundary={LexicalErrorBoundary}
        />
      )}
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
