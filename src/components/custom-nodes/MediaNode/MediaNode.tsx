import {
  DecoratorNode,
  DOMExportOutput,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  SerializedLexicalNode,
  Spread,
} from "lexical";

export interface MediaPayload {
  src: string;
  width: number;
  height: number;
  caption: string;
  isFullWidth: boolean;
}

export enum MediaType {
  Image,
  Video,
}

export type EditMediaPayload = MediaPayload & { nodeKey: string };
export type ResizeMediaPayload = Pick<EditMediaPayload, "width" | "nodeKey">;
export type SerializedMediaNode = Spread<MediaPayload, SerializedLexicalNode>;

export const MEDIA_MAX_WIDTH = 500;
export const MEDIA_MIN_WIDTH = 150;

export abstract class MediaNode extends DecoratorNode<React.ReactNode> {
  __src: string;
  __width: number;
  __height: number;
  __caption: string;
  __isFullWidth: boolean;

  constructor(mediaPayload: MediaPayload, key?: string) {
    const { src, width, height, caption, isFullWidth } = mediaPayload;
    super(key);
    this.__src = src;
    this.__width = width;
    this.__height = height;
    this.__caption = caption;
    this.__isFullWidth = isFullWidth;
  }

  setSrc(src: string) {
    const self = this.getWritable();
    self.__src = src;
  }

  getSrc(): string {
    const self = this.getLatest();
    return self.__src;
  }

  getProperties(): MediaPayload {
    const self = this.getLatest();
    const result = {
      src: self.__src,
      width: self.__width,
      height: self.__height,
      caption: self.__caption,
      isFullWidth: self.__isFullWidth,
    };
    return result;
  }

  createDOM(config: EditorConfig) {
    return MediaNode.generateContainer(config);
  }

  updateDOM() {
    return false;
  }

  abstract decorate(): React.ReactNode;
  update(mediaPayload: MediaPayload) {
    const self = this.getWritable();
    self.__src = mediaPayload.src;
    self.__width = mediaPayload.width;
    self.__height = mediaPayload.height;
    self.__caption = mediaPayload.caption;
  }

  abstract exportJSON(): SerializedMediaNode;

  abstract exportDOM(editor: LexicalEditor): DOMExportOutput;

  static generateContainer(config: EditorConfig) {
    const span = document.createElement("span");
    const theme = config.theme;
    const className = theme.image;
    if (!!className) span.className = className;
    return span;
  }

  static computeResizeResult(width: number, oldPayload: MediaPayload) {
    const newWidth = Math.max(
      Math.min(width, MEDIA_MAX_WIDTH),
      MEDIA_MIN_WIDTH
    );
    const heightRatio = oldPayload.height / oldPayload.width;
    const result = { width: newWidth, height: newWidth * heightRatio };
    return result;
  }
}

export function $isMediaNode(node: LexicalNode | null): node is MediaNode {
  return node instanceof MediaNode;
}
