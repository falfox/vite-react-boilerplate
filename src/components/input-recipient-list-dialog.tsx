import { ClipboardListOutline, PlusOutline } from "@graywolfai/react-heroicons";
import clsx from "clsx";
import React from "react";
import { useForm } from "react-hook-form";
import { RecipientStores } from "../stores/recipients";
import { ReusableDialog, useModal } from "./dialog";
import { Loader } from "./loader";
import { v4 as uuidv4, v4 } from "uuid";

interface FormData {
  recipients: string;
}

export function InputRecipientListDialog() {
  const modal = useModal();

  const { register, handleSubmit, formState, setError, reset } =
    useForm<FormData>();
  const { recipients } = RecipientStores.useStoreState((state) => state);
  const addRecipients = RecipientStores.useStoreActions(
    (actions) => actions.addRecipients
  );

  async function onSubmit(data: FormData) {
    const formattedRecipients = data.recipients
      .split(/\r?\n/)
      .filter((t) => Boolean(t.trim()))
      .map((text) => ({
        name: v4(),
        number: text,
        source: "list" as const,
      }));

    console.log({
      formattedRecipients,
    });

    addRecipients(formattedRecipients);
    reset();
    modal.closeModal();
  }

  return (
    <>
      <div className="flex items-center justify-center">
        <button
          type="button"
          className="flex items-center justify-between w-full text-gray-100 bg-gray-900 border border-gray-700 rounded form-input"
          onClick={modal.openModal}
        >
          <span>
            {recipients?.length > 0
              ? `${recipients.length} Recipients`
              : "Edit List"}
          </span>
          <PlusOutline className="w-5 h-5" />
        </button>
      </div>
      <ReusableDialog title="Add Recipient from List" {...modal}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col pt-4 space-y-2">
            <textarea
              className="form-input"
              rows={10}
              {...register("recipients", {
                required: true,
              })}
            />
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
