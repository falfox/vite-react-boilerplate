import { axiosInstance as axios } from "./axios";

export interface SubscriptionData {
  created_at: string;
  expired_at: string;
  id: number;
  is_lifetime: boolean;
  product: { name: string; code: string; type: string };
  product_id: number;
  updated_at: string;
  user_id: number;
}

export interface UserData {
  email: string;
  id: number;
  name: string;
  phone: string;
  subscription: null | SubscriptionData;
}

export async function getUser() {
  const { data } = await axios.get<UserData>("/api/user");

  return data;
}

export async function postLogin({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const { data } = await axios.post<{
    status: string;
    token: string;
  }>("/api/login/ext", {
    email,
    password,
  });

  return data;
}
