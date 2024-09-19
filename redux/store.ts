import { configureStore } from "@reduxjs/toolkit";
import moviesReducer from "./TrendingSlice"; // Adjust the path accordingly
import upcomingReducer from "./UpcomingSlice";
import movieDetailsSlice from "./movieDetails";
import moviesDiscoverReducer from './moviesDiscoverSlice';
import personSlice from "./Person";
import personalDetailsSlice from "./personalDetails";

import tvReducer from './tv';

export const store = configureStore({
  reducer: {
    moviesReducer,
    upcoming: upcomingReducer,
    movieDetailsSlice,
    personSlice,
    personalDetailsSlice,
    moviesDiscover: moviesDiscoverReducer,
    tv: tvReducer, // Add this line
  }
});

export type StoreDispatch = typeof store.dispatch;
export type StoreState = ReturnType<typeof store.getState>;

// Add this line:
export type RootState = ReturnType<typeof store.getState>;

// Add these lines at the end of the file
export type AppDispatch = typeof store.dispatch;

