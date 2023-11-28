import { TextNode } from "lexical";
export class ColoredNode extends TextNode {
  constructor(text, color, key) {
    super(text, key);
    this.__color = color;
  }

  static getType() {
    return "colored";
  }

  static clone(node) {
    return new ColoredNode(node.__text, node.__color, node.__key);
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
}

export function $createColoredNode(text, color) {
  return new ColoredNode(text, color);
}

export function $isColoredNode(node) {
  return node instanceof ColoredNode;
}
