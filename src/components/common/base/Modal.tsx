import React from "react";
import { ExclamationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";

import Button from "./Button";

type ModalProp = {
  content: string;
  proceedLabel: string;
  cancelLabel: string;
  proceedHandler?: () => void;
  closeModal?: () => void;
};

const Modal = (props: ModalProp) => {
  const { content, proceedLabel, cancelLabel, proceedHandler, closeModal } =
    props;

  return (
    <div className="fixed left-0 right-0 top-0 z-10 flex h-screen w-full items-center justify-center bg-gray-600/50">
      <div className="relative max-h-full w-full max-w-md">
        <div className="relative rounded-lg bg-white shadow">
          <button
            type="button"
            className="absolute right-2.5 top-3 ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
            data-modal-hide="popup-modal"
            onClick={closeModal}
          >
            <XMarkIcon className="h-5 w-5" />
            <span className="sr-only">Close modal</span>
          </button>
          <div className="p-6 text-center">
            <ExclamationCircleIcon className="mx-auto mb-4 h-14 w-14 text-gray-400" />
            <p className="mb-5 text-base font-normal text-gray-500 dark:text-gray-400">
              {content}
            </p>
            <div className="flex items-center justify-center gap-20">
              <Button
                content={cancelLabel}
                type="button"
                className="rounded-md border border-gray-200 bg-gray-100 text-sm text-gray-500 hover:bg-gray-200 hover:text-gray-900 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200"
                onClick={closeModal}
              />
              <Button
                content={proceedLabel}
                type="button"
                className="rounded-md bg-red-600 text-sm text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800"
                onClick={proceedHandler}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
