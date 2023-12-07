import theme from "../themes/baseTheme";
import { ParagraphNode, TextNode } from "lexical";
import { ColoredTextNode } from "../nodes/ColoredTextNode";
// import { CustomParagraphNode } from "../nodes/CustomParagraphNode";
import { HeadingNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { EmojiNode } from "../nodes/EmojiNode";
// import { HighlightTextNode } from "../nodes/HighlightTextNode";
import { MentionNode } from "../nodes/MentionNode";

const config = {
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
    ColoredTextNode,
    MentionNode,
    // HighlightTextNode,
    // CustomParagraphNode,
    /*{
        replace: ParagraphNode,
        with: (node) => {
          return new CustomParagraphNode();
        },
      },
      */
  ],
};

export default config;
