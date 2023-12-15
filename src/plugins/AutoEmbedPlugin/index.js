import {
  AutoEmbedOption,
  LexicalAutoEmbedPlugin,
} from "@lexical/react/LexicalAutoEmbedPlugin";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { INSERT_YOUTUBE_COMMAND } from "../YoutubePlugin";
import { INSERT_VIMEO_COMMAND } from "../VimeoPlugin";

export const YoutubeEmbedConfig = {
  contentName: "Youtube Video",

  exampleUrl: "https://www.youtube.com/watch?v=jNQXAC9IVRw",

  // Icon for display.
  icon: <i className="icon youtube" />,

  insertNode: (editor, result) => {
    editor.dispatchCommand(INSERT_YOUTUBE_COMMAND, result.id);
  },

  keywords: ["youtube", "video"],

  // Determine if a given URL is a match and return url data.
  parseUrl: async (url) => {
    const match =
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/.exec(url);

    const id = match ? (match?.[2].length === 11 ? match[2] : null) : null;

    if (id != null) {
      return {
        id,
        url,
      };
    }

    return null;
  },

  type: "youtube",
};

export const VimeoEmbedConfig = {
  contentName: "vimeo",
  exampleUrl: "https://vimeo.com/893600289",

  insertNode: (editor, result) => {
    editor.dispatchCommand(INSERT_VIMEO_COMMAND, {
      type: "vimeo",
      id: result.id,
    });
  },

  keywords: ["vimeo", "video"],

  // Determine if a given URL is a match and return url data.
  parseUrl: async (url) => {
    const match = /vimeo\.com\/(?:video\/)?(\d+)/.exec(url);

    const id = match ? match[1] : null;

    if (id != null) {
      return {
        id,
        url,
      };
    }

    return null;
  },

  type: "vimeo",
};

export const EmbedConfigs = [YoutubeEmbedConfig, VimeoEmbedConfig];

function AutoEmbedMenuItem({
  index,
  isSelected,
  onClick,
  onMouseEnter,
  option,
}) {
  let className = "item";
  if (isSelected) {
    className += " selected";
  }
  return (
    <li
      key={option.key}
      tabIndex={-1}
      className={className}
      ref={option.setRefElement}
      role="option"
      aria-selected={isSelected}
      id={"typeahead-item-" + index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <span className="text">{option.title}</span>
    </li>
  );
}

function AutoEmbedMenu({
  options,
  selectedItemIndex,
  onOptionClick,
  onOptionMouseEnter,
}) {
  return (
    <div className="typeahead-popover">
      <ul>
        {options.map((option, i) => (
          <AutoEmbedMenuItem
            index={i}
            isSelected={selectedItemIndex === i}
            onClick={() => onOptionClick(option, i)}
            onMouseEnter={() => onOptionMouseEnter(i)}
            key={option.key}
            option={option}
          />
        ))}
      </ul>
    </div>
  );
}

export default function AutoEmbedPlugin() {
  const getMenuOptions = (activeEmbedConfig, embedFn, dismissFn) => {
    return [
      new AutoEmbedOption("Dismiss", {
        onSelect: dismissFn,
      }),
      new AutoEmbedOption(`Embed ${activeEmbedConfig.contentName}`, {
        onSelect: embedFn,
      }),
    ];
  };

  return (
    <>
      <LexicalAutoEmbedPlugin
        embedConfigs={EmbedConfigs}
        getMenuOptions={getMenuOptions}
        menuRenderFn={(
          anchorElementRef,
          {
            selectedIndex,
            options,
            selectOptionAndCleanUp,
            setHighlightedIndex,
          }
        ) =>
          anchorElementRef.current
            ? ReactDOM.createPortal(
                <div
                  className="typeahead-popover auto-embed-menu"
                  style={{
                    marginLeft: anchorElementRef.current.style.width,
                    width: 200,
                  }}
                >
                  <AutoEmbedMenu
                    options={options}
                    selectedItemIndex={selectedIndex}
                    onOptionClick={(option, index) => {
                      setHighlightedIndex(index);
                      selectOptionAndCleanUp(option);
                    }}
                    onOptionMouseEnter={(index) => {
                      setHighlightedIndex(index);
                    }}
                  />
                </div>,
                anchorElementRef.current
              )
            : null
        }
      />
    </>
  );
}
