import {
  EditMediaPayload,
  MediaNode,
  MediaPayload,
  MediaType,
  SerializedMediaNode,
} from "../MediaNode/MediaNode";
import {
  $getNodeByKey,
  DOMExportOutput,
  LexicalEditor,
  LexicalNode,
} from "lexical";
import ReactDOMServer from "react-dom/server";
import MediaComponent from "../MediaNode/MediaComponent";

export class VideoNode extends MediaNode {
  decorate(): React.ReactNode {
    return (
      <MediaComponent
        mediaType={MediaType.Video}
        nodeKey={this.__key}
        payload={{
          src: this.__src,
          width: this.__width,
          height: this.__height,
          caption: this.__caption,
          isFullWidth: this.__isFullWidth,
        }}
        hasEditOverlay
      />
    );
  }

  exportJSON(): SerializedMediaNode {
    const self = this.getLatest();
    return {
      src: self.__src,
      width: self.__width,
      height: self.__height,
      caption: self.__caption,
      isFullWidth: self.__isFullWidth,
      type: self.getType(),
      version: 1,
    };
  }

  exportDOM(editor: LexicalEditor): DOMExportOutput {
    const self = this.getLatest();
    const dom = ReactDOMServer.renderToStaticMarkup(
      <MediaComponent
        mediaType={MediaType.Video}
        nodeKey={this.__key}
        payload={{
          src: self.__src,
          width: self.__width,
          height: self.__height,
          caption: self.__caption,
          isFullWidth: self.__isFullWidth,
        }}
      />
    );
    const container = MediaNode.generateContainer(editor._config);
    container.innerHTML = dom;
    return { element: container };
  }

  static getType(): string {
    return "video";
  }

  static clone(node: MediaNode): MediaNode {
    return new VideoNode(node.getProperties());
  }

  static importJSON(serializedNode: SerializedMediaNode): MediaNode {
    const { src, width, height, caption, isFullWidth } = serializedNode;
    const node = $createVideoNode({ src, width, height, caption, isFullWidth });
    return node;
  }
}

export function $createVideoNode(payload: MediaPayload): MediaNode {
  const { src, width, height, caption, isFullWidth } = payload;
  return new VideoNode({ src, width, height, caption, isFullWidth });
}
export function $isVideoNode(node: LexicalNode | null): node is VideoNode {
  return node instanceof VideoNode;
}

export function $editVideoNode(payload: EditMediaPayload) {
  const node = $getNodeByKey(payload.nodeKey);
  if ($isVideoNode(node)) node.update(payload);
}
