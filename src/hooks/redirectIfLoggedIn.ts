import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { getUser } from "../api/auth";
import { AuthStores } from "../stores/auth";

export function useRedirectIfLoggedIn() {
  const history = useHistory();
  const { token } = AuthStores.useStoreState((state) => state);

  useEffect(() => {
    (async () => {
      try {
        await getUser();
        history.push("/sender");
      } catch (error) {}
    })();
  }, [token]);
}
