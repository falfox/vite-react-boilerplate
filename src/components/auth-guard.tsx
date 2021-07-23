import React from "react";
import { ReactNode, useEffect, useState } from "react";
import { Route, RouteProps, useHistory } from "react-router-dom";
import { getUser } from "../api/auth";
import { AuthStores } from "../stores/auth";
import { Loader } from "./loader";

export function AuthContext({ children }: { children: ReactNode }) {
  const history = useHistory();
  const [fetched, setFetched] = useState(false);
  const { token } = AuthStores.useStoreState((state) => state);
  const { setUserData } = AuthStores.useStoreActions((actions) => actions);

  useEffect(() => {
    (async function () {
      try {
        const user = await getUser();
        setUserData({
          name: user.name,
          userId: user.id,
          email: user.email,
          subscription: user.subscription,
        });
      } catch (error) {
        console.log({
          error,
        });
        history.push("/login");
      } finally {
        setFetched(true);
      }
    })();
  }, []);

  if (fetched && token) return <>{children}</>;

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gray-900">
      <Loader />
    </div>
  );
}

export const ProtectedRoute = ({
  children,
  ...rest
}: {
  children: ReactNode;
} & RouteProps) => {
  return (
    <Route {...rest}>
      <AuthContext>{children}</AuthContext>
    </Route>
  );
};
