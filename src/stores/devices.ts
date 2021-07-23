import { Action, action, createContextStore, thunk, Thunk } from "easy-peasy";
import { Device } from "../types/device";
import { v4 as uuidv4 } from "uuid";

interface StoreModel {
  pcName: string;
  devices: Device[];
  getPCName: Action<StoreModel>;
  setDeviceName: Action<
    StoreModel,
    {
      id: string;
      name: string;
    }
  >;
  setDeviceStatus: Action<
    StoreModel,
    {
      id: string;
      status: Device["status"];
    }
  >;
  loadDevices: Action<StoreModel>;
  addDevice: Action<StoreModel, Device>;
  removeDevice: Action<StoreModel, string>;
  submitDevice: Thunk<
    StoreModel,
    {
      identifier: string;
      ipAddress: string;
    }
  >;
}

export const DeviceStores = createContextStore<StoreModel>({
  pcName: "Desktop",
  devices: [],
  getPCName: action((state) => {
    const local = localStorage.getItem("pcName");

    if (local) {
      state.pcName = local;
    }
  }),
  setDeviceStatus: action((state, payload) => {
    state.devices.find((d) => d.id === payload.id)?.status === payload.status;
  }),
  setDeviceName: action((state, payload) => {
    state.devices = state.devices.map((device) => ({
      ...device,
      identifier: payload.id === device.id ? payload.name : device.identifier,
    }));
    localStorage.setItem("devices", JSON.stringify(state.devices));
  }),
  loadDevices: action((state, payload) => {
    const local = localStorage.getItem("devices");

    if (local) {
      const devices = JSON.parse(local) as Device[];
      state.devices = devices.map((d) => ({
        ...d,
        status: "disconnected",
      }));
    }
  }),
  addDevice: action((state, payload) => {
    state.devices.push(payload);
    localStorage.setItem("devices", JSON.stringify(state.devices));
  }),
  removeDevice: action((state, payload) => {
    state.devices = state.devices.filter((i) => i.id !== payload);
    localStorage.setItem("devices", JSON.stringify(state.devices));
  }),
  submitDevice: thunk(async (actions, payload, { getState }) => {
    // if (getState().devices.find(d => d.ipAddress === payload.ipAddress)) {
    //   throw new Error("Device with corresponding IP address already exist")
    // }
    const deviceModel = await new Promise<string>((resolve, reject) => {
      const ws = new WebSocket(`ws://${payload.ipAddress}:8080/`);

      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            command: "query",
            data: {
              pcName: getState().pcName,
            },
          })
        );
      };

      ws.onmessage = (e) => {
        const jsonData = JSON.parse(e.data);

        console.log({
          jsonData,
        });
        if (jsonData["type"] === "query") {
          const deviceModel = jsonData["data"]["deviceModel"];
          resolve(deviceModel);
        }
      };

      ws.onerror = (e) => {
        reject(new Error("Cannot connect to corresponding device"));
      };
    });

    actions.addDevice({
      id: uuidv4(),
      identifier: payload.identifier ? payload.identifier : deviceModel,
      ipAddress: payload.ipAddress,
      model: deviceModel,
      status: "connected",
    });
  }),
});
