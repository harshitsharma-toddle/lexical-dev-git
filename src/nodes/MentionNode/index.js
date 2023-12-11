import { $applyNodeReplacement, TextNode } from "lexical";

function convertMentionElement(domNode) {
  const textContent = domNode.textContent;

  if (textContent !== null) {
    const node = $createMentionNode(textContent);
    return {
      node,
    };
  }

  return null;
}

const mentionStyle = "background-color: blue; color: white;";
export class MentionNode extends TextNode {
  __mention;

  static getType() {
    return "mention";
  }

  static clone(node) {
    return new MentionNode(node.__mention, node.__text, node.__key);
  }
  static importJSON(json) {
    const node = $createMentionNode(json.mentionName);
    node.setTextContent(json.text);
    node.setFormat(json.format);
    node.setDetail(json.detail);
    node.setMode(json.mode);
    node.setStyle(json.style);
    return node;
  }

  constructor(mentionName, text, key) {
    super(text ?? mentionName, key);
    this.__mention = mentionName;
  }

  exportJSON() {
    return {
      ...super.exportJSON(),
      mentionName: this.__mention,
      type: "mention",
    };
  }

  createDOM(config) {
    const dom = super.createDOM(config);
    dom.style.cssText = mentionStyle;
    dom.className = "mention";
    return dom;
  }

  exportDOM() {
    const element = document.createElement("span");
    element.setAttribute("data-lexical-mention", "true");
    element.textContent = this.__text;
    return { element };
  }

  static importDOM() {
    return {
      span: (domNode) => {
        if (!domNode.hasAttribute("data-lexical-mention")) {
          return null;
        }
        return {
          conversion: convertMentionElement,
          priority: 1,
        };
      },
    };
  }

  isTextEntity() {
    return true;
  }

  canInsertTextBefore() {
    return false;
  }

  canInsertTextAfter() {
    return false;
  }
}

export function $createMentionNode(mentionName) {
  const mentionNode = new MentionNode(mentionName);
  mentionNode.setMode("token");
  return $applyNodeReplacement(mentionNode);
}

export function $isMentionNode(node) {
  return node instanceof MentionNode;
}
