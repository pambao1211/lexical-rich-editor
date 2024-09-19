import { useCallback, useEffect, useRef, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { createPortal } from "react-dom";
import { EDITOR_CONTAINER_KEY } from "../LexicalRichText";
import { computePosition } from "@floating-ui/dom";
import {
  $getSelection,
  $isLineBreakNode,
  $isRangeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_LOW,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import {
  $createLinkNode,
  $isAutoLinkNode,
  $isLinkNode,
  TOGGLE_LINK_COMMAND,
} from "@lexical/link";
import { getSelectedNode, sanitizeUrl } from "../../utils";
import { $findMatchingParent, mergeRegister } from "@lexical/utils";
import IconCheck from "../icons/IconCheck";
import IconCross from "../icons/IconCross";
import { LinkIcon } from "lucide-react";
import ButtonCustom from "../../components/commons/ButtonCustom";
import { Input } from "antd";
import IconPencil from "../icons/IconPencil";
import IconTrash from "../icons/IconTrash";

interface FloatingMenuCoords {
  x: number;
  y: number;
}

const DEFAULT_URL = "https://";

const FloatingEditorPlugin = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<FloatingMenuCoords | undefined>();
  const [editor] = useLexicalComposerContext();
  const [, setIsLink] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(DEFAULT_URL);
  const [currentEditUrl, setCurrentEditUrl] = useState(DEFAULT_URL);
  const [isEditMode, setIsEditMode] = useState(false);

  const shouldShow = coords !== undefined;

  const calculatePosition = () => {
    const domSelection = getSelection();
    const domRange =
      domSelection?.rangeCount !== 0 && domSelection?.getRangeAt(0);
    if (!domRange || !ref.current) return setCoords(undefined);
    computePosition(domRange, ref.current, { placement: "bottom" })
      .then((pos) => {
        setCoords({ x: pos.x <= 0 ? 0 : pos.x, y: pos.y + 10 });
      })
      .catch(() => {
        setCoords(undefined);
      });
  };

  const handleLinkSubmission = () => {
    // if (lastSelection !== null) {
    if (currentUrl !== "") {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl(currentEditUrl));
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const parent = getSelectedNode(selection).getParent();
          if ($isAutoLinkNode(parent)) {
            const linkNode = $createLinkNode(parent.getURL(), {
              rel: parent.__rel,
              target: parent.__target,
              title: parent.__title,
            });
            parent.replace(linkNode, true);
          }
        }
      });
    }
    setCurrentUrl("https://");
    // setIsLinkEditMode(false);
    // }
  };

  const $handleSelectionChange = useCallback(() => {
    // if (
    //   // editor.isComposing() ||
    //   editor.getRootElement() !== document.activeElement
    // ) {
    //   setCoords(undefined);
    //   return;
    // }
    setCoords(undefined);
    const selection = $getSelection();

    if (
      $isRangeSelection(selection)
      // && !selection.anchor.is(selection.focus)
    ) {
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      const isLinkNode = $isLinkNode(parent) || $isLinkNode(node);
      if (isLinkNode) calculatePosition();
      else setCoords(undefined);
      return;
    }
    setCoords(undefined);
  }, [editor, calculatePosition]);

  useEffect(() => {
    setCurrentEditUrl(currentUrl);
  }, [currentUrl]);

  useEffect(() => {
    function $updateToolbar() {
      const selection = $getSelection();
      setCoords(undefined);

      if ($isRangeSelection(selection)) {
        const focusNode = getSelectedNode(selection);
        const focusLinkNode = $findMatchingParent(focusNode, $isLinkNode);
        const focusAutoLinkNode = $findMatchingParent(
          focusNode,
          $isAutoLinkNode
        );
        if (!(focusLinkNode || focusAutoLinkNode)) {
          setIsLink(false);
          setCoords(undefined);
          return;
        }
        const badNode = selection
          .getNodes()
          .filter((node) => !$isLineBreakNode(node))
          .find((node) => {
            const linkNode = $findMatchingParent(node, $isLinkNode);
            const autoLinkNode = $findMatchingParent(node, $isAutoLinkNode);
            return (
              (focusLinkNode && !focusLinkNode.is(linkNode)) ||
              (linkNode && !linkNode.is(focusLinkNode)) ||
              (focusAutoLinkNode && !focusAutoLinkNode.is(autoLinkNode)) ||
              (autoLinkNode &&
                (!autoLinkNode.is(focusAutoLinkNode) ||
                  autoLinkNode.getIsUnlinked()))
            );
          });
        if (!badNode) {
          setIsLink(true);
          setIsEditMode(false);
          if (focusLinkNode) {
            setCurrentUrl(focusLinkNode.getURL());
          } else if ($isLinkNode(focusNode)) {
            setCurrentUrl(focusNode.getURL());
          } else {
            setCurrentUrl("");
          }
          $handleSelectionChange();
        } else {
          setIsLink(false);
          setCoords(undefined);
        }
      }
    }
    return mergeRegister(
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload) => {
          $updateToolbar();
          // setActiveEditor(newEditor);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      editor.registerCommand(
        CLICK_COMMAND,
        (payload) => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const node = getSelectedNode(selection);
            const linkNode = $findMatchingParent(node, $isLinkNode);
            if ($isLinkNode(linkNode) && (payload.metaKey || payload.ctrlKey)) {
              window.open(linkNode.getURL(), "_blank");
              return true;
            }
          }
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, $handleSelectionChange]);

  return createPortal(
    <div
      className="flex border rounded-lg p-3 bg-[#fff] items-center gap-3"
      ref={ref}
      style={{
        position: "absolute",
        top: coords?.y,
        left: coords?.x,
        visibility: shouldShow ? "visible" : "hidden",
        opacity: shouldShow ? 1 : 0,
      }}>
      <Input
        disabled={!isEditMode}
        onChange={(e) => {
          setCurrentEditUrl(e.target.value);
        }}
        value={currentEditUrl}
        prefix={<LinkIcon size={10} />}
      />
      {isEditMode ? (
        <>
          <ButtonCustom
            onClick={() => {
              setCoords(undefined);
              setIsEditMode(false);
            }}>
            <IconCross />
          </ButtonCustom>
          <ButtonCustom
            onClick={() => {
              handleLinkSubmission();
              setIsEditMode(false);
            }}>
            <IconCheck />
          </ButtonCustom>
        </>
      ) : (
        <>
          <ButtonCustom onClick={() => setIsEditMode(true)}>
            <IconPencil />
          </ButtonCustom>
          <ButtonCustom
            onClick={() => {
              editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
              setIsEditMode(false);
            }}>
            <IconTrash />
          </ButtonCustom>
        </>
      )}
    </div>,
    document.querySelector(`#${EDITOR_CONTAINER_KEY}`) ?? document.body
  );
};

export default FloatingEditorPlugin;
