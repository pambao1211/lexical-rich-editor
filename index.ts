import "./index.css";
import { EditorState, SerializedEditorState } from "lexical";
import { LexicalRichText } from "./src/components";
import {
  EditorStateChangePayload,
  ToolbarConfigs,
} from "./src/components/types";
import { LexicalStateIterator } from "./src/util-packages/LexicalStateIterator";

export type { EditorState as LexicalState };
export type { EditorStateChangePayload };
export type { SerializedEditorState };
export type { ToolbarConfigs };

export { LexicalRichText };
export { LexicalStateIterator };
