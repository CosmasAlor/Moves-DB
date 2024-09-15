import { configureStore } from "@reduxjs/toolkit";
import moviesReducer from "./TrendingSlice"; // Adjust the path accordingly

export const store = configureStore({
  reducer: {
    moviesReducer
  }
});

export type StoreDispatch = typeof store.dispatch;
export type StoreState = ReturnType<typeof store.getState>;
