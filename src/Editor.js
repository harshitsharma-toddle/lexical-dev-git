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
  CLEAR_EDITOR_COMMAND,
  ParagraphNode,
  TextNode,
} from "lexical";
import { $createColoredNode, ColoredNode } from "./ColoredNode";
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
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import { $createEmojiNode, EmojiNode, $isEmojiNode } from "./EmojiNode";

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

const ClearEditor = () => {
  const [editor] = useLexicalComposerContext();
  const onClick = () => {
    editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
    return;
  };
  return <button onClick={() => onClick()}>Clear Editor</button>;
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

const EmojiPlugin = () => {
  const [editor] = useLexicalComposerContext();
  // simple approach (basic)
  // const emojiTransform = (node) => {
  //   const textContent = node.getTextContent();
  //   console.log("node", node);
  //   // if (textContent === ":)") {
  //   //   node.replace($createEmojiNode("🙂"));
  //   // }
  //   // find characters inside textContent and replace just the particular target node with EmojiNode (below approach)
  // };
  const emojisMap = new Map([
    [":)", "🙂"],
    [":(", "🙁"],
    ["<3", "❤"],
    [":D", "😀"],
    [";)", "😉"],
  ]);

  function findTargetNodeAndReplace(node) {
    const text = node.getTextContent();
    for (let i = 0; i < text.length; i++) {
      // console.log("text[i]", text[i]);
      // console.log("text.slice(i, i + 2)", text.slice(i, i + 2));
      const doesEmojiDataExist =
        emojisMap.get(text[i]) || emojisMap.get(text.slice(i, i + 2));
      // console.log("emojiData", doesEmojiDataExist);
      if (doesEmojiDataExist !== undefined) {
        const [emojiText] = doesEmojiDataExist;
        let targetNode;
        if (i === 0) {
          [targetNode] = node.splitText(i + 2);
        } else {
          [, targetNode] = node.splitText(i, i + 2);
        }

        const emojiNode = $createEmojiNode(emojiText);
        targetNode.replace(emojiNode);
        return emojiNode;
      }
    }

    return null;
  }

  function transformTextNodeToEmoji(node) {
    let targetNode = node;
    // console.log("targetNode", targetNode);
    while (targetNode !== null) {
      if (
        !targetNode.isSimpleText() &&
        !($isEmojiNode(targetNode) && targetNode.getTextContent().length > 1)
      ) {
        return;
      }

      targetNode = findTargetNodeAndReplace(targetNode);
    }
  }

  useEffect(() => {
    const transformTextToEmoji = editor.registerNodeTransform(
      TextNode,
      transformTextNodeToEmoji
    );
    const transformTextInsideEmoji = editor.registerNodeTransform(
      EmojiNode,
      transformTextNodeToEmoji
    );

    return () => {
      transformTextToEmoji();
      transformTextInsideEmoji();
    };
  });
  return null;
};

const RGBtoTextPlugin = () => {
  const [editor] = useLexicalComposerContext();
  // if the typed text is red, change the text colour of this text to red
  function findTargetNodeAndReplace(node) {
    const text = node.getTextContent();
    // console.log("text", text);
    let targetNode;
    for (let i = 0; i < text.length; i++) {
      if (
        (text[i] === "r" &&
          text[i + 1] === "e" &&
          text[i + 2] === "d" &&
          text[i + 3] === " ") ||
        (text[i] === " " &&
          text[i + 1] === "r" &&
          text[i + 2] === "e" &&
          text[i + 3] === "d" &&
          text[i + 4] === " ")
      ) {
        if (text[i] === " ") {
          [, targetNode] = node.splitText(i + 1, i + 4);
          // console.log("targetNode", targetNode);
        } else [targetNode] = node.splitText(i, i + 3);
        const coloredNode = $createColoredNode("red", "red");
        targetNode.replace(coloredNode);
        return coloredNode;
      }
      if (
        (text[i] === "g" &&
          text[i + 1] === "r" &&
          text[i + 2] === "e" &&
          text[i + 3] === "e" &&
          text[i + 4] === "n" &&
          text[i + 5] === " ") ||
        (text[i] === " " &&
          text[i + 1] === "g" &&
          text[i + 2] === "r" &&
          text[i + 3] === "e" &&
          text[i + 4] === "e" &&
          text[i + 5] === "n" &&
          text[i + 6] === " ")
      ) {
        if (text[i] === " ") {
          [, targetNode] = node.splitText(i + 1, i + 6);
        } else [targetNode] = node.splitText(i, i + 5);
        const coloredNode = $createColoredNode("green", "green");
        targetNode.replace(coloredNode);
        return coloredNode;
      }
      if (
        (text[i] === "b" &&
          text[i + 1] === "l" &&
          text[i + 2] === "u" &&
          text[i + 3] === "e" &&
          text[i + 4] === " ") ||
        (text[i] === " " &&
          text[i + 1] === "b" &&
          text[i + 2] === "l" &&
          text[i + 3] === "u" &&
          text[i + 4] === "e" &&
          text[i + 5] === " ")
      ) {
        if (text[i] === " ") {
          [, targetNode] = node.splitText(i + 1, i + 5);
        } else [targetNode] = node.splitText(i, i + 4);
        const coloredNode = $createColoredNode("blue", "blue");
        targetNode.replace(coloredNode);
        return coloredNode;
      }
    }
    return null;
  }
  const transformTextNodeToRGB = (node) => {
    let targetNode = node;
    // console.log("targetNode", targetNode);
    while (targetNode !== null) {
      if (!targetNode.isSimpleText()) {
        return;
      }
      // console.log("infinite loop");
      targetNode = findTargetNodeAndReplace(targetNode);
    }
  };
  useEffect(() => {
    const transformTextToRGB = editor.registerNodeTransform(
      TextNode,
      transformTextNodeToRGB
    );
    return () => {
      transformTextToRGB();
    };
  });
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
      EmojiNode,
      ColoredNode,
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
      <MyOnChangePlugin
        onChange={(editor) => {
          // console.log("EditorState", editor.editorState);
        }}
      />
      <TreeViewPlugin />
    </LexicalComposer>
  );
}
