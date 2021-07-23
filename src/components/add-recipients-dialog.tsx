import { DatabaseOutline, PlusOutline } from "@graywolfai/react-heroicons";
import React from "react";
import { ReusableDialog, useModal } from "./dialog";
import { InputRecipientListDialog } from "./input-recipient-list-dialog";
import RecipientListPreview from "./recipient-list-preview";

interface FormData {
  identifier: string;
  ipAddress: string;
}

export function AddRecipientsDialog() {
  const modal = useModal();

  return (
    <>
      <div className="flex items-center justify-center">
        <button
          type="button"
          className="flex items-center justify-between w-full text-gray-100 bg-gray-900 border border-gray-700 rounded form-input"
          onClick={modal.openModal}
        >
          <span>Add Recipients</span>
          <PlusOutline className="w-5 h-5" />
        </button>
      </div>

      <ReusableDialog title="Add Recipients" {...modal}>
        <RecipientListPreview />
        <div className="flex flex-col pt-4 space-y-2">
          <InputRecipientListDialog />

          {/* <button
            type="button"
            className="flex items-center px-3 py-2 space-x-1 text-blue-800 border border-blue-700 rounded focus:ring-blue-600 focus:ring-2 focus:outline-none"
          >
            <DatabaseOutline className="flex-shrink-0 w-5 h-5" />
            <span className="text-left">From Excel</span>
          </button> */}
        </div>

        <div className="flex items-center pt-4 space-x-2">
          <button
            type="button"
            onClick={() => modal.closeModal()}
            className="inline-flex justify-center w-24 px-4 py-2 text-sm font-medium text-white bg-blue-700 border border-transparent rounded-md hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
          >
            Save
          </button>
          <button
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-900 border border-transparent rounded hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
            type="button"
            onClick={() => modal.closeModal()}
          >
            Cancel
          </button>
        </div>
      </ReusableDialog>
    </>
  );
}
