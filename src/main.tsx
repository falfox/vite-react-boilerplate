import React from "react";
import ReactDOM from "react-dom";
import { MemoryRouter } from "react-router-dom";
import App, { queryClient } from "./App";
import { DeviceManager } from "./components/device-manager";
import "./index.css";
import { AuthStores } from "./stores/auth";
import { DeviceStores } from "./stores/devices";
import { QueryClientProvider } from "react-query";

ReactDOM.render(
  <React.StrictMode>
    <MemoryRouter initialEntries={["/sender"]}>
      <AuthStores.Provider>
        <DeviceStores.Provider>
          <DeviceManager>
            <QueryClientProvider client={queryClient}>
              <App />
            </QueryClientProvider>
          </DeviceManager>
        </DeviceStores.Provider>
      </AuthStores.Provider>
    </MemoryRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
