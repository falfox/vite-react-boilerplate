import {
  ChatAltOutline,
  CodeOutline,
  GlobeAltOutline,
  HomeOutline,
  LogoutOutline,
  ReceiptTaxOutline,
  UserCircleOutline,
} from "@graywolfai/react-heroicons";
import { Menu, Transition } from "@headlessui/react";
import clsx from "clsx";
import React, { Fragment } from "react";
import { Link, NavLink, useHistory } from "react-router-dom";
import { AuthStores } from "../stores/auth";

export function UserDropDown() {
  const history = useHistory();
  const { name } = AuthStores.useStoreState((state) => state);
  const { logout } = AuthStores.useStoreActions((actions) => actions);

  const onLogout = async () => {
    logout();
    history.push("/login");
  };

  if (!name) return null;

  return (
    <div className="flex items-center justify-end py-4 space-x-3">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 overflow-hidden bg-white rounded-full shadow">
              <img
                src={`https://i0.wp.com/ui-avatars.com/api/${name}?ssl=1`}
                alt={name}
                className="object-cover"
              />
            </div>
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-50 w-64 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="flex items-center px-4 py-3 space-x-2">
              <div className="flex items-center justify-center w-8 h-8 overflow-hidden bg-white rounded-full">
                <img
                  src={`https://i0.wp.com/ui-avatars.com/api/${name}?ssl=1`}
                  alt={name}
                  className="object-cover"
                />
              </div>
              <span className="font-medium text-gray-800">{name}</span>
            </div>
            <div className="px-2 py-2 space-y-2">
              <Menu.Item>
                {({ active }) => (
                  <button
                    type="button"
                    onClick={onLogout}
                    className={clsx(
                      "px-2 py-2 flex text-black w-full rounded space-x-2",
                      {
                        "bg-gray-200": active,
                      }
                    )}
                  >
                    <div className="flex justify-center w-8">
                      <LogoutOutline className="w-5 h-5 text-gray-600" />
                    </div>
                    <span className="text-sm">Logout</span>
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}

export function NavHeader() {
  return (
    <header className="max-w-sm mx-auto space-y-4">
      <UserDropDown />

      <div className="grid max-w-sm grid-cols-2 gap-4 py-4 mx-auto">
        <NavLink
          to="/"
          exact={true}
          type="button"
          className="flex flex-col items-center justify-center h-20 space-y-1 font-semibold text-white border border-gray-700 rounded"
          activeClassName="bg-gray-600"
        >
          <ChatAltOutline className="w-5 h-5" />
          <span className="text-sm">Sender</span>
        </NavLink>
        <NavLink
          to="/integration"
          type="button"
          className="flex flex-col items-center justify-center h-20 space-y-1 font-semibold text-white border border-gray-700 rounded"
          activeClassName="bg-gray-600"
        >
          <CodeOutline className="w-5 h-5" />
          <span className="text-sm">Integration</span>
        </NavLink>
        {/* <NavLink
		to="/templates"
		type="button"
		className="flex flex-col items-center justify-center h-20 space-y-1 font-semibold text-white border border-gray-700 rounded"
		activeClassName="bg-gray-600"
	  >
		<DocumentTextOutline className="w-5 h-5" />
		<span className="text-sm">Templates</span>
	  </NavLink> */}
      </div>
    </header>
  );
}
