import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import { useEditorPropsContainer } from "../hooks/useEditorPropsContainer";
import { $generateHtmlFromNodes } from "@lexical/html";

const EditorStateInitPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const editorProps = useEditorPropsContainer();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        editorProps?.onEditorStateChange({
          serializedState: JSON.stringify(editorState.toJSON()),
          htmlContent: $generateHtmlFromNodes(editor, null),
        });
      });
    });
  }, [editor, editorProps?.onEditorStateChange]);

  useEffect(() => {
    if (!editorProps?.controlledState) return;
    const initialState = editorProps?.initialState;
    const isFocused = editor.getRootElement() === document.activeElement;
    if (!initialState || isFocused) return;
    editor.setEditorState(editor.parseEditorState(initialState));
  }, [editor, editorProps?.initialState, editorProps?.controlledState]);
  return null;
};

export default EditorStateInitPlugin;
