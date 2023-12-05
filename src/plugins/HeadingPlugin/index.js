import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection } from "lexical";
import { $setBlocksType } from "@lexical/selection";
import { $createHeadingNode } from "@lexical/rich-text";

export default function HeadingPlugin() {
  const [editor] = useLexicalComposerContext();
  const onClick = (tag) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(tag));
      }
    });
  };
  return ["h1", "h2", "h3", "h4", "h5", "h6"].map((tag) => (
    <button onClick={() => onClick(tag)} key={tag}>
      {tag}
    </button>
  ));
}
