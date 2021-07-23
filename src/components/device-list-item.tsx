import clsx from "clsx";
import PubSub from "pubsub-js";
import React, { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ReconnectingWebSocket from "reconnecting-websocket";
import { DeviceStores } from "../stores/devices";
import { Device } from "../types/device";
import { ReusableDialog, useModal } from "./dialog";

interface FormData {
  identifier: string;
}
function UpdateDeviceDialog({
  children,
  device,
}: {
  children: ReactNode;
  device: Device;
}) {
  const { removeDevice, setDeviceName } = DeviceStores.useStoreActions(
    (actions) => actions
  );
  const { register, handleSubmit, formState, setError, reset } =
    useForm<FormData>({
      defaultValues: {
        identifier: device.identifier,
      },
    });

  const modal = useModal();

  async function onSubmit(data: FormData) {
    console.log({
      data,
    });

    update({
      id: device.id,
      name: data.identifier,
    });

    modal.closeModal();
  }

  function update(values: { id: string; name: string }) {
    setDeviceName(values);
  }

  function destroy(id: string) {
    removeDevice(id);
  }

  return (
    <>
      <button
        type="button"
        onClick={modal.openModal}
        className="block w-full focus:outline-none"
      >
        {children}
      </button>
      <ReusableDialog title="Update Device" {...modal}>
        <form className="mt-4 space-y-3" onSubmit={handleSubmit(onSubmit)}>
          {/* <div>
            <label
              htmlFor="id"
              className="block text-sm font-medium text-gray-700"
            >
              ID
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <input
                type="text"
                id="id"
                className="block w-full text-gray-400 bg-gray-100 border-gray-300 form-input"
                placeholder="id"
                disabled={true}
                autoComplete="off"
                value={device.id}
              />
            </div>
            {formState.errors.identifier && (
              <span className="py-1 text-sm text-red-500">
                {formState.errors.identifier.message}
              </span>
            )}
          </div> */}
          <div>
            <label
              htmlFor="id"
              className="block text-sm font-medium text-gray-700"
            >
              Status
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <input
                type="text"
                id="status"
                className="block w-full text-gray-400 bg-gray-100 border-gray-300 form-input"
                placeholder="status"
                disabled={true}
                autoComplete="off"
                value={device.status}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="id"
              className="block text-sm font-medium text-gray-700"
            >
              Model
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <input
                type="text"
                id="model"
                className="block w-full text-gray-400 bg-gray-100 border-gray-300 form-input"
                placeholder="id"
                disabled={true}
                autoComplete="off"
                value={device.model}
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
          <div className="flex items-center justify-between pt-4 space-x-2">
            <div className="space-x-2">
              <button
                type="submit"
                className={clsx(
                  "inline-flex justify-center w-24 px-4 py-2 text-sm font-medium text-white border border-transparent bg-blue-700 rounded-md hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                )}
              >
                Save
              </button>
              <button
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-900 border border-transparent rounded hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                type="button"
                onClick={modal.closeModal}
              >
                Cancel
              </button>
            </div>
            <button
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-red-600 border border-transparent rounded hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
              type="button"
              onClick={() => {
                if (
                  window.confirm("Are you sure you want to delete this device?")
                ) {
                  destroy(device.id);
                }
              }}
            >
              Delete
            </button>
          </div>
        </form>
      </ReusableDialog>
    </>
  );
}

export function DeviceListItem({ device }: { device: Device }) {
  const [status, setStatus] = useState<Device["status"]>("connecting");
  const pcName = DeviceStores.useStoreState((state) => state.pcName);
  const { setDeviceStatus } = DeviceStores.useStoreActions(
    (actions) => actions
  );

  useEffect(() => {
    let ws = new ReconnectingWebSocket(`ws:/${device.ipAddress}:8080/`);

    ws.onopen = () => {
      console.log(`Device ${device.identifier} connected`);
      ws.send(
        JSON.stringify({
          command: "query",
          data: {
            pcName: pcName,
          },
        })
      );
    };

    ws.onmessage = (e) => {
      const jsonData = JSON.parse(e.data);

      console.log({
        jsonData,
      });
    };

    ws.onclose = () => {
      console.log(`Device ${device.identifier} disconnected`);
    };

    ws.onerror = (e) => {
      console.log({
        e,
      });
    };

    const pubsubToken = PubSub.subscribe(
      device.id,
      (
        msg: string,
        data: {
          recipient: string;
          text: string;
        }
      ) => {
        if (ws.readyState === WebSocket.OPEN) {
          console.log({
            msg,
            data,
          });

          if (data)
            ws.send(
              JSON.stringify({
                command: "send",
                data: {
                  recipient: data["recipient"],
                  text: data["text"],
                },
              })
            );
        }
      }
    );

    const interval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        setStatus("connected");
      } else if (ws.readyState === WebSocket.CONNECTING) {
        setStatus("connecting");
      } else if (ws.readyState === WebSocket.CLOSED) {
        setStatus("disconnected");
      }
    }, 500);

    return () => {
      ws.close();
      PubSub.unsubscribe(pubsubToken);
      clearInterval(interval);
    };
  }, [pcName]);

  useEffect(() => {
    setDeviceStatus({
      id: device.id,
      status,
    });
  }, [status]);

  return (
    <li className="px-3 py-2">
      <UpdateDeviceDialog device={device}>
        <div className="flex items-center justify-between">
          <span>{device.identifier}</span>
          <div
            className={clsx("w-3 h-3 rounded-full", {
              "bg-green-400": status === "connected",
              "bg-red-500": status === "disconnected",
              "bg-yellow-500": status === "connecting",
            })}
            title={status}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <div className="flex items-center -ml-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>

            <span className="text-xs">{device.model}</span>
          </div>
          <span className="text-xs">{device.ipAddress}</span>
        </div>
      </UpdateDeviceDialog>
    </li>
  );
}
