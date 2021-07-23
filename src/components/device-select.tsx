import { Listbox, Transition } from "@headlessui/react";
import clsx from "clsx";
import React, { Fragment } from "react";
import { DeviceStores } from "../stores/devices";
import { Device } from "../types/device";

export default function DeviceSelect({
  selected,
  onChange,
}: {
  onChange: (selected: Device) => void;
  selected?: Device;
}) {
  const { devices } = DeviceStores.useStoreState((state) => state);

  return (
    <Listbox value={selected} onChange={onChange}>
      {({ open }) => (
        <>
          <div className="relative">
            <Listbox.Button
              className={clsx(
                "relative w-full py-2 pl-3 pr-10 text-left text-gray-100 border-gray-700 bg-gray-900 border rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-indigo-500 focus-visible:border-indigo-500"
              )}
            >
              <span className="block truncate">
                {selected?.identifier ?? "Select Device"}
              </span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-5 h-5 text-gray-400"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                  />
                </svg>
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options
                static
                className="absolute w-full py-1 mt-1 overflow-auto text-base bg-gray-900 border border-gray-700 rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
              >
                {devices.map((device, personIdx) => (
                  <Listbox.Option
                    key={personIdx}
                    className={({ active }) =>
                      `${active ? "text-gray-100 bg-gray-700" : "text-gray-400"}
                          cursor-default select-none relative py-2 pl-4 pr-4`
                    }
                    value={device}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`${
                            selected ? "font-medium" : "font-normal"
                          } block truncate`}
                        >
                          {device.identifier}
                        </span>
                        {selected ? (
                          <span
                            className={`${
                              active ? "text-white" : "text-gray-400"
                            }
                                absolute inset-y-0 right-0 flex items-center pr-3`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              className="w-5 h-5"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
