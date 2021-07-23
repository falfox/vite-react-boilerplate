import {
  ClipboardListOutline,
  TableOutline,
} from "@graywolfai/react-heroicons";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AddRecipientsDialog } from "../components/add-recipients-dialog";
import { InputRecipientExcelDialog } from "../components/input-recipient-excel-dialog";
import { InputRecipientListDialog } from "../components/input-recipient-list-dialog";
import { UserDropDown } from "../components/nav-header";
import RecipientListPreview from "../components/recipient-list-preview";
import { RecipientStores } from "../stores/recipients";
import { formatText } from "../utils/text";
import { AddDeviceDialog } from "./../components/add-device-dialog";
import { ComputerName } from "./../components/computer-name";
import { DeviceListItem } from "./../components/device-list-item";
import DeviceSelect from "./../components/device-select";
import { DeviceStores } from "./../stores/devices";

interface FormData {
  text: string;
  device: string;
}

function SenderPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    setError,
    clearErrors,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      text: "",
      device: "",
    },
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    register("device", {
      required: "Please select a device",
    });
  }, [register]);

  const { devices } = DeviceStores.useStoreState((state) => state);
  const { recipients, mode, excelData } = RecipientStores.useStoreState(
    (state) => state
  );
  const { setMode } = RecipientStores.useStoreActions((actions) => actions);
  const [progress, setProgress] = useState("");

  async function onSubmit(data: FormData) {
    clearErrors();
    const device = devices.find((d) => d.id === data.device);
    console.log({
      device,
    });

    if (!device || device.status !== "connected") {
      setError("device", {
        type: "manual",
        message: "Device is not connected",
      });
      return;
    }
    if (mode === "list") {
      for (const recipient of recipients) {
        await new Promise((r) => setTimeout(r, 1000));

        PubSub.publish(data.device, {
          recipient: recipient.number,
          text: data.text,
        });
      }
    } else {
      if (excelData.data == null || !excelData.data?.[0]) return;

      const mapping = {} as { [key: string]: number };

      let i = 0;
      for (const header of excelData.data[0]) {
        mapping[header] = i;
        i++;
      }

      let j = 0;
      for (const recipient of recipients) {
        setProgress(`Sending ${j}/${recipients.length}`);
        console.log({
          recipient,
        });

        const text = formatText(
          data.text,
          {
            mapping,
            data: excelData.data,
          },
          j
        );
        await new Promise((r) => setTimeout(r, 1000));
        j++;
        setProgress(`Sending ${j}/${recipients.length}`);

        console.log({
          text,
        });

        PubSub.publish(data.device, {
          recipient: recipient.number,
          text: text,
        });
      }
    }
  }

  return (
    <main className="flex flex-col max-w-sm min-h-screen mx-auto">
      <div className="py-10">
        <UserDropDown />
        {/* <ComputerName /> */}
        <div className="py-2"></div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-400 uppercase ">
            Devices
          </h3>
          <AddDeviceDialog />
        </div>
        <ul className="border border-gray-600 divide-y divide-gray-600 rounded">
          {devices.length > 0 ? (
            devices.map((device, i) => (
              <DeviceListItem key={i} device={device} />
            ))
          ) : (
            <div className="py-10 text-sm text-center">No Devices found</div>
          )}
        </ul>
      </div>
      <form
        className="w-full max-w-sm mx-auto mt-6 space-y-3 text-gray-900"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <span className="block pb-1 text-sm font-semibold text-gray-400">
            Recipient
          </span>
          <div className="flex items-center pb-2 space-x-3">
            <button
              type="button"
              className={clsx(
                "flex items-center justify-center w-full px-3 py-3 space-x-1 border border-gray-700 rounded focus:ring-blue-600 focus:ring-2 focus:outline-none",
                {
                  "text-gray-900 bg-gray-100": mode === "list",
                  "text-gray-100 bg-gray-900": mode !== "list",
                }
              )}
              onClick={() => setMode("list")}
            >
              <ClipboardListOutline className="flex-shrink-0 w-5 h-5 text-current" />
              <span className="text-sm">List</span>
            </button>
            <button
              type="button"
              className={clsx(
                "flex items-center justify-center w-full px-3 py-3 space-x-1 border border-gray-700 rounded focus:ring-blue-600 focus:ring-2 focus:outline-none",
                {
                  "text-gray-900 bg-gray-100": mode === "excel",
                  "text-gray-100 bg-gray-900": mode !== "excel",
                }
              )}
              onClick={() => setMode("excel")}
            >
              <TableOutline className="flex-shrink-0 w-5 h-5 text-current" />
              <span className="text-sm">Excel</span>
            </button>
          </div>

          {/* <AddRecipientsDialog /> */}
          {/* <RecipientListPreview /> */}
          {mode === "list" ? (
            <InputRecipientListDialog />
          ) : (
            <InputRecipientExcelDialog />
          )}
        </div>
        <div>
          <span className="block pb-1 text-sm font-semibold text-gray-400">
            Text
          </span>
          {mode === "excel" && excelData.data != null && (
            <div className="pb-4 space-y-3">
              <div className="px-3 py-2 text-sm text-gray-100 bg-gray-700 border border-gray-600 rounded">
                Use{" "}
                <span className="text-sm font-medium text-blue-400">
                  {` <<<`}variable name{`>>>`}
                </span>{" "}
                in message input to use it dynamically according to excel data
              </div>
              <div className="inline-flex flex-wrap items-center space-x-2">
                <div className="flex-shrink-0 text-sm text-white">
                  Available variables:
                </div>
                {excelData.data?.[0].map((header) => (
                  <span className="inline-flex justify-center px-2 py-1 text-sm text-white border rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500">
                    {header}
                  </span>
                ))}
              </div>
            </div>
          )}
          <textarea
            className="w-full text-gray-100 bg-gray-900 border border-gray-700 form-input"
            placeholder="Message to send"
            rows={5}
            {...register("text", {
              required: "Text cannot be empty",
              maxLength: {
                value: 160,
                message: "Text cannot be longer than 160 characters",
              },
            })}
          />
          {errors.text && (
            <div className="pt-1 text-red-300">{errors.text?.message}</div>
          )}
        </div>
        <div>
          <span className="block pb-1 text-sm font-semibold text-gray-400">
            Device
          </span>
          <DeviceSelect
            onChange={(device) => {
              setValue("device", device.id);
            }}
            selected={devices.find((d) => d.id === watch("device"))}
          />
          {errors.device && (
            <div className="pt-1 text-red-300">{errors.device?.message}</div>
          )}
        </div>
        <div className="text-center">
          <button
            disabled={isSubmitting}
            type="submit"
            className={clsx(
              "px-4 py-2 text-lg font-semibold text-white rounded-md w-full flex items-center justify-center",
              {
                "bg-blue-600": !isSubmitting,
                "bg-gray-500 cursor-not-allowed": isSubmitting,
              }
            )}
          >
            {isSubmitting ? progress : "Send"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default SenderPage;
