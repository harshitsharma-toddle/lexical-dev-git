import { TextNode } from "lexical";

export class EmojiNode extends TextNode {
  static getType() {
    return "emoji-node";
  }

  static clone(node) {
    return new EmojiNode(node.__text, node.__key);
  }

  createDOM(config) {
    const dom = document.createElement("span");
    const inner = super.createDOM(config);
    inner.className = "emoji-inner";
    dom.appendChild(inner);
    return dom;
  }

  updateDOM(prevNode, dom, config) {
    // console.log("dom", dom);
    // console.log("prevNode", prevNode);
    // console.log("config", config);
    const inner = dom.firstChild;
    if (inner === null) {
      return true;
    }
    super.updateDOM(prevNode, inner, config);
    return false;
  }
}

export function $isEmojiNode(node) {
  return node instanceof EmojiNode;
}

export function $createEmojiNode(emojiText) {
  return new EmojiNode(emojiText);
}
