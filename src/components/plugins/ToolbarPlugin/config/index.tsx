import IconHeading1 from "../../../icons/IconHeading1";
import IconHeading2 from "../../../icons/IconHeading2";
import IconHeading3 from "../../../icons/IconHeading3";
import IconNormalText from "../../../icons/IconNormalText";
import IconAlignLeft from "../../../icons/IconAlignLeft";
import IconAlignCenter from "../../../icons/IconAlignCenter";
import IconAlignRight from "../../../icons/IconAlignRight";
import IconAlignJustify from "../../../icons/IconAlignJustify";
import { ToolbarConfigs } from "../../../types";

export const BLOCK_TYPE_DROPDOWN_CONFIGS = Object.freeze({
  paragraph: {
    label: "Normal",
    icon: <IconNormalText />,
    theme: "text-base",
  },
  h1: {
    label: "Heading 1",
    icon: <IconHeading1 />,
    theme: "text-2xl",
  },
  h2: {
    label: "Heading 2",
    icon: <IconHeading2 />,
    theme: "text-xl",
  },
  h3: {
    label: "Heading 3",
    icon: <IconHeading3 />,
    theme: "text-lg",
  },
  // h4: {
  //   label: "Heading 4",
  //   icon: <IconHeading4 />,
  //   theme: "text-base",
  // },
  // h5: {
  //   label: "Heading 5",
  //   icon: <IconHeading5 />,
  //   theme: "text-sm",
  // },
  // h6: {
  //   label: "Heading 6",
  //   icon: <IconHeading6 />,
  //   theme: "text-xs",
  // },
});
export const ELEMENT_FORMAT_CONFIGS = Object.freeze({
  left: { label: "Left", icon: <IconAlignLeft /> },
  center: { label: "Center", icon: <IconAlignCenter /> },
  right: { label: "Right", icon: <IconAlignRight /> },
  justify: { label: "Justify", icon: <IconAlignJustify /> },
});

export type BlockFormatType =
  | keyof typeof BLOCK_TYPE_DROPDOWN_CONFIGS
  | "bullet"
  | "number";

export const dropDownBlockTypeOption = Object.entries(
  BLOCK_TYPE_DROPDOWN_CONFIGS
).map(([key, value]) => ({
  label: (
    <div className="flex items-center gap-3 p-0">
      <>
        {value.icon} {value.label}
      </>
    </div>
  ),
  icon: value.icon,
  value: key,
  theme: value.theme,
}));
export const elementFormatOptions = Object.entries(ELEMENT_FORMAT_CONFIGS).map(
  ([key, value]) => ({
    label: value.icon,
    icon: value.icon,
    value: key,
  })
);

export const DEFAULT_TOOL_BAR_CONFIGS: ToolbarConfigs = {
  imageFullWidth: true,
  hasImage: true,
  hasVideo: true,
  hasHeading: true,
  hasList: true,
  hasLink: true,
  hasAlignment: true,
};
