import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback, useEffect } from "react";
import { debounce } from "../../utils";
import { $generateHtmlFromNodes } from "@lexical/html";

const LOCAL_STORAGE_KEY = "lexical";
const LocalStoragePlugin = () => {
  const [editor] = useLexicalComposerContext();

  const saveLocalStorage = (serializedState: string) =>
    localStorage.setItem(LOCAL_STORAGE_KEY, serializedState);
  const saveLocalStorageDebounced = debounce(saveLocalStorage, 1000);

  useEffect(() => {
    // const initialState = localStorage.getItem(LOCAL_STORAGE_KEY);
    // if (!initialState) return;
    // editor.setEditorState(editor.parseEditorState(initialState));
    return editor.registerUpdateListener(
      ({ editorState, dirtyElements, dirtyLeaves }) => {
        if (dirtyElements.size === 0 && dirtyLeaves.size === 0) return;
        const serializedState = JSON.stringify(editorState);
        saveLocalStorageDebounced(serializedState);
      }
    );
  }, [editor]);

  return null;
};

export default LocalStoragePlugin;

export const getStateLocalStorage = () =>
  localStorage.getItem(LOCAL_STORAGE_KEY);
