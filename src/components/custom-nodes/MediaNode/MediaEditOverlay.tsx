import { twMerge } from "tailwind-merge";
import { Button } from "antd";
import MediaUploader from "../../commons/MediaUploader";
import { EDIT_IMAGE_COMMAND } from "../../plugins/ImagePlugin";
import { EDIT_VIDEO_COMMAND } from "../../plugins/VideoPlugin";

import { Pencil, Trash2 } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import {
  $getNodeByKey,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  NodeKey,
} from "lexical";
import { $isMediaNode, MediaPayload, MediaType } from "./MediaNode";
import { mergeRegister } from "@lexical/utils";
import { useDialog } from "../../hooks/useDialog";
import ResizePanel from "./ResizePanel";
import { UiImageDimension } from "./MediaComponent";

interface Props {
  uiImageDimension: UiImageDimension;
  setUiImageDimension: React.Dispatch<React.SetStateAction<UiImageDimension>>;
  payload: MediaPayload;
  nodeKey: NodeKey;
  isFullWidth: boolean;
  mediaType: MediaType;
}

const MediaEditOverlay = (props: Props) => {
  const {
    payload,
    nodeKey,
    uiImageDimension,
    setUiImageDimension,
    isFullWidth,
    mediaType,
  } = props;

  const { openDialog, closeDialog } = useDialog();
  const imageRef = useRef<null | HTMLImageElement>(null);
  const btnEditRef = useRef<null | HTMLButtonElement>(null);
  const [editor] = useLexicalComposerContext();
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey);
  const [isHovered, setIsHovered] = useState(false);
  const editCommand =
    mediaType === MediaType.Image ? EDIT_IMAGE_COMMAND : EDIT_VIDEO_COMMAND;

  const onClick = useCallback(
    (e: MouseEvent) => {
      if (e.target === imageRef.current || e.target === btnEditRef.current) {
        clearSelection();
        setSelected(true);
      }
      return false;
    },
    [imageRef, clearSelection, nodeKey]
  );

  const onDelete = useCallback(() => {
    if (isSelected) {
      handleDeleteImg();
      return true;
    }
    return false;
  }, [nodeKey, isSelected]);

  const handleDeleteImg = () => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isMediaNode(node)) node.remove();
    });
  };

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  useEffect(() => {
    const unRegister = mergeRegister(
      editor.registerCommand(CLICK_COMMAND, onClick, COMMAND_PRIORITY_LOW),
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW
      )
    );
    return unRegister;
  }, [isSelected]);

  const hasOverlay = isHovered || isSelected;
  return (
    <span
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={imageRef}
      className={twMerge(
        "flex justify-end items-start w-full h-full absolute",
        hasOverlay && "bg-neutral-500 bg-opacity-50",
        isSelected && "border-2 border-black"
      )}>
      {hasOverlay && (
        <>
          {!isFullWidth && (
            <>
              <ResizePanel
                uiImageDimension={uiImageDimension}
                setUiImageDimension={setUiImageDimension}
                payload={payload}
                nodeKey={nodeKey}
              />
              <ResizePanel
                uiImageDimension={uiImageDimension}
                setUiImageDimension={setUiImageDimension}
                isRight
                payload={payload}
                nodeKey={nodeKey}
              />
            </>
          )}
          <span className="flex gap-3 p-3">
            <Button
              ref={btnEditRef}
              onClick={() => {
                openDialog(
                  <MediaUploader
                    mediaType={mediaType}
                    imgPayload={payload}
                    onSave={(payload) => {
                      editor.dispatchCommand(editCommand, {
                        ...payload,
                        nodeKey,
                      });
                      closeDialog();
                    }}
                  />
                );
              }}
              type="primary"
              className="z-50">
              <Pencil size={15} color="white" />
            </Button>
            <Button onClick={handleDeleteImg} type="primary" className="z-50">
              <Trash2 size={20} color="white" />
            </Button>
          </span>
        </>
      )}
    </span>
  );
};

export default MediaEditOverlay;
