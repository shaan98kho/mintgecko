
import { createAsyncThunk } from "@reduxjs/toolkit"
import type { RootState } from "./store"

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState;
}>();
