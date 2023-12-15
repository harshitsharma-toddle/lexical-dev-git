import { $getSelection, $isRangeSelection } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $patchStyleText } from "@lexical/selection";

export default function HighlightPlugin() {
  const [editor] = useLexicalComposerContext();

  const onClick = (highlightColor) => {
    editor.update(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, {
          "background-color":
            highlightColor !== "clear" ? highlightColor : "transparent",
        });
      }
    });
  };

  return ["pink", "yellow", "aqua", "clear"].map((highlightColor) => (
    <button
      className="toolbar-highlight"
      onClick={() => onClick(highlightColor)}
      key={highlightColor}
    >
      {highlightColor !== "clear"
        ? "highlight: " + highlightColor.toUpperCase()
        : "CLEAR HIGHLIGHT"}
    </button>
  ));
}
