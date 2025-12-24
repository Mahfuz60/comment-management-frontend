
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/app/api/axiosBaseQuery";
import type {
  LoginRequest,
  LoginResponse,
  User,
  RegisterRequest,
} from "./types";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Me"],
  endpoints: (builder) => ({
    me: builder.query<{ user: User }, void>({
      query: () => ({ url: "/api/auth/me", method: "GET" }),
      providesTags: ["Me"],
    }),
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({ url: "/api/auth/login", method: "POST", data: body }),
      invalidatesTags: ["Me"],
    }),
    register: builder.mutation<LoginResponse, RegisterRequest>({
      query: (body) => ({
        url: "/api/auth/register",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Me"],
    }),
  }),
});

export const {
  useMeQuery,
  useLazyMeQuery,
  useLoginMutation,
  useRegisterMutation,
} = authApi;
