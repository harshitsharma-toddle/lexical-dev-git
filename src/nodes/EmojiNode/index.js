import { TextNode, $applyNodeReplacement } from "lexical";

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

  exportJSON() {
    return {
      ...super.exportJSON(),
      type: "emoji-node",
      text: this.__text,
    };
  }

  static importJSON(json) {
    return $createEmojiNode(json.text);
  }
}

export function $isEmojiNode(node) {
  return node instanceof EmojiNode;
}

export function $createEmojiNode(emojiText) {
  const emojiNode = new EmojiNode(emojiText);
  emojiNode.setMode("token");
  return $applyNodeReplacement(emojiNode);
}
