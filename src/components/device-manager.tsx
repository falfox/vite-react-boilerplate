import React, { ReactNode, useEffect } from "react";
import { DeviceStores } from "../stores/devices";

export function DeviceManager({ children }: { children: ReactNode }) {
  const { loadDevices, getPCName } = DeviceStores.useStoreActions(
    (actions) => actions
  );

  useEffect(() => {
    loadDevices();
    getPCName();
  }, []);

  return <>{children}</>;
}
