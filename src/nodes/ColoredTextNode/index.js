import { TextNode } from "lexical";

function convertColoredElement(domNode) {
  const textContent = domNode.textContent;
  const color = domNode.style.color;
  if (textContent !== null) {
    const node = $createColoredTextNode(textContent, color, "colored");
    return {
      node,
    };
  }

  return null;
}

export class ColoredTextNode extends TextNode {
  constructor(text, color, className, key) {
    super(text, key);
    this.__color = color;
    this.__className = className;
  }

  static getType() {
    return "colored";
  }

  static clone(node) {
    return new ColoredTextNode(
      node.__text,
      node.__color,
      node.__className,
      node.__key
    );
  }

  createDOM(config) {
    const element = super.createDOM(config);
    element.style.color = this.__color;
    element.setAttribute("data-lexical-colored", "true");
    element.classList.add(this.__className);
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
      className: "ColoredTextNode",
    };
  }

  static importJSON(json) {
    return $createColoredTextNode(json.text, json.color, json.className);
  }

  exportDOM() {
    const element = document.createElement("span");
    element.setAttribute("data-lexical-colored", "true");
    element.textContent = this.__text;
    element.style.color = this.__color;
    return { element };
  }

  static importDOM() {
    return {
      span: (domNode) => {
        if (domNode.getAttribute("data-lexical-colored") !== "true") {
          return null;
        }
        return {
          conversion: convertColoredElement,
          priority: 1,
        };
      },
    };
  }
}

export function $createColoredTextNode(text, color, className) {
  return new ColoredTextNode(text, color, className);
}

export function $isColoredTextNode(node) {
  return node instanceof ColoredTextNode;
}
