import React, { useState } from "react";
import {
  PlusCircleOutline,
  PlusOutline,
  PlusSolid,
  UserCircleSolid,
} from "@graywolfai/react-heroicons";

function ContactsPage() {
  const [list, setList] = useState([1, 2]);
  return (
    <main>
      <div className="max-w-sm mx-auto">
        <button
          type="button"
          className="flex items-center justify-center w-full px-3 py-3 space-x-2 font-semibold bg-blue-600 rounded"
        >
          <PlusCircleOutline className="w-5 h-5" />
          <span className="text-base">Create a New List</span>
        </button>

        <div className="py-4"></div>
        <div className="border border-gray-600 divide-y divide-gray-600 rounded">
          {list.length > 0 ? (
            list.map((l, i) => (
              <div className="flex items-center px-3 py-2 space-x-4" key={i}>
                <span>List Name</span>
                <div className="flex items-center space-x-1 text-sm font-medium text-gray-400">
                  <UserCircleSolid className="w-5 h-5" />
                  <span className="text-sm">123</span>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-20 text-sm font-medium text-gray-400">
              You have no contact list
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default ContactsPage;
