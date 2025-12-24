
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

type QueryArgs = {
  url: string;
  method: AxiosRequestConfig["method"];
  data?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
  headers?: AxiosRequestConfig["headers"];
};

export const axiosBaseQuery =
  ({ baseUrl = "" }: { baseUrl?: string } = {}): BaseQueryFn<
    QueryArgs,
    unknown,
    { status?: number; data?: any }
  > =>
  async (args, api) => {
    const { url, method, data, params, headers } = args;

    const token = (api.getState() as any)?.auth?.token as string | null;

    try {
      const result = await axios({
        url: baseUrl + url,
        method,
        data,
        params,
        withCredentials: true, 
        headers: {
          ...(headers || {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}), 
        },
      });

      return { data: result.data };
    } catch (error) {
      const err = error as AxiosError<any>;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data ?? { message: err.message },
        },
      };
    }
  };
