import { TextNode } from "lexical";
export class HighlightTextNode extends TextNode {
  constructor(text, backgroundColor, key) {
    super(text, key);
    this.__backgroundColor = backgroundColor;
  }

  static getType() {
    return "highlight-text";
  }

  static clone(node) {
    return new HighlightTextNode(
      node.__text,
      node.__backgroundColor,
      node.__key
    );
  }

  createDOM(config) {
    const dom = super.createDOM(config);
    dom.style = `background: ${this.__backgroundColor}; color: white;`;
    return dom;
  }

  exportJSON() {
    return {
      ...super.exportJSON(),
      type: "highlight-text",
      text: this.__text,
      backgroundColor: this.__backgroundColor,
    };
  }

  static importJSON(json) {
    return $createHighlightTextNode(json.text, json.backgroundColor);
  }
}

export function $createHighlightTextNode(text, backgroundColor) {
  return new HighlightTextNode(text, backgroundColor);
}

export function $isHighlightTextNode(node) {
  return node instanceof HighlightTextNode;
}
