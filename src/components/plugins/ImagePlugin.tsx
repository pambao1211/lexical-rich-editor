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
  $createImageNode,
  $editImageNode,
  ImageNode,
} from "../custom-nodes/ImageNode/ImageNode";
import { $wrapNodeInElement, mergeRegister } from "@lexical/utils";
import {
  EditMediaPayload,
  MediaPayload,
} from "../custom-nodes/MediaNode/MediaNode";

export const INSERT_IMAGE_COMMAND = createCommand<MediaPayload>(
  "INSERT_IMAGE_COMMAND"
);

export const EDIT_IMAGE_COMMAND = createCommand<EditMediaPayload>(
  "UPDATE_IMAGE_COMMAND"
);

const ImagePlugin = () => {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error("ImagesPlugin: ImageNode not registered on editor");
    }

    return mergeRegister(
      editor.registerCommand(
        INSERT_IMAGE_COMMAND,
        (payload) => {
          const imageNode = $createImageNode(payload);
          $insertNodes([imageNode]);

          if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
            $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
          }
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerCommand(
        EDIT_IMAGE_COMMAND,
        (payload) => {
          editor.update(() => $editImageNode(payload));
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [editor]);

  return null;
};

export default ImagePlugin;
