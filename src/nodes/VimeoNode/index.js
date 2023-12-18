import { BlockWithAlignableContents } from "@lexical/react/LexicalBlockWithAlignableContents";
import { DecoratorNode } from "lexical";
import * as React from "react";

function VimeoComponent({ className, format, nodeKey, videoID }) {
  console.log("id", videoID);
  return (
    <BlockWithAlignableContents
      className={className}
      format={format}
      nodeKey={nodeKey}
    >
      <iframe
        width="560"
        height="315"
        src={`https://player.vimeo.com/video/${videoID.id}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        title="vimeo video"
        allowFullScreen
      />
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
    node.setFormat(serializedNode.format);
    return node;
  }

  exportJSON() {
    return {
      ...super.exportJSON(),
      type: "vimeo",
      version: 1,
      videoID: this.__id,
    };
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
    return `https://www.youtube.com/watch?v=${this.__id}`;
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

export function $isYouTubeNode(node) {
  return node instanceof VimeoNode;
}
