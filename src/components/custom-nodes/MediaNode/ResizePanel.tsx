import React, { useCallback, useEffect, useRef } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { MediaNode, MediaPayload, MEDIA_MAX_WIDTH } from "./MediaNode";
import { twMerge } from "tailwind-merge";
import { UiImageDimension } from "./MediaComponent";
import { EDIT_IMAGE_COMMAND } from "../../plugins/ImagePlugin";

interface Props {
  uiImageDimension: UiImageDimension;
  setUiImageDimension: React.Dispatch<React.SetStateAction<UiImageDimension>>;
  payload: MediaPayload;
  nodeKey: string;
  isRight?: boolean;
}

const ResizePanel = (props: Props) => {
  const {
    payload,
    nodeKey,
    isRight = false,
    uiImageDimension,
    setUiImageDimension,
  } = props;
  const { width } = uiImageDimension;
  const [editor] = useLexicalComposerContext();
  const startPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (uiImageDimension.width === payload.width) return;
    const timeoutId = setTimeout(() => {
      editor.dispatchCommand(EDIT_IMAGE_COMMAND, {
        ...payload,
        ...uiImageDimension,
        nodeKey,
      });
    }, 250);
    return () => clearTimeout(timeoutId);
  }, [uiImageDimension, payload, nodeKey, editor]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const currentPos = { x: e.clientX, y: e.clientY };
      let dx = startPos.current.x - currentPos.x;
      if (isRight) dx = -dx;
      const newWidth = Math.min(MEDIA_MAX_WIDTH, width + dx);
      const newDimension = MediaNode.computeResizeResult(newWidth, payload);
      setUiImageDimension(newDimension);
    },
    [width, setUiImageDimension]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLSpanElement>) => {
      startPos.current = { x: e.clientX, y: e.clientY };
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [startPos.current, uiImageDimension]
  );

  const handleMouseUp = useCallback(() => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }, [startPos.current, uiImageDimension]);

  return (
    <span
      onMouseDown={handleMouseDown}
      className={twMerge(
        "absolute flex items-center justify-center h-full w-3 hover:cursor-col-resize",
        isRight ? "right-0" : "left-0"
      )}>
      <span className="bg-neutral-050 border-white border rounded-2xl w-1/2 h-1/6" />
    </span>
  );
};

export default ResizePanel;
