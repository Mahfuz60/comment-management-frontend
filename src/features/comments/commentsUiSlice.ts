import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { CommentsSort } from "./types";

type CommentsUiState = {
  sort: CommentsSort;
  page: number;
  limit: number;
};

const initialState: CommentsUiState = {
  sort: "newest",
  page: 1,
  limit: 10
};

const slice = createSlice({
  name: "commentsUi",
  initialState,
  reducers: {
    setSort(state, action: PayloadAction<CommentsSort>) {
      state.sort = action.payload;
      state.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setLimit(state, action: PayloadAction<number>) {
      state.limit = action.payload;
      state.page = 1;
    }
  }
});

export const { setSort, setPage, setLimit } = slice.actions;
export const commentsUiReducer = slice.reducer;
