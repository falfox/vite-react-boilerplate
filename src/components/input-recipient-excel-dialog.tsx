import { PlusOutline, UploadSolid } from "@graywolfai/react-heroicons";
import clsx from "clsx";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { v4 } from "uuid";
import XLSX from "xlsx";
import { DeviceStores } from "../stores/devices";
import { RecipientStores } from "../stores/recipients";
import { ReusableDialog, useModal } from "./dialog";
import { Loader } from "./loader";

interface FormData {
  recipients: string;
}

export function InputRecipientExcelDialog() {
  const modal = useModal();

  const { register, handleSubmit, formState, setError, reset } =
    useForm<FormData>();
  const addRecipients = RecipientStores.useStoreActions(
    (actions) => actions.addRecipients
  );

  const { excelData, recipients } = RecipientStores.useStoreState(
    (state) => state
  );
  const { setExcelData, setPrimaryColumn } = RecipientStores.useStoreActions(
    (actions) => actions
  );

  const handleFile = (file: File) => {
    /* Boilerplate to set up FileReader */
    setExcelData({
      data: null,
      filename: "",
      primaryColumn: "",
    });
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    reader.onload = (e) => {
      /* Parse data */
      const bstr = e.target?.result;
      const wb = XLSX.read(bstr, { type: rABS ? "binary" : "array" });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws, {
        header: 1,
        blankrows: false,
      });
      const header = data[0];
      /* Update state */
      console.log({
        data,
        header,
      });
      setExcelData({
        data: data as string[][],
        filename: file.name,
        primaryColumn: "",
      });
    };
    if (rABS) reader.readAsBinaryString(file);
    else reader.readAsArrayBuffer(file);
  };

  async function onSubmit(data: FormData) {
    if (excelData.data == null) return;

    const headers = excelData.data[0];
    const [, ...rows] = excelData.data;
    const primaryHeaderIndex = headers.findIndex(
      (h) => h === excelData.primaryColumn
    );

    const formattedRecipients = rows.map((row) => ({
      name: v4(),
      number: row[primaryHeaderIndex].replace(/^\+/, ""),
      source: "excel" as const,
    }));

    console.log({
      formattedRecipients,
    });

    addRecipients(formattedRecipients);
    reset();
    modal.closeModal();
  }

  const headers = excelData?.data?.[0];
  const filename = excelData.filename;
  const primaryColumn = excelData.primaryColumn;

  return (
    <>
      <div className="flex items-center justify-center">
        <button
          type="button"
          className="flex items-center justify-between w-full text-gray-100 bg-gray-900 border border-gray-700 rounded form-input"
          onClick={modal.openModal}
        >
          <span>
            {recipients.length > 0
              ? `${recipients.length} Recipients`
              : "Upload Excel"}
          </span>
          <PlusOutline className="w-5 h-5" />
        </button>
      </div>
      <ReusableDialog title="Add Recipient from Excel" {...modal}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col pt-4 space-y-2">
            <span className="text-sm tracking-tight text-gray-600">
              Upload Excel File
            </span>
            <label className="flex items-center justify-center w-full px-3 py-3 space-x-2 font-medium text-blue-800 bg-gray-100 border border-gray-300 rounded focus:ring-blue-600 focus:ring-2 focus:outline-none">
              <UploadSolid className="flex-shrink-0 w-5 h-5" />
              <span className="text-sm">{filename ? filename : "Upload"}</span>
              <input
                type="file"
                name="excel"
                hidden
                id="excel"
                accept={SheetJSFT}
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files[0]) handleFile(files[0]);
                }}
              />
            </label>
            {headers ? (
              <div className="py-2">
                <span className="text-sm tracking-tight text-gray-600">
                  Select Recipient Column
                </span>
                <div className="-ml-2 space-x-2 space-y-2">
                  {headers.map((header) => (
                    <button
                      key={header}
                      type="button"
                      className={clsx(
                        "first:ml-2 inline-flex justify-center px-4 py-2 text-sm border rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500",
                        {
                          "bg-gray-600 text-gray-100 border-transparent":
                            primaryColumn === header,
                          "bg-white text-gray-800 border-gray-400 hover:text-gray-600 hover:border-transparent hover:bg-gray-200":
                            primaryColumn !== header,
                        }
                      )}
                      onClick={() => setPrimaryColumn(header)}
                    >
                      {header}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          <div className="flex items-center pt-4 space-x-2">
            <button
              disabled={formState.isSubmitting || !primaryColumn}
              type="submit"
              className={clsx(
                "inline-flex justify-center w-24 px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500",
                {
                  "bg-gray-400": formState.isSubmitting || !primaryColumn,
                  "bg-blue-700 hover:bg-blue-800":
                    !formState.isSubmitting && primaryColumn,
                }
              )}
            >
              {formState.isSubmitting ? <Loader /> : "Save"}
            </button>
            <button
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-900 border border-transparent rounded hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
              type="button"
              onClick={() => {
                modal.closeModal();
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </ReusableDialog>
    </>
  );
}

const SheetJSFT = [
  "xlsx",
  "xlsb",
  "xlsm",
  "xls",
  "xml",
  "csv",
  "txt",
  "ods",
  "fods",
  "uos",
  "sylk",
  "dif",
  "dbf",
  "prn",
  "qpw",
  "123",
  "wb*",
  "wq*",
  "html",
  "htm",
]
  .map(function (x) {
    return "." + x;
  })
  .join(",");
