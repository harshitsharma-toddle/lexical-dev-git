import theme from "../themes/baseTheme";
import { ParagraphNode, TextNode } from "lexical";
import { ColoredTextNode } from "../nodes/ColoredTextNode";
// import { CustomParagraphNode } from "../nodes/CustomParagraphNode";
import { HeadingNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { EmojiNode } from "../nodes/EmojiNode";
// import { HighlightTextNode } from "../nodes/HighlightTextNode";
import { MentionNode } from "../nodes/MentionNode";
import { ImageNode } from "../nodes/ImageNode";
import { YouTubeNode } from "../nodes/YoutubeNode";
import { AutoLinkNode, LinkNode } from "@lexical/link";

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
    ImageNode,
    YouTubeNode,
    AutoLinkNode,
    LinkNode,
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
