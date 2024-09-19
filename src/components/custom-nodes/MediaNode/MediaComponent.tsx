import { NodeKey } from "lexical";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import MediaEditOverlay from "./MediaEditOverlay";
import {
  MEDIA_MAX_WIDTH,
  MEDIA_MIN_WIDTH,
  MediaPayload,
  MediaType,
} from "./MediaNode";

interface Props {
  payload: MediaPayload;
  nodeKey: NodeKey;
  hasEditOverlay?: boolean;
  mediaType: MediaType;
}

export interface UiImageDimension {
  width: number;
  height: number;
}

const FULL_WIDTH_STYLING = {
  width: "100%",
  height: "auto",
  // maxWidth: `${IMG_MAX_WIDTH}px`,
  // minWidth: `${IMG_MIN_WIDTH}px`,
};

const MediaComponent = (props: Props) => {
  const { payload, nodeKey, hasEditOverlay = false, mediaType } = props;
  const { src, width, height, isFullWidth } = payload;
  const [uiImageDimension, setUiImageDimension] = useState<UiImageDimension>({
    width,
    height,
  });
  const isMediaTypeImage = mediaType === MediaType.Image;

  useEffect(() => {
    const { width, height } = payload;
    setUiImageDimension({ width, height });
  }, [payload]);

  return (
    <span className="relative w-fit duration-300">
      {hasEditOverlay && (
        <MediaEditOverlay
          mediaType={mediaType}
          uiImageDimension={uiImageDimension}
          setUiImageDimension={setUiImageDimension}
          payload={payload}
          nodeKey={nodeKey}
          isFullWidth={isFullWidth}
        />
      )}
      {isMediaTypeImage ? (
        <img
          style={
            isFullWidth
              ? FULL_WIDTH_STYLING
              : {
                  width: `${uiImageDimension.width}px`,
                  height: `${uiImageDimension.height}px`,
                  maxWidth: `${MEDIA_MAX_WIDTH}px`,
                  minWidth: `${MEDIA_MIN_WIDTH}px`,
                }
          }
          className={twMerge("h-auto")}
          src={src}
          alt="Image"
        />
      ) : (
        <video
          controls
          style={
            isFullWidth
              ? FULL_WIDTH_STYLING
              : {
                  width: `${uiImageDimension.width}px`,
                  height: `${uiImageDimension.height}px`,
                  maxWidth: `${MEDIA_MAX_WIDTH}px`,
                  minWidth: `${MEDIA_MIN_WIDTH}px`,
                }
          }
          className={twMerge("h-auto")}
          src={src}
        />
      )}

      <div className="italic">{payload.caption}</div>
    </span>
  );
};

export default MediaComponent;
