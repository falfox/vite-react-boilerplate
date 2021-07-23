import axios, { AxiosError } from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "production"
      ? "https://smssender.chatwa.id"
      : "http://backend-sms.test/",
});

axiosInstance.interceptors.request.use((config) => {
  // add token to request headers
  config.headers["Authorization"] = "Bearer " + localStorage.getItem("token");
  return config;
});

export class NotAuthorizedError extends Error {}
export class ForbiddenError extends Error {}

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    // whatever you want to do with the error
    if (error instanceof Error && isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        throw new NotAuthorizedError();
      } else {
        throw error;
      }
    }
  }
);

export function isAxiosError(error: Error): error is AxiosError {
  return (error as any).isAxiosError === true;
}
