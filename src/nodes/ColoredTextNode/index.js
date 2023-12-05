import { TextNode } from "lexical";
export class ColoredTextNode extends TextNode {
  constructor(text, color, key) {
    super(text, key);
    this.__color = color;
  }

  static getType() {
    return "colored";
  }

  static clone(node) {
    return new ColoredTextNode(node.__text, node.__color, node.__key);
  }

  createDOM(config) {
    const element = super.createDOM(config);
    element.style.color = this.__color;
    return element;
  }

  updateDOM(prevNode, dom, config) {
    const isUpdated = super.updateDOM(prevNode, dom, config);
    if (prevNode.__color !== this.__color) {
      dom.style.color = this.__color;
    }
    return isUpdated;
  }

  exportJSON() {
    return {
      ...super.exportJSON(),
      type: "colored",
      text: this.__text,
      color: this.__color,
    };
  }

  static importJSON(json) {
    return $createColoredTextNode(json.text, json.color);
  }
}

export function $createColoredTextNode(text, color) {
  return new ColoredTextNode(text, color);
}

export function $isColoredTextNode(node) {
  return node instanceof ColoredTextNode;
}
