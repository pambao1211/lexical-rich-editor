import React, { createContext, useContext } from "react";
import { LexicalRichTextProps } from "../types";

const EditorPropsContext = createContext<EditorPropsValue>(undefined);

type EditorPropsValue = LexicalRichTextProps | undefined;

interface Props {
  children: React.ReactNode;
  propsValue: LexicalRichTextProps;
}
export const EditorPropsProvider = (props: Props) => {
  const { children, propsValue } = props;
  return (
    <EditorPropsContext.Provider value={propsValue}>
      {children}
    </EditorPropsContext.Provider>
  );
};

export const useEditorPropsContainer = () => {
  const value = useContext(EditorPropsContext);
  if (!value) return;
  return value;
};
