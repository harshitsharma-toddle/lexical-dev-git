import { useEffect, useRef } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateNodesFromDOM } from "@lexical/html";
import { $insertNodes, $getRoot } from "lexical";

export const ContentLoadPlugin = (props) => {
  const [editor] = useLexicalComposerContext();
  const mountCountRef = useRef(0);
  mountCountRef.current += 1;

  useEffect(() => {
    if (props.content && mountCountRef.current < 3) {
      // disable editor while loading content
      editor.setEditable(false);

      editor.update(() => {
        const root = $getRoot();
        root.clear();
        const nodes = $generateNodesFromDOM(editor, props.content);
        $getRoot().select();
        $insertNodes(nodes);

        //after loading content
        setTimeout(() => {
          editor.setEditable(true);
        }, 0);
      });
    }
  }, [props.content, editor]);

  return null;
};
