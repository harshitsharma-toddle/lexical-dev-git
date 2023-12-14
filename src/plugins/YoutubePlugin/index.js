import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $insertNodes,
  COMMAND_PRIORITY_EDITOR,
  ParagraphNode,
  createCommand,
} from "lexical";
import { useEffect } from "react";

import { $createYouTubeNode } from "../../nodes/YoutubeNode";

export const INSERT_YOUTUBE_COMMAND = createCommand("INSERT_YOUTUBE_COMMAND");

export default function YouTubePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      INSERT_YOUTUBE_COMMAND,
      (payload) => {
        const youTubeNode = $createYouTubeNode(payload);
        const textnode = new ParagraphNode();
        // insert youtube node inside a text node to make sure it is editable and inline .
        textnode.append(youTubeNode);
        $insertNodes([textnode, youTubeNode]);
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}
