// TrendingSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Movie } from "@/app/interfaces";

const baseUrl = 'https://api.themoviedb.org/3/trending/movie';

export const GetTrending = createAsyncThunk<Movie[], 'day' | 'week'>
(
  'movies/GetTrending',
  async (timeWindow: 'day' | 'week') => {
    const url = `${baseUrl}/${timeWindow}?language=en-US`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MTAzMDVjYjkyZTk4N2NhNmU3Nzg3Mjg3Y2U1MmRkNyIsIm5iZiI6MTcyNjM1NzIwOS43NDE2MDksInN1YiI6IjY2NzFmZDZmYWJkZDgzY2I3NDM0MzljMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.X-0o_nolihUkCgVU8qorsGFNppuNlC0q9Sb-ieIcJW0'
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.results; // Adjust based on the API response structure
  }
);

const initialState: { Movie: Movie[]; isLoading: boolean } = { Movie: [], isLoading: true };

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetTrending.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(GetTrending.fulfilled, (state, action) => {
        state.Movie = action.payload;
        state.isLoading = false;
      })
      .addCase(GetTrending.rejected, (state) => {
        state.isLoading = false;
        // Handle errors here if necessary
      });
  },
});

export default moviesSlice.reducer;
