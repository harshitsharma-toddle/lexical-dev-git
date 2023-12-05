import {
  $isColoredTextNode,
  $createColoredTextNode,
  ColoredTextNode,
} from "../../nodes/ColoredTextNode";
import { $isEmojiNode } from "../../nodes/EmojiNode";
import { useEffect } from "react";
import { TextNode } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

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
      const coloredNode = $createColoredTextNode("red", "red");
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
      const coloredNode = $createColoredTextNode("green", "green");
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
      const coloredNode = $createColoredTextNode("blue", "blue");
      targetNode.replace(coloredNode);
      return coloredNode;
    }
  }
  return null;
}
export const transformTextNodeToRGB = (node) => {
  let targetNode = node;
  // console.log("targetNode", targetNode);
  while (targetNode !== null) {
    if (
      !targetNode.isSimpleText() &&
      !($isEmojiNode(targetNode) && targetNode.getTextContent().length > 1) &&
      !(
        $isColoredTextNode(targetNode) && targetNode.getTextContent().length > 1
      )
    ) {
      return;
    }
    // console.log("infinite loop");
    targetNode = findTargetNodeAndReplace(targetNode);
  }
};

export default function RGBtoTextPlugin() {
  const [editor] = useLexicalComposerContext();
  // if the typed text is red, change the text colour of this text to red

  useEffect(() => {
    const transformTextToRGB = editor.registerNodeTransform(
      TextNode,
      transformTextNodeToRGB
    );
    const transformTextInsideColoredNode = editor.registerNodeTransform(
      ColoredTextNode,
      transformTextNodeToRGB
    );
    return () => {
      transformTextToRGB();
      transformTextInsideColoredNode();
    };
  });
}
