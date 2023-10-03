import { configureStore } from "@reduxjs/toolkit"; // create Redux Store
import authReducer from "../features/auth/authSlice";
import customerReducer from "../features/customers/customerSlice";
import productReducer from "../features/product/productSlice";

export const store = configureStore({
  // list Reducer
  reducer: {
    auth: authReducer,
    customer: customerReducer,
    product: productReducer,
  },
});