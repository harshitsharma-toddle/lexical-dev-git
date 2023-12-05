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
          color: selection.style.color,
          "background-color":
            highlightColor !== "clear" ? highlightColor : "transparent",
        });
      }
    });
  };

  return ["pink", "yellow", "aqua", "clear"].map((highlightColor) => (
    <button onClick={() => onClick(highlightColor)} key={highlightColor}>
      {highlightColor !== "clear"
        ? "Highlight: " + highlightColor
        : "Clear Highlight"}
    </button>
  ));
}
