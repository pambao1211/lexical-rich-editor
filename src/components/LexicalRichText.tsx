import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { EDITOR_THEME } from "./EditorTheme";
import { HeadingNode } from "@lexical/rich-text";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import PlaceHolder from "./PlaceHolder";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin/ToolbarPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { ListItemNode, ListNode } from "@lexical/list";
import ImagePlugin from "./plugins/ImagePlugin";
import LinkPlugin from "./plugins/LinkPlugin";
import { ImageNode } from "./custom-nodes/ImageNode/ImageNode";
import { DialogProvider } from "./hooks/useDialog";
import { EditorPropsProvider } from "./hooks/useEditorPropsContainer";
import EditorStateInitPlugin from "./plugins/EditorStateInitPlugin";
import { LexicalRichTextProps } from "./types";
import { DEFAULT_TOOL_BAR_CONFIGS } from "./plugins/ToolbarPlugin/config";
import EditablePlugin from "./plugins/EditablePlugin";
import { twMerge } from "tailwind-merge";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import FloatingEditorPlugin from "./plugins/FloatingEditorPlugin";
import VideoPlugin from "./plugins/VideoPlugin";
import { VideoNode } from "./custom-nodes/VideoNode/VideoNode";

const EDITOR_NODES = Object.freeze([
  HeadingNode,
  ListNode,
  ListItemNode,
  ImageNode,
  LinkNode,
  AutoLinkNode,
  VideoNode,
]);

const INITIAL_CONFIG = {
  namespace: "lexical-editor",
  theme: EDITOR_THEME,
  onError: (error: Error) => console.error(error),
  nodes: EDITOR_NODES,
  editorState: null,
};

export const EDITOR_CONTAINER_KEY = "editor-container";

const LexicalRichText = (props: LexicalRichTextProps) => {
  const {
    uploadFile,
    onEditorStateChange,
    initialState,
    toolbarConfigs: toolbarProps,
    editable = true,
    className = "",
    toolbarClassName = "",
    controlledState = true,
  } = props;
  const toolbarConfigs = { ...DEFAULT_TOOL_BAR_CONFIGS, ...toolbarProps };
  return (
    <EditorPropsProvider
      propsValue={{
        uploadFile: uploadFile,
        onEditorStateChange,
        initialState,
        toolbarConfigs,
        toolbarClassName,
        editable,
        controlledState,
      }}>
      <DialogProvider>
        <div className="w-full h-full">
          <LexicalComposer
            initialConfig={{ ...INITIAL_CONFIG, editorState: initialState }}>
            {/*<AutoFocusPlugin />*/}
            <HistoryPlugin />
            <ListPlugin />
            {editable && <ToolbarPlugin />}
            <div id={EDITOR_CONTAINER_KEY} className="relative h-full w-full">
              <RichTextPlugin
                contentEditable={
                  <ContentEditable
                    className={twMerge(
                      "border focus:outline-0 border-black  w-full bg-[#fff] text-black p-3 overflow-y-scroll !h-[500px]",
                      className
                    )}
                  />
                }
                placeholder={<PlaceHolder />}
                ErrorBoundary={LexicalErrorBoundary}
              />
              {toolbarConfigs.hasImage && <ImagePlugin />}
              {toolbarConfigs.hasVideo && <VideoPlugin />}
              <EditorStateInitPlugin />
              <EditablePlugin />
              {toolbarConfigs.hasLink && (
                <>
                  <LinkPlugin />
                  <FloatingEditorPlugin />
                  {/*<ClickableLinkPlugin disabled={false} />*/}
                </>
              )}
              {/*<TreeViewPlugin />*/}
              {/*<LocalStoragePlugin />*/}
              {/*<PreviewPlugin />*/}
            </div>
          </LexicalComposer>
        </div>
      </DialogProvider>
    </EditorPropsProvider>
  );
};

export { LexicalRichText };
