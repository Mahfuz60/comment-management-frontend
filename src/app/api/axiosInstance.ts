import axios from "axios";
import { env, isCookieAuth, isHeaderAuth } from "@/utils/env";
import type { RootState } from "@/app/store";

let getState: (() => RootState) | null = null;

export function attachGetState(fn: () => RootState) {
  getState = fn;
}

export const axiosInstance = axios.create({
  baseURL: env.API_BASE_URL,
  withCredentials: isCookieAuth, 
  headers: {
    "Content-Type": "application/json"
  }
});

axiosInstance.interceptors.request.use((config) => {
  if (isHeaderAuth && getState) {
    const token = getState().auth.token;
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    return Promise.reject(error);
  }
);
