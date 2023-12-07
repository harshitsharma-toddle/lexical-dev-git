import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import { TextNode } from "lexical";
// import { Dropdown } from "antd";

export default function MentionsPlugin() {
  const [editor] = useLexicalComposerContext();
  //   const items = [
  //     {
  //       key: "1",
  //       label: (
  //         <a
  //           target="_blank"
  //           rel="noopener noreferrer"
  //           href="https://www.antgroup.com"
  //         >
  //           1st menu item
  //         </a>
  //       ),
  //     },
  //     {
  //       key: "2",
  //       label: (
  //         <a
  //           target="_blank"
  //           rel="noopener noreferrer"
  //           href="https://www.aliyun.com"
  //         >
  //           2nd menu item
  //         </a>
  //       ),
  //     },
  //     {
  //       key: "3",
  //       label: (
  //         <a
  //           target="_blank"
  //           rel="noopener noreferrer"
  //           href="https://www.luohanacademy.com"
  //         >
  //           3rd menu item
  //         </a>
  //       ),
  //     },
  //   ];
  //   const DropdownList = () => {
  //     return (
  //       //   <Dropdown menu={{ items }} placement="bottomRight" arrow>
  //       <button>demo</button>
  //       //   </Dropdown>
  //     );
  //   };

  function findTargetNodeAndReplace(node) {
    const text = node.getTextContent();
    for (let i = 0; i < text.length; i++) {
      if (text[i] === "@") {
        console.log("found @");
      }
    }

    return null;
  }

  function transformTextToMention(node) {
    let targetNode = node;
    // console.log("targetNode", targetNode);
    while (targetNode !== null) {
      if (!targetNode.isSimpleText()) {
        return;
      }

      targetNode = findTargetNodeAndReplace(targetNode);
    }
  }

  useEffect(() => {
    const transformTextNodeToMentionNode = editor.registerNodeTransform(
      TextNode,
      transformTextToMention
    );
    return () => {
      transformTextNodeToMentionNode();
    };
  });
  return null;
}
