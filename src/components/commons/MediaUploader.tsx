import React, { useCallback, useEffect, useState } from "react";
import { Input, message } from "antd";
import { useEditorPropsContainer } from "../hooks/useEditorPropsContainer";
import { Link, Trash2 } from "lucide-react";
import DraggerCustom from "../commons/DraggerCustom";
import IconCaption from "../icons/IconCaption";
import {
  MEDIA_MAX_WIDTH,
  MediaPayload,
  MediaType,
} from "../custom-nodes/MediaNode/MediaNode";

interface Props {
  imgPayload?: Partial<MediaPayload>;
  onSave: (imagePayload: MediaPayload) => void;
  mediaType: MediaType;
}

interface ImageDimension {
  width: number;
  height: number;
}

const MediaUploader = (props: Props) => {
  const { imgPayload, onSave, mediaType } = props;
  const editorProps = useEditorPropsContainer();
  const [url, setUrl] = useState(imgPayload?.src || "");
  const [caption, setCaption] = useState(imgPayload?.caption || "");
  const [imageDimension, setImageDimension] = useState<ImageDimension | null>(
    null
  );
  const isMediaTypeVideo = mediaType === MediaType.Video;
  const isSaveBtnDisabled = !url || !imageDimension;

  const handleDelete = useCallback(() => setUrl(""), []);
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value),
    []
  );
  const handleCaptionChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setCaption(e.target.value),
    []
  );
  const handleSave = useCallback(() => {
    if (isSaveBtnDisabled) return;
    const heightRatio = imageDimension.height / imageDimension.width;
    const width = Math.min(MEDIA_MAX_WIDTH, imageDimension.width);
    const height = heightRatio * width;
    onSave({
      src: url,
      width: width,
      height: height,
      caption,
      isFullWidth: !!editorProps?.toolbarConfigs?.imageFullWidth,
    });
  }, [url, imageDimension, caption]);

  const media =
    mediaType === MediaType.Image ? (
      <img className="h-full w-auto object-contain" src={url} />
    ) : (
      <video className="h-full w-full object-contain" src={url} controls />
    );

  useEffect(() => {
    if (isMediaTypeVideo) {
      const video: any = document.createElement("video");
      setImageDimension(null);
      video.onloadedmetadata = () => {
        setImageDimension({
          width: video?.videoWidth,
          height: video?.videoHeight,
        });
      };
      video.src = url;
      return;
    }
    const img = new Image();
    setImageDimension(null);
    img.onload = () => {
      setImageDimension({ width: img.width, height: img.height });
    };
    img.src = url;
  }, [url]);

  return (
    <div className="space-y-5 h-full w-full">
      <div className="min-w-[350px] min-h-[300px] h-[500px]">
        {!!url ? (
          media
        ) : (
          <DraggerCustom
            multiple={false}
            customRequest={async (f) => {
              try {
                const url = await editorProps?.uploadFile!(f.file as File);
                setUrl(url!);
                message.success("Upload image sucessfully");
              } catch (e) {
                console.error("Upload image failed", (e as Error)?.message);
                message.error("Upload image failed");
              }
            }}
          />
        )}
      </div>
      <div className="flex gap-2">
        <Input
          onChange={handleInputChange}
          prefix={<Link size={10} />}
          value={url}
        />
        <button
          onClick={handleDelete}
          className="bg-red-500 p-3 rounded-md hover:bg-red-300">
          <Trash2 size={20} color="white" />
        </button>
      </div>
      <Input
        onChange={handleCaptionChange}
        placeholder="Caption"
        prefix={<IconCaption />}
        value={caption}
      />
      <div className="w-full flex justify-end">
        <button
          disabled={isSaveBtnDisabled}
          onClick={handleSave}
          className="bg-blue-500 p-3 text-white rounded-md hover:bg-blue-300 w-[100px] disabled:bg-blue-300 disabled:cursor-not-allowed">
          Save
        </button>
      </div>
    </div>
  );
};

export default MediaUploader;
