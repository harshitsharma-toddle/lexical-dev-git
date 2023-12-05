import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import {
  $createEmojiNode,
  EmojiNode,
  $isEmojiNode,
} from "../../nodes/EmojiNode";
import {
  $isColoredTextNode,
  ColoredTextNode,
} from "../../nodes/ColoredTextNode";
import { transformTextNodeToRGB } from "../TextToColoredPlugin";
import { TextNode } from "lexical";

export default function EmojiPlugin() {
  const [editor] = useLexicalComposerContext();
  /* simple approach (basic)
   const emojiTransform = (node) => {
     const textContent = node.getTextContent();
     console.log("node", node);
    if (textContent === ":)") {
      node.replace($createEmojiNode("🙂"));
    }
   // find characters inside textContent and replace just the particular target node with EmojiNode (below approach)
   };
   */
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
        !($isEmojiNode(targetNode) && targetNode.getTextContent().length > 1) &&
        !(
          $isColoredTextNode(targetNode) &&
          targetNode.getTextContent().length > 1
        )
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
    const transformTextInsideEmojiNode = editor.registerNodeTransform(
      EmojiNode,
      transformTextNodeToEmoji
    );

    const transformRGBTextInsideEmojiNode = editor.registerNodeTransform(
      EmojiNode,
      transformTextNodeToRGB
    );

    const transformRGBTextInsideColoredNode = editor.registerNodeTransform(
      ColoredTextNode,
      transformTextNodeToEmoji
    );

    return () => {
      transformTextToEmoji();
      transformTextInsideEmojiNode();
      transformRGBTextInsideEmojiNode();
      transformRGBTextInsideColoredNode();
    };
  });
  return null;
}
