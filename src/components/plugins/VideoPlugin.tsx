import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import {
  $createParagraphNode,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
} from "lexical";
import {
  $createVideoNode,
  $editVideoNode,
  VideoNode,
} from "../custom-nodes/VideoNode/VideoNode";
import { $wrapNodeInElement, mergeRegister } from "@lexical/utils";
import {
  EditMediaPayload,
  MediaPayload,
} from "../custom-nodes/MediaNode/MediaNode";

export const INSERT_VIDEO_COMMAND = createCommand<MediaPayload>(
  "INSERT_VIDEO_COMMAND"
);

export const EDIT_VIDEO_COMMAND = createCommand<EditMediaPayload>(
  "UPDATE_VIDEO_COMMAND"
);

const ImagePlugin = () => {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    if (!editor.hasNodes([VideoNode])) {
      throw new Error("ImagesPlugin: ImageNode not registered on editor");
    }

    return mergeRegister(
      editor.registerCommand(
        INSERT_VIDEO_COMMAND,
        (payload) => {
          const videoNode = $createVideoNode(payload);
          $insertNodes([videoNode]);

          if ($isRootOrShadowRoot(videoNode.getParentOrThrow())) {
            $wrapNodeInElement(videoNode, $createParagraphNode).selectEnd();
          }
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerCommand(
        EDIT_VIDEO_COMMAND,
        (payload) => {
          editor.update(() => $editVideoNode(payload));
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [editor]);

  return null;
};

export default ImagePlugin;
