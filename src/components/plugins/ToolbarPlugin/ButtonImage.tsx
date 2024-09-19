import { useState } from "react";
import { INSERT_IMAGE_COMMAND } from "../ImagePlugin";
import IconImage from "../../icons/IconImage";
import ButtonCustom from "../../commons/ButtonCustom";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

const ButtonImage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editor] = useLexicalComposerContext();

  const toggleModal = () => setIsModalOpen((pre) => !pre);

  return (
    <>
      <UiModal
        maskClosable={true}
        closable={false}
        footer={null}
        open={isModalOpen}></UiModal>
      <ButtonCustom
        onClick={() => {
          toggleModal();
          editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
            src: "https://storage.googleapis.com/assets-fygito/elle/studio-b/ELLE%20%20Logo%202.png",
          });
        }}>
        <IconImage />
      </ButtonCustom>
    </>
  );
};

export default ButtonImage;
