// Defined Actions, Reducer and Save State

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import blogService from "./blogService";

const initialState = {
  blogs: [], // blogs
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

// actions
export const getBlogs = createAsyncThunk(
  "blog/get-blogs",
  async (thunkAPI) => {
    try {
      return await blogService.getBlogs();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// reducers
export const blogSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBlogs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBlogs.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.blogs = action.payload;
        state.message = "success";
      })
      .addCase(getBlogs.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })
  }
})

export default blogSlice.reducer;