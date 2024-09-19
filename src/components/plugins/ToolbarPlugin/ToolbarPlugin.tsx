import { useCallback, useEffect, useState } from "react";
import SelectCustom from "../../commons/SelectCustom";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createHeadingNode,
  $isHeadingNode,
  HeadingTagType,
} from "@lexical/rich-text";
import {
  $createParagraphNode,
  $getSelection,
  $isElementNode,
  $isParagraphNode,
  $isRangeSelection,
  $isRootOrShadowRoot,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_LOW,
  ElementFormatType,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import { $setBlocksType } from "@lexical/selection";
import { $findMatchingParent, mergeRegister } from "@lexical/utils";
import IconBold from "../../icons/IconBold";
import IconItalic from "../../icons/IconItalic";
import IconUnderline from "../../icons/IconUnderline";
import ButtonToggle from "../../commons/ButtonToggle";
import { getSelectedNode, sanitizeUrl } from "../../../utils/index";
import IconOrderedList from "../../icons/IconOrderedList";
import IconUnorderedList from "../../icons/IconUnorderedList";
import IconLink from "../../icons/IconLink";
import IconImage from "../../icons/IconImage";
import IconUndo from "../../icons/IconUndo";
import IconRedo from "../../icons/IconRedo";
import IconVideo from "../../icons/IconVideo";
import Divider from "./Divider";
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import { INSERT_IMAGE_COMMAND } from "../ImagePlugin";
import { INSERT_VIDEO_COMMAND } from "../VideoPlugin";
import ButtonCustom from "../../commons/ButtonCustom";
import { useDialog } from "../../hooks/useDialog";
import MediaUploader from "../../commons/MediaUploader";
import {
  BlockFormatType,
  dropDownBlockTypeOption,
  elementFormatOptions,
} from "./config";
import { useEditorPropsContainer } from "../../hooks/useEditorPropsContainer";
import { twMerge } from "tailwind-merge";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { MediaType } from "../../custom-nodes/MediaNode/MediaNode";

const ToolbarPlugin = () => {
  const editorProps = useEditorPropsContainer();
  const toolBarConfigs = editorProps?.toolbarConfigs;
  const toolBarClassName = editorProps?.toolbarClassName;
  const { openDialog, closeDialog } = useDialog();
  const [editor] = useLexicalComposerContext();
  const [blockType, setblockType] = useState<BlockFormatType>("paragraph");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderLine] = useState(false);
  const [isLink, setIsLink] = useState(false);
  // const [isLinkEditMode, setIsLinkEditMode] = useState(false);
  const [elementFormat, setElementFormat] = useState<ElementFormatType>("left");
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl("https://"));
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
    // editor.update(() => {
    //   const selection = $getSelection();
    //   if ($isRangeSelection(selection)) {
    //     // const parent = getSelectedNode(selection).getParent();
    //     editor.dispatchCommand(
    //       TOGGLE_LINK_COMMAND,
    //       sanitizeUrl("https://google.com")
    //     );
    //   }
    // });
  }, [editor, isLink]);

  const $updateToolbarState = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if (!selection) return;
      if ($isRangeSelection(selection)) {
        setIsBold(selection.hasFormat("bold"));
        setIsItalic(selection.hasFormat("italic"));
        setIsUnderLine(selection.hasFormat("underline"));

        const anchorNode = selection.anchor.getNode();
        let element =
          anchorNode.getKey() === "root"
            ? anchorNode
            : $findMatchingParent(anchorNode, (e) => {
                const parent = e.getParent();
                return parent !== null && $isRootOrShadowRoot(parent);
              });
        if ($isListNode(element)) {
          const type = element.getListType();
          setblockType(type as BlockFormatType);
        } else {
          if ($isParagraphNode(element)) {
            setblockType("paragraph");
          } else if ($isHeadingNode(element)) {
            setblockType(element.getTag() as BlockFormatType);
          }
        }
        const node = getSelectedNode(selection);
        const parent = node.getParent();
        const isLinkNode = $isLinkNode(parent) || $isLinkNode(node);
        setIsLink(isLinkNode);
        setElementFormat(
          $isElementNode(node)
            ? node.getFormatType() || "left"
            : parent?.getFormatType() || "left"
        );
      }
    });
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbarState();
        });
      }),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (canUndo) => {
          setCanUndo(canUndo);
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (canRedo) => {
          setCanRedo(canRedo);
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, $updateToolbarState]);

  const handleBlockTypeChange = useCallback((blockType: string) => {
    editor.update(() => {
      const selection = $getSelection();
      $setBlocksType(selection, () => {
        if (blockType === "paragraph") return $createParagraphNode();
        return $createHeadingNode(blockType as HeadingTagType);
      });
    });
  }, []);

  const handleElementFormatChange = useCallback((align: string) => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, align as ElementFormatType);
  }, []);

  return (
    <div
      className={twMerge(
        "border border-b-0 border-black p-2 bg-[#fff] flex items-center justify-start gap-2 flex-wrap",
        toolBarClassName
      )}>
      <ButtonToggle
        disabled={!canUndo}
        isActive={false}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}>
        <IconUndo />
      </ButtonToggle>
      <ButtonToggle
        disabled={!canRedo}
        isActive={false}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}>
        <IconRedo />
      </ButtonToggle>
      <Divider />
      <ButtonToggle
        isActive={isBold}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}>
        <IconBold />
      </ButtonToggle>
      <ButtonToggle
        isActive={isItalic}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}>
        <IconItalic />
      </ButtonToggle>
      <ButtonToggle
        isActive={isUnderline}
        onClick={() =>
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")
        }>
        <IconUnderline />
      </ButtonToggle>
      {toolBarConfigs?.hasHeading && (
        <>
          <Divider />
          <SelectCustom
            showSearch={false}
            className="w-[175px]"
            options={dropDownBlockTypeOption}
            value={blockType}
            onValueChange={handleBlockTypeChange}
            variant="borderless"
            optionRender={(option) => (
              <div className={option.data.theme}>{option.data.label}</div>
            )}
          />
        </>
      )}
      {toolBarConfigs?.hasList && (
        <>
          <ButtonToggle
            isActive={blockType === "number"}
            onClick={() => {
              if (blockType !== "number")
                editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
              else handleBlockTypeChange("paragraph");
            }}>
            <IconOrderedList />
          </ButtonToggle>
          <ButtonToggle
            isActive={blockType === "bullet"}
            onClick={() => {
              if (blockType !== "bullet")
                editor.dispatchCommand(
                  INSERT_UNORDERED_LIST_COMMAND,
                  undefined
                );
              else handleBlockTypeChange("paragraph");
            }}>
            <IconUnorderedList />
          </ButtonToggle>
        </>
      )}
      {toolBarConfigs?.hasLink && (
        <ButtonToggle isActive={isLink} onClick={insertLink}>
          <IconLink />
        </ButtonToggle>
      )}
      {toolBarConfigs?.hasImage && (
        <ButtonCustom
          onClick={() => {
            openDialog(
              <MediaUploader
                mediaType={MediaType.Image}
                imgPayload={{
                  src: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
                }}
                onSave={(imagePayload) => {
                  editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
                    ...imagePayload,
                    isFullWidth: toolBarConfigs?.imageFullWidth || false,
                  });
                  closeDialog();
                }}
              />
            );
          }}>
          <IconImage />
        </ButtonCustom>
      )}
      {toolBarConfigs?.hasImage && (
        <ButtonCustom
          onClick={() => {
            openDialog(
              <MediaUploader
                mediaType={MediaType.Video}
                imgPayload={{
                  src: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
                }}
                onSave={(videoPayload) => {
                  editor.dispatchCommand(INSERT_VIDEO_COMMAND, {
                    ...videoPayload,
                    isFullWidth: toolBarConfigs?.imageFullWidth || false,
                  });
                  closeDialog();
                }}
              />
            );
          }}>
          <IconVideo />
        </ButtonCustom>
      )}
      {toolBarConfigs?.hasAlignment && (
        <>
          <Divider />
          <SelectCustom
            showSearch={false}
            className="w-fit"
            options={elementFormatOptions}
            value={elementFormat}
            onValueChange={handleElementFormatChange}
            variant="borderless"
            optionRender={(option) => (
              <div className="flex items-center justify-center">
                {option.data.icon}
              </div>
            )}
          />
        </>
      )}
    </div>
  );
};

export default ToolbarPlugin;
