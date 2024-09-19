import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useState } from "react";
import { $generateHtmlFromNodes } from "@lexical/html";
import { debounce } from "../../utils";
import parse from "html-react-parser";

const PreviewPlugin = () => {
  const [preview, setPreview] = useState<string>("");
  const [editor] = useLexicalComposerContext();
  const [customPreview, setCustomPreview] = useState("");
  const debounceSetPreview = debounce(setPreview, 500);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const html = $generateHtmlFromNodes(editor, null);
        debounceSetPreview(html);
        // console.log(html);
      });
    });
  }, [editor]);

  const getHtmlFromNode = (node: {
    type: string;
    children?: Array<{ type: string; text?: string; tag?: string }>;
  }): string | undefined => {
    let result = "";
    const { children } = node;
    if (children === undefined) return;
    if (children.length === 0) return result;
    children.forEach((child) => {
      const { type } = child;
      switch (type) {
        case "paragraph":
          result += `<p>${getHtmlFromNode(child)}</p>`;
          break;
        case "text":
          result += `<span>${child.text}</span>`;
          break;
        case "heading":
        case "list":
          const tag = child.tag ?? "h1";
          result += `<${tag}>${getHtmlFromNode(child)}<${tag}>`;
          break;
        case "listitem":
          result += `<li>${getHtmlFromNode(child)}</li>`;
          break;
      }
    });
    return result;
  };

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const serializedState = editorState.toJSON();
        const root = serializedState.root;
        console.log(serializedState);
        // const customPreview = getHtmlFromNode(root);
        // setCustomPreview(customPreview);
        setPreview($generateHtmlFromNodes(editor, null));
      });
    });
  }, [editor]);

  // return null;
  return <div>{parse(`${preview}`)}</div>;
};

export default PreviewPlugin;
