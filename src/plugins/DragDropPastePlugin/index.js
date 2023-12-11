import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { DRAG_DROP_PASTE } from "@lexical/rich-text";
import {
  isMimeType,
  mediaFileReader,
  $wrapNodeInElement,
} from "@lexical/utils";
import {
  COMMAND_PRIORITY_EDITOR,
  $insertNodes,
  $isRootOrShadowRoot,
  $createParagraphNode,
  COMMAND_PRIORITY_LOW,
} from "lexical";
import { useEffect } from "react";
import { $createImageNode } from "../../nodes/ImageNode";
import { INSERT_IMAGE_COMMAND } from "../ImagePlugin";

const ACCEPTABLE_IMAGE_TYPES = [
  "image/",
  "image/heic",
  "image/heif",
  "image/gif",
  "image/webp",
];

export default function DragDropPaste() {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return (
      editor.registerCommand(
        DRAG_DROP_PASTE,
        (files) => {
          (async () => {
            const filesResult = await mediaFileReader(
              files,
              [ACCEPTABLE_IMAGE_TYPES].flatMap((x) => x)
            );
            for (const { file, result } of filesResult) {
              if (isMimeType(file, ACCEPTABLE_IMAGE_TYPES)) {
                // console.log("file", file);
                // console.log("result", result);
                editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
                  altText: file.name,
                  src: result,
                });
              }
            }
          })();
          return true;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        INSERT_IMAGE_COMMAND,
        (payload) => {
          const imageNode = $createImageNode(payload);
          $insertNodes([imageNode]);
          if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
            $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
          }

          return true;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [editor]);
  return null;
}
