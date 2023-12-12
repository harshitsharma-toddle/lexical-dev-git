import { TextNode, $applyNodeReplacement } from "lexical";
function convertEmojiElement(domNode) {
  const textContent = domNode.textContent;

  if (textContent !== null) {
    const node = $createEmojiNode(textContent);
    return {
      node,
    };
  }

  return null;
}
export class EmojiNode extends TextNode {
  static getType() {
    return "emoji-node";
  }

  static clone(node) {
    return new EmojiNode(node.__text, node.__key);
  }

  createDOM(config) {
    const dom = super.createDOM(config);
    dom.className = "emoji-inner";
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

  exportDOM() {
    const element = document.createElement("span");
    element.setAttribute("data-lexical-emoji", "true");
    element.textContent = this.__text;
    return { element };
  }

  static importDOM() {
    return {
      span: (domNode) => {
        if (!domNode.hasAttribute("data-lexical-emoji")) {
          return null;
        }
        return {
          conversion: convertEmojiElement,
          priority: 1,
        };
      },
    };
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
