
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User } from "./types";
import { authApi } from "./authApi";

type AuthState = {
  user: User | null;
  token: string | null;
  status: "idle" | "loading" | "authenticated" | "unauthenticated";
};

const loadInitialState = (): AuthState => {
  const token = localStorage.getItem("auth_token");
  const userStr = localStorage.getItem("auth_user");

  return {
    user: userStr ? JSON.parse(userStr) : null,
    token: token || null,
    status: token ? "authenticated" : "idle",
  };
};

const initialState: AuthState = loadInitialState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.status = "unauthenticated";
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    },

    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
      if (action.payload) {
        state.status = "authenticated";
        localStorage.setItem("auth_token", action.payload);
      } else {
        state.status = "unauthenticated";
        localStorage.removeItem("auth_token");
      }
    },

    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
      state.status = action.payload ? "authenticated" : "unauthenticated";
      if (action.payload) {
        localStorage.setItem("auth_user", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("auth_user");
      }
    },

    restoreAuth(state) {
      const token = localStorage.getItem("auth_token");
      const userStr = localStorage.getItem("auth_user");

      state.token = token || null;
      state.user = userStr ? JSON.parse(userStr) : null;
      state.status = token ? "authenticated" : "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.me.matchPending, (state) => {
        state.status = "loading";
      })
      .addMatcher(authApi.endpoints.me.matchFulfilled, (state, action) => {
        const user = (action.payload as any)?.user ?? action.payload;
        state.user = user;
        state.status = "authenticated";
        localStorage.setItem("auth_user", JSON.stringify(user));
      })
      .addMatcher(authApi.endpoints.me.matchRejected, (state) => {
        state.user = null;
        localStorage.removeItem("auth_user");
        state.status = "unauthenticated";
        
      })
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        const token = (action.payload as any)?.token ?? null;
        const user = (action.payload as any)?.user ?? null;

        if (token) {
          state.token = token;
          localStorage.setItem("auth_token", token);
        }
        if (user) {
          state.user = user;
          localStorage.setItem("auth_user", JSON.stringify(user));
        }

        state.status = "authenticated";
      });
  },
});

export const { setToken, setUser, logout, restoreAuth } = authSlice.actions;
export const authReducer = authSlice.reducer;
