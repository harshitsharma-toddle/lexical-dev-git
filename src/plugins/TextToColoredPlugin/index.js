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
  const coloredTextValues = ["red", "green", "blue"];

  for (const color of coloredTextValues) {
    const words = node.getTextContent().split(" ");

    for (let i = 0; i < words.length - 1; i++) {
      if (words[i] === color && words[i + 1] === "") {
        let targetNode;

        if (i === 0) {
          [targetNode] = node.splitText(0, color.length);
        } else {
          const countChars = words
            .slice(0, i)
            .reduce((sum, word) => sum + word.length + 1, 0);
          [, targetNode] = node.splitText(
            countChars,
            countChars + color.length
          );
        }

        const coloredNode = $createColoredTextNode(color, color);
        targetNode.replace(coloredNode);
        return coloredNode;
      }
    }
  }

  /*
  refined approach (to be refactored)
  const text = node.getTextContent();
  // console.log("text", text);
  let targetNode;
  let words = text.split(" ");
  // console.log("words", words); // ["hello","red",""]
  for (let i = 0; i < words.length; i++) {
    if (words[i] === "red" && words[i + 1] === "") {
      if (i === 0) {
        [targetNode] = node.splitText(0, 3);
      } else {
        let countChars = 0;
        for (let j = 0; j < i; j++) {
          countChars += words[j].length + 1;
        }
        // console.log("countChars", countChars);
        [, targetNode] = node.splitText(countChars, countChars + 3);
      }
      const coloredNode = $createColoredTextNode("red", "red");
      targetNode.replace(coloredNode);
      return coloredNode;
    }
  }
  */
  /*
    basic approach (unrefactored code) 
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
  */
  return null;
}
export const transformTextNodeToRGB = (node) => {
  let targetNode = node;
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
    targetNode = findTargetNodeAndReplace(targetNode);
  }
};

export default function TextToColoredPlugin() {
  const [editor] = useLexicalComposerContext();
  // if the typed text is red, green or blue change the font colour of this text to red, green or blue respectively

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
