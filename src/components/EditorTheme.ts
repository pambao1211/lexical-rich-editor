import { BLOCK_TYPE_DROPDOWN_CONFIGS } from "./plugins/ToolbarPlugin/config";

export const EDITOR_THEME = {
  heading: {
    h1: BLOCK_TYPE_DROPDOWN_CONFIGS.h1.theme,
    h2: BLOCK_TYPE_DROPDOWN_CONFIGS.h2.theme,
    h3: BLOCK_TYPE_DROPDOWN_CONFIGS.h3.theme,
    // h4: BLOCK_TYPE_DROPDOWN_CONFIGS.h4.theme,
    // h5: BLOCK_TYPE_DROPDOWN_CONFIGS.h5.theme,
    // h6: BLOCK_TYPE_DROPDOWN_CONFIGS.h6.theme,
  },
  paragraph: `${BLOCK_TYPE_DROPDOWN_CONFIGS.paragraph.theme}`,
  text: {
    bold: "text-bold",
    code: "",
    italic: "italic",
    strikethrough: "line-through",
    subscript: "",
    superscript: "",
    underline: "underline",
    underlineStrikethrough: "",
  },
  list: {
    ol: "list-decimal list-inside",
    ul: "list-disc list-inside",
    listitem: "ml-2",
  },
  image: "inline-block",
  link: "text-nomion-500 hover:underline cursor-pointer",
};
