import { BlockWithAlignableContents } from "@lexical/react/LexicalBlockWithAlignableContents";
import {
  DecoratorNode,
  $isNodeSelection,
  $getNodeByKey,
  $getSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
} from "lexical";
import * as React from "react";
import VimeoResizer from "./VimeoResizer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { mergeRegister } from "@lexical/utils";
import "./VimeoNode.css";

function VimeoComponent({ className, format, nodeKey, videoID }) {
  const vimeoRef = React.useRef(null);
  const [editor] = useLexicalComposerContext();
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey);
  const [isResizing, setIsResizing] = React.useState(false);
  const [selection, setSelection] = React.useState(null);
  const onResizeEnd = (nextWidth, nextHeight) => {
    // Delay hiding the resize bars for click case
    setTimeout(() => {
      setIsResizing(false);
    }, 200);

    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isVimeoNode(node)) {
        node.setWidthAndHeight(nextWidth, nextHeight);
      }
    });
  };

  const onClick = React.useCallback(
    (payload) => {
      const event = payload;

      if (isResizing) {
        return true;
      }
      if (event.target === vimeoRef.current) {
        if (event.shiftKey) {
          setSelected(!isSelected);
        } else {
          clearSelection();
          setSelected(true);
        }
        return true;
      }

      return false;
    },
    [isResizing, isSelected, setSelected, clearSelection]
  );

  React.useEffect(() => {
    let isMounted = true;
    const unregister = mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        if (isMounted) {
          setSelection(editorState.read(() => $getSelection()));
        }
      }),

      editor.registerCommand(CLICK_COMMAND, onClick, COMMAND_PRIORITY_LOW)
    );

    return () => {
      isMounted = false;
      unregister();
    };
  }, [editor, onClick]);

  const onResizeStart = () => {
    setIsResizing(true);
  };
  const isFocused = isSelected || isResizing;
  return (
    <BlockWithAlignableContents
      className={className}
      format={format}
      nodeKey={nodeKey}
    >
      <iframe
        ref={vimeoRef}
        width="560"
        height="315"
        src={`https://player.vimeo.com/video/${videoID.id}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        title="vimeo video"
        allowFullScreen
      />
      {$isNodeSelection(selection) && isFocused && (
        <VimeoResizer
          editor={editor}
          vimeoRef={vimeoRef}
          // maxWidth={maxWidth}
          onResizeStart={onResizeStart}
          onResizeEnd={onResizeEnd}
        />
      )}
    </BlockWithAlignableContents>
  );
}

function convertVimeoElement(domNode) {
  const videoID = domNode.getAttribute("data-lexical-vimeo");
  if (videoID) {
    const node = $createVimeoNode(videoID);
    return { node };
  }
  return null;
}

export class VimeoNode extends DecoratorNode {
  __id;

  static getType() {
    return "vimeo";
  }

  static clone(node) {
    return new VimeoNode(node.__id, node.__format, node.__key);
  }

  createDOM() {
    const element = document.createElement("span");
    return element;
  }

  /*
  POC around making this Decorator node editable but found out later that it's not possible since Decorator nodes are always uneditable.
  createDOM() {
    const element = document.createElement("span");
    element.setAttribute("contenteditable", "true");
    return element;
  }
  */

  isInline() {
    return true;
  }

  static importJSON(serializedNode) {
    const node = $createVimeoNode(serializedNode.videoID);
    return node;
  }

  exportJSON() {
    return {
      type: "vimeo",
      version: 1,
      videoID: this.__id,
    };
  }

  setWidthAndHeight(width, height) {
    const writable = this.getWritable();
    writable.__width = width;
    writable.__height = height;
  }

  constructor(id, format, key) {
    super(format, key);
    this.__id = id;
  }

  exportDOM() {
    const element = document.createElement("iframe");
    element.setAttribute("data-lexical-vimeo", this.__id);
    element.setAttribute("src", `https://player.vimeo.com/video/${this.__id}`);
    element.setAttribute("width", "560");
    element.setAttribute("height", "315");
    element.setAttribute("frameborder", "0");
    element.setAttribute(
      "allow",
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    );
    element.setAttribute("allowfullscreen", "true");
    element.setAttribute("title", "Video");
    return { element };
  }

  static importDOM() {
    return {
      iframe: (domNode) => {
        if (!domNode.hasAttribute("data-lexical-vimeo")) {
          return null;
        }
        return {
          conversion: convertVimeoElement,
          priority: 1,
        };
      },
    };
  }

  updateDOM() {
    return false;
  }

  getId() {
    return this.__id;
  }

  getTextContent(_includeInert, _includeDirectionless) {
    return `https://www.vimeo.com/${this.__id}`;
  }

  decorate(_editor, config) {
    const embedBlockTheme = config.theme.embedBlock || {};
    const className = {
      base: embedBlockTheme.base || "",
      focus: embedBlockTheme.focus || "",
    };
    return (
      <VimeoComponent
        className={className}
        format={this.__format}
        nodeKey={this.getKey()}
        videoID={this.__id}
      />
    );
  }
}

export function $createVimeoNode(videoID) {
  return new VimeoNode(videoID);
}

export function $isVimeoNode(node) {
  return node instanceof VimeoNode;
}
