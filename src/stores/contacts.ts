import { Action, action, createContextStore, thunk, Thunk } from "easy-peasy";
import { Contact, ContactList } from "../types/contact";
import { v4 as uuidv4 } from "uuid";

interface StoreModel {
  contacts: ContactList[];
}

export const DeviceStores = createContextStore<StoreModel>({
  contacts: [],
});
