// Defined Actions, Reducer and Save State

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import bcategoryService from "./bcategoryService";

const initialState = {
  bCategories: [], // bCategories
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

// actions
export const getCategories = createAsyncThunk(
  "blogCategory/get-categories",
  async (thunkAPI) => {
    try {
      return await bcategoryService.getBlogCategories();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// reducers
export const bCategorySlice = createSlice({
  name: "bCategories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.bCategories = action.payload;
        state.message = "success";
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })
  }
})

export default bCategorySlice.reducer;