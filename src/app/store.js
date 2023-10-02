import { configureStore } from "@reduxjs/toolkit"; // create Redux Store
import authReducer from "../features/auth/authSlice";


export const store = configureStore({
  // list Reducer
  reducer: {
    auth: authReducer,
  },
});