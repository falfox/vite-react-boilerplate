import { Dialog, Transition } from "@headlessui/react";
import clsx from "clsx";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { DeviceStores } from "../stores/devices";
import { Loader } from "./loader";

interface FormData {
  pcName: string;
}

export function ChangeComputerNameDialog() {
  const [open, setOpen] = useState(false);
  const cancelButtonRef = useRef(null);

  const { pcName } = DeviceStores.useStoreState((state) => state);

  const { register, handleSubmit, formState, reset } = useForm<FormData>({
    defaultValues: {
      pcName,
    },
  });

  function closeModal() {
    setOpen(false);
    reset();
  }

  function openModal() {
    setOpen(true);
  }

  async function onSubmit(data: FormData) {
    console.log({
      data,
    });

    closeModal();
  }

  useEffect(() => {
    reset({
      pcName,
    });
  }, [pcName]);

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="flex items-center space-x-2"
      >
        <span className="flex items-center text-xs font-medium leading-5 text-blue-500 uppercase">
          Change
        </span>
        <span className="text-sm leading-5">{pcName}</span>
      </button>
      <Transition show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          initialFocus={cancelButtonRef}
          static
          open={open}
          onClose={closeModal}
        >
          <div className="min-h-screen px-4 text-center">
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-10 backdrop-filter backdrop-blur" />

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl">
                <div className="flex items-center justify-between">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Change Computer Name
                  </Dialog.Title>
                </div>
                <form
                  className="mt-4 space-y-3"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div>
                    <label
                      htmlFor="pcName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Name
                    </label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                      <input
                        type="text"
                        id="pcName"
                        className="block w-full border-gray-300 form-input"
                        placeholder="Desktop"
                        autoComplete="off"
                        {...register("pcName", {
                          required: "Computer name is required",
                        })}
                      />
                    </div>
                    <span className="block h-4 py-1 text-sm text-red-500">
                      {formState.errors.pcName &&
                        formState.errors.pcName.message}
                    </span>
                  </div>
                  <div className="flex items-center pt-4 space-x-2">
                    <button
                      disabled={formState.isSubmitting}
                      type="submit"
                      className={clsx(
                        "inline-flex justify-center w-24 px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500",
                        {
                          "bg-blue-500": formState.isSubmitting,
                          "bg-blue-700": !formState.isSubmitting,
                        }
                      )}
                    >
                      {formState.isSubmitting ? <Loader /> : "Save"}
                    </button>
                    <button
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-900 border border-transparent rounded hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                      type="button"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export function ComputerName() {
  const { pcName } = DeviceStores.useStoreState((state) => state);

  return (
    <div className="flex items-center justify-between px-3 py-2 border border-gray-600 rounded">
      <div className="flex items-center space-x-1 text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z"
            clipRule="evenodd"
          />
        </svg>
        <p className="text-sm font-semibold uppercase">PC Name</p>
      </div>
      <ChangeComputerNameDialog />
    </div>
  );
}
