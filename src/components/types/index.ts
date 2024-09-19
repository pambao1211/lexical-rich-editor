export interface ToolbarConfigs {
  imageFullWidth?: boolean;
  hasImage?: boolean;
  hasVideo?: boolean;
  hasHeading?: boolean;
  hasList?: boolean;
  hasLink?: boolean;
  hasAlignment?: boolean;
  controlledState?: boolean;
}

export interface EditorStateChangePayload {
  serializedState: string;
  htmlContent: string;
}

export interface LexicalRichTextProps {
  uploadFile?: (file: File) => Promise<string>;
  onEditorStateChange: (stateChangePayload: EditorStateChangePayload) => void;
  initialState: string | null;
  toolbarConfigs?: ToolbarConfigs;
  editable?: boolean;
  className?: string;
  toolbarClassName?: string;
  controlledState?: boolean;
}
