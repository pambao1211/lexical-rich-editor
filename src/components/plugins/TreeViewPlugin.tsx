import { TreeView } from "@lexical/react/LexicalTreeView";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

const TreeViewPlugin = () => {
  const [editor] = useLexicalComposerContext();
  return (
    <TreeView
      editor={editor}
      treeTypeButtonClassName=""
      timeTravelButtonClassName=""
      timeTravelPanelButtonClassName=""
      timeTravelPanelClassName=""
      timeTravelPanelSliderClassName=""
      viewClassName="bg-black text-white w-full"
    />
  );
};

export default TreeViewPlugin;
