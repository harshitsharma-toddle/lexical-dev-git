import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $insertNodes,
  COMMAND_PRIORITY_EDITOR,
  ParagraphNode,
  createCommand,
} from "lexical";
import { useEffect } from "react";

import { $createVimeoNode } from "../../nodes/VimeoNode";

export const INSERT_VIMEO_COMMAND = createCommand("INSERT_VIMEO_COMMAND");

export default function YouTubePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      INSERT_VIMEO_COMMAND,
      (payload) => {
        const vimeoNode = $createVimeoNode(payload);
        const textnode = new ParagraphNode();
        // insert vimeo node inside a text node to make sure it is editable and inline .
        textnode.append(vimeoNode);
        $insertNodes([textnode, vimeoNode]);
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}
