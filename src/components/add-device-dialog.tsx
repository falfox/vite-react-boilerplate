import clsx from "clsx";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { DeviceStores } from "../stores/devices";
import { ReusableDialog } from "./dialog";
import { Loader } from "./loader";
import { useModal } from "../components/dialog";

interface FormData {
  identifier: string;
  ipAddress: string;
}

export function AddDeviceDialog() {
  const {
    register,
    handleSubmit,
    formState,
    setError,
    reset,
  } = useForm<FormData>();
  const submitDevice = DeviceStores.useStoreActions(
    (actions) => actions.submitDevice
  );

  const modal = useModal();

  async function onSubmit(data: FormData) {
    console.log({
      data,
    });

    try {
      await submitDevice({
        ipAddress: data.ipAddress,
        identifier: data.identifier,
      });
      reset();
      modal.closeModal();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log({
          error,
        });

        if (/network error/i.test(error.message)) {
          setError("ipAddress", {
            type: "manual",
            message: "Device network unreachable",
            shouldFocus: true,
          });
        } else if (/ip address already exist/i.test(error.message)) {
          setError("ipAddress", {
            type: "manual",
            message: error.message,
            shouldFocus: true,
          });
        } else {
          setError("ipAddress", {
            type: "manual",
            message: "Cannot connect to corresponding device",
            shouldFocus: true,
          });
        }
      }
    }
  }

  return (
    <>
      <div className="flex items-center justify-center">
        <button
          type="button"
          onClick={modal.openModal}
          className="py-2 text-sm font-medium text-white rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        >
          Add Device
        </button>
      </div>
      <ReusableDialog title="Add Device" {...modal}>
        <form className="mt-4 space-y-3" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label
              htmlFor="identifier"
              className="block text-sm font-medium text-gray-700"
            >
              Name
              <span className="pl-1 font-normal text-gray-500">(Optional)</span>
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <input
                type="text"
                id="identifier"
                className="block w-full border-gray-300 form-input"
                placeholder="Name"
                autoComplete="off"
                {...register("identifier")}
              />
            </div>
            {formState.errors.identifier && (
              <span className="py-1 text-sm text-red-500">
                {formState.errors.identifier.message}
              </span>
            )}
          </div>
          <div>
            <label
              htmlFor="ipAddress"
              className="block text-sm font-medium text-gray-700"
            >
              IP Address
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <input
                type="text"
                id="ipAddress"
                className="block w-full border-gray-300 form-input"
                placeholder="192.168.1.8"
                {...register("ipAddress", { required: true })}
              />
            </div>
            <span className="block h-4 py-1 text-sm text-red-500">
              {formState.errors.ipAddress && formState.errors.ipAddress.message}
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
              {formState.isSubmitting ? <Loader /> : "Add"}
            </button>
            <button
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-900 border border-transparent rounded hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
              type="button"
              onClick={modal.closeModal}
            >
              Cancel
            </button>
          </div>
        </form>
      </ReusableDialog>
    </>
  );
}
