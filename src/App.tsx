import React from "react";
import { QueryClient, useQuery } from "react-query";
import { Route, Switch } from "react-router";
import { getUser } from "./api/auth";
import { ProtectedRoute } from "./components/auth-guard";
import { Loader } from "./components/loader";
import "./index.css";
import ContactsPage from "./pages/contacts";
import LoginPage from "./pages/login";
import SenderPage from "./pages/sender";
import SubscribePage from "./pages/subscribe";
import { RecipientStores } from "./stores/recipients";

export const queryClient = new QueryClient();

function App() {
  const { data, status } = useQuery("user", getUser);

  return (
    <div className="w-full h-full min-h-screen font-sans text-white bg-gray-800">
      <Switch>
        <ProtectedRoute path="/sender">
          <RecipientStores.Provider>
            {status === "success" ? (
              data?.subscription !== null ? (
                <SenderPage />
              ) : (
                <SubscribePage />
              )
            ) : status === "loading" ? (
              <Loader />
            ) : null}
          </RecipientStores.Provider>
        </ProtectedRoute>
        <ProtectedRoute path="/contacts">
          <ContactsPage />
        </ProtectedRoute>
        <Route path="/login">
          <LoginPage />
        </Route>

        <Route path="/template">Template</Route>
      </Switch>
    </div>
  );
}

export default App;
