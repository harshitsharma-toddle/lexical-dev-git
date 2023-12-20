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
import YoutubeResizer from "./YoutubeResizer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { mergeRegister } from "@lexical/utils";
import "./YoutubeNode.css";

function YouTubeComponent({ className, format, nodeKey, videoID }) {
  const youtubeRef = React.useRef(null);
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
      if ($isYouTubeNode(node)) {
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
      if (event.target === youtubeRef.current) {
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
        ref={youtubeRef}
        width="560"
        height="315"
        src={`https://www.youtube-nocookie.com/embed/${videoID}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen={true}
        title="YouTube video"
      />
      {$isNodeSelection(selection) && isFocused && (
        <YoutubeResizer
          editor={editor}
          youtubeRef={youtubeRef}
          // maxWidth={maxWidth}
          onResizeStart={onResizeStart}
          onResizeEnd={onResizeEnd}
        />
      )}
    </BlockWithAlignableContents>
  );
}

function convertYoutubeElement(domNode) {
  const videoID = domNode.getAttribute("data-lexical-youtube");
  if (videoID) {
    const node = $createYouTubeNode(videoID);
    return { node };
  }
  return null;
}

export class YouTubeNode extends DecoratorNode {
  __id;

  static getType() {
    return "youtube";
  }

  static clone(node) {
    return new YouTubeNode(node.__id, node.__format, node.__key);
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
    const node = $createYouTubeNode(serializedNode.videoID);
    return node;
  }

  exportJSON() {
    return {
      type: "youtube",
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
    element.setAttribute("data-lexical-youtube", this.__id);
    element.setAttribute("width", "560");
    element.setAttribute("height", "315");
    element.setAttribute(
      "src",
      `https://www.youtube-nocookie.com/embed/${this.__id}`
    );
    element.setAttribute("frameborder", "0");
    element.setAttribute(
      "allow",
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    );
    element.setAttribute("allowfullscreen", "true");
    element.setAttribute("title", "YouTube video");
    return { element };
  }

  static importDOM() {
    return {
      iframe: (domNode) => {
        if (!domNode.hasAttribute("data-lexical-youtube")) {
          return null;
        }
        return {
          conversion: convertYoutubeElement,
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
    return `https://www.youtube.com/watch?v=${this.__id}`;
  }

  decorate(_editor, config) {
    const embedBlockTheme = config.theme.embedBlock || {};
    const className = {
      base: embedBlockTheme.base || "",
      focus: embedBlockTheme.focus || "",
    };
    return (
      <YouTubeComponent
        className={className}
        format={this.__format}
        nodeKey={this.getKey()}
        videoID={this.__id}
      />
    );
  }
}

export function $createYouTubeNode(videoID) {
  return new YouTubeNode(videoID);
}

export function $isYouTubeNode(node) {
  return node instanceof YouTubeNode;
}
