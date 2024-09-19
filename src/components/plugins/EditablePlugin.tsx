import { useEffect } from "react";
import { useEditorPropsContainer } from "../hooks/useEditorPropsContainer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

const EditablePlugin = () => {
  const [editor] = useLexicalComposerContext();
  const editorProps = useEditorPropsContainer();

  useEffect(() => {
    editor.setEditable(!!editorProps?.editable);
  }, [editorProps?.editable]);

  return null;
};

export default EditablePlugin;
