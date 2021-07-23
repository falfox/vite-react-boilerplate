import { Action, action, createContextStore } from "easy-peasy";
import { SubscriptionData } from "../api/auth";

interface AuthModel {
  token: string | null;
  userId: number | null;
  name: string | null;
  email: string | null;
  subscription: SubscriptionData | null;
  logout: Action<AuthModel>;
  setUserData: Action<
    AuthModel,
    Pick<AuthModel, "userId" | "name" | "email" | "subscription">
  >;
  setToken: Action<AuthModel, string>;
}

export const AuthStores = createContextStore<AuthModel>({
  token: localStorage.getItem("token"),
  email: null,
  name: null,
  userId: null,
  subscription: null,
  setUserData: action((state, payload) => {
    state.name = payload.name;
    state.userId = payload.userId;
    state.email = payload.email;
    state.subscription = payload.subscription;
  }),
  logout: action((state) => {
    localStorage.removeItem("token");
    state.token = null;
    state.name = null;
    state.email = null;
    state.userId = null;
    state.subscription = null;
  }),
  setToken: action((state, payload) => {
    state.token = payload;
    localStorage.setItem("token", payload);
  }),
});
