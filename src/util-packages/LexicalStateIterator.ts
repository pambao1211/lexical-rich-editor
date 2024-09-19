import { SerializedEditorState, SerializedElementNode } from "lexical";

type LexicalNode = SerializedElementNode & { text: string };

export class LexicalStateIterator {
  stack: LexicalNode[] = [];

  constructor(serializedState: SerializedEditorState) {
    const root = structuredClone(serializedState.root);
    root?.children
      ?.reverse()
      ?.forEach((c) => this.stack.push(c as LexicalNode));
  }

  public hasNext() {
    return this.stack.length > 0;
  }

  public next() {
    if (!this.hasNext()) return;
    const current = this.stack.pop();
    if (!!current?.children)
      current?.children
        .reverse()
        .forEach((c) => this.stack.push(c as LexicalNode));
    return current;
  }

  public lookNext() {
    return this.stack[this.stack.length - 1];
  }
}
