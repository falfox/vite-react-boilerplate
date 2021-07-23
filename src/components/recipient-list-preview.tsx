import { XOutline } from "@graywolfai/react-heroicons";
import React from "react";
import { RecipientStores } from "../stores/recipients";
import { Recipient } from "../types/recipients";

export default function RecipientListPreview() {
  const recipients = RecipientStores.useStoreState(
    (state) => state.groupedRecipients
  );
  const deleteRecipientBySource = RecipientStores.useStoreActions(
    (actions) => actions.deleteRecipientBySource
  );
  return (
    <div className="flex items-center pt-4 space-x-2">
      {Object.entries(recipients).map(([key, value]) =>
        value.length > 0 ? (
          <div
            className="flex items-center flex-shrink-0 px-2 py-1 space-x-2 bg-purple-100 border border-purple-500 rounded-full shadow-md"
            key={key}
          >
            <span className="inline-block px-2 py-1 text-xs text-white bg-purple-600 rounded-full">
              {value.length}
            </span>
            <span className="text-sm font-medium capitalize">{key}</span>
            <button
              type="button"
              onClick={() => {
                if (
                  window.confirm(
                    `Are you sure want to delete ${value.length} ${key} recipient?`
                  )
                ) {
                  deleteRecipientBySource(key as Recipient["source"]);
                }
              }}
              className="mr-1"
            >
              <XOutline className="w-4 h-4 text-purple-600" />
            </button>
          </div>
        ) : null
      )}
    </div>
  );
}
