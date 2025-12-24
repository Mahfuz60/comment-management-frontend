import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "@/features/auth/authSlice";
import { authApi } from "@/features/auth/authApi";
import { commentsApi } from "@/features/comments/commentsApi";
import { commentsUiReducer } from "@/features/comments/commentsUiSlice";
import { attachGetState } from "@/app/api/axiosInstance";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    commentsUi: commentsUiReducer,
    [authApi.reducerPath]: authApi.reducer,
    [commentsApi.reducerPath]: commentsApi.reducer
  },
  middleware: (getDefault) =>
    getDefault().concat(authApi.middleware, commentsApi.middleware)
});

attachGetState(() => store.getState());

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
