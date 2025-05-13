import { configureStore } from "@reduxjs/toolkit";
import stockReducer from "../store/stockSlice";

export const store = configureStore({
  reducer: {
    stock: stockReducer,
  },
});
