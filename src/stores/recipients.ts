import {
  Action,
  action,
  computed,
  Computed,
  createContextStore,
} from "easy-peasy";
import { Recipient } from "../types/recipients";

interface RecipientsModel {
  mode: "list" | "excel";
  setMode: Action<RecipientsModel, RecipientsModel["mode"]>;
  excelData: {
    filename: string;
    data: string[][] | null;
    primaryColumn: string;
  };
  setExcelData: Action<RecipientsModel, RecipientsModel["excelData"]>;
  setPrimaryColumn: Action<RecipientsModel, string>;
  recipients: Recipient[];
  addRecipients: Action<RecipientsModel, Recipient[]>;
  deleteRecipientBySource: Action<RecipientsModel, Recipient["source"]>;
  groupedRecipients: Computed<
    RecipientsModel,
    {
      [key in Recipient["source"]]: Recipient[];
    }
  >;
}

export const RecipientStores = createContextStore<RecipientsModel>({
  mode: "list",
  setMode: action((state, payload) => {
    state.mode = payload;
    state.excelData = {
      data: null,
      filename: "",
      primaryColumn: ""
    }
    state.recipients = []
  }),
  excelData: {
    data: null,
    filename: "",
    primaryColumn: "",
  },
  setExcelData: action((state, payload) => {
    state.excelData = payload;
  }),
  setPrimaryColumn: action((state, payload) => {
    state.excelData.primaryColumn = payload;
  }),
  recipients: [],
  addRecipients: action((state, payload) => {
    state.recipients = [...state.recipients, ...payload];
  }),
  deleteRecipientBySource: action((state, payload) => {
    state.recipients = state.recipients.filter((r) => r.source !== payload);
  }),
  groupedRecipients: computed((state) =>
    state.recipients.reduce(
      (acc, cur) => ({
        ...acc,
        [cur.source]: [...acc[cur.source], cur],
      }),
      {
        list: [],
        excel: [],
      }
    )
  ),
});
