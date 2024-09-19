import React, { useContext, useState } from "react";
import DialogCustom from "../commons/DialogCustom";

interface DialogContextValue {
  isOpen: boolean;
  openDialog: (content: React.ReactNode) => void;
  closeDialog: () => void;
}

interface Props {
  children: React.ReactNode;
}

const initialVal = {
  isOpen: false,
  openDialog: () => {},
  closeDialog: () => {},
};

const DialogContext = React.createContext<DialogContextValue>(initialVal);

export const DialogProvider = (props: Props) => {
  const { children } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<React.ReactNode>(null);

  const toggleModal = () => setIsOpen((pre) => !pre);
  const openDialog = (content: React.ReactNode) => {
    setIsOpen(true);
    setContent(content);
  };

  const closeDialog = () => setIsOpen(false);

  return (
    <DialogContext.Provider value={{ isOpen, openDialog, closeDialog }}>
      <>
        {children}
        <DialogCustom isOpen={isOpen} toggleModal={toggleModal}>
          {content}
        </DialogCustom>
      </>
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const value = useContext(DialogContext);
  return value;
};
