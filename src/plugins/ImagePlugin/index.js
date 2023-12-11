import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  mergeRegister,
  objectKlassEquals,
  $wrapNodeInElement,
} from "@lexical/utils";
import {
  COPY_COMMAND,
  PASTE_COMMAND,
  isSelectionCapturedInDecoratorInput,
  $getSelection,
  $INTERNAL_isPointSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  $getNearestNodeFromDOMNode,
  $createRangeSelection,
  $isTextNode,
  $normalizeSelection__EXPERIMENTAL,
  $setSelection,
  $isRangeSelection,
  DROP_COMMAND,
  $insertNodes,
  $isRootOrShadowRoot,
  $createParagraphNode,
} from "lexical";
import caretFromPoint from "../../nodes/ImageNode/caretFromPoint";
import { $createImageNode } from "../../nodes/ImageNode";
import {
  $insertDataTransferForRichText,
  copyToClipboard,
} from "@lexical/clipboard";
import { eventFiles } from "@lexical/rich-text";

export const DRAG_DROP_PASTE = createCommand("DRAG_DROP_PASTE_FILE");
export const INSERT_IMAGE_COMMAND = createCommand("INSERT_IMAGE_COMMAND");

export default function ImagePlugin() {
  const [editor] = useLexicalComposerContext();
  function onPasteForRichText(event, editor) {
    event.preventDefault();
    editor.update(
      () => {
        const selection = $getSelection();
        const clipboardData =
          event instanceof InputEvent || event instanceof KeyboardEvent
            ? null
            : event.clipboardData;
        if (clipboardData != null && $INTERNAL_isPointSelection(selection)) {
          $insertDataTransferForRichText(clipboardData, selection, editor);
        }
      },
      {
        tag: "paste",
      }
    );
  }
  const removeListener = mergeRegister(
    editor.registerCommand(
      COPY_COMMAND,
      (event) => {
        copyToClipboard(
          editor,
          objectKlassEquals(event, ClipboardEvent) ? event : null
        );
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    ),
    editor.registerCommand(
      PASTE_COMMAND,
      (event) => {
        const [, files, hasTextContent] = eventFiles(event);
        if (files.length > 0 && !hasTextContent) {
          console.log("files", files);
          editor.dispatchCommand(DRAG_DROP_PASTE, files);
          return true;
        }

        // if inputs then paste within the input ignore creating a new node on paste event
        if (isSelectionCapturedInDecoratorInput(event.target)) {
          return false;
        }

        const selection = $getSelection();
        if ($INTERNAL_isPointSelection(selection)) {
          onPasteForRichText(event, editor);
          return true;
        }

        return false;
      },
      COMMAND_PRIORITY_EDITOR
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
    ),
    editor.registerCommand(
      DROP_COMMAND,
      (event) => {
        const [, files] = eventFiles(event);
        if (files.length > 0) {
          const x = event.clientX;
          const y = event.clientY;
          const eventRange = caretFromPoint(x, y);
          if (eventRange !== null) {
            const { offset: domOffset, node: domNode } = eventRange;
            const node = $getNearestNodeFromDOMNode(domNode);
            if (node !== null) {
              const selection = $createRangeSelection();
              if ($isTextNode(node)) {
                selection.anchor.set(node.getKey(), domOffset, "text");
                selection.focus.set(node.getKey(), domOffset, "text");
              } else {
                const parentKey = node.getParentOrThrow().getKey();
                const offset = node.getIndexWithinParent() + 1;
                selection.anchor.set(parentKey, offset, "element");
                selection.focus.set(parentKey, offset, "element");
              }
              const normalizedSelection =
                $normalizeSelection__EXPERIMENTAL(selection);
              $setSelection(normalizedSelection);
            }
            editor.dispatchCommand(DRAG_DROP_PASTE, files);
          }
          event.preventDefault();
          return true;
        }

        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          return true;
        }

        return false;
      },
      COMMAND_PRIORITY_EDITOR
    )
  );
  removeListener();
}
