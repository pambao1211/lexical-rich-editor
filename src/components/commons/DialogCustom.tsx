/* eslint-disable */

import { twMerge } from "tailwind-merge";
import { Dialog, DialogContent } from "../shadcn-ui-kit/Dialog";
import React from "react";
import { X } from "lucide-react";

interface Props {
  isOpen: boolean;
  toggleModal: () => void;
  children: React.ReactNode;
  className?: string;
  bgImage?: string;
  backgroundOverClay?: string;
  textColor?: string;
}

const DialogCustom = ({
  isOpen,
  toggleModal,
  children,
  className,
  bgImage,
  textColor,
}: Props) => {
  return (
    <Dialog open={isOpen} onOpenChange={toggleModal}>
      <DialogContent
        className={twMerge("w-fit bg-cover p-10 lg:max-w-screen-xl", className)}
        style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="absolute inset-0 -z-10 bg-[#fff]" />
        <button
          onClick={toggleModal}
          className="absolute right-2 top-2 z-10 scale-75 lg:right-4 lg:top-4 lg:scale-100">
          <X
            className={twMerge(
              "h-4 w-4 scale-150 focus:border-0 focus:outline-none",
              textColor
            )}
          />
        </button>
        {children}
      </DialogContent>
    </Dialog>
  );
};
export default DialogCustom;
