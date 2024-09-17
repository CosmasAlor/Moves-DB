import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Movie } from "../app/interfaces";
import axios from 'axios';

// Define common API options for reuse
const apiHeaders = {
  accept: 'application/json',
  Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MTAzMDVjYjkyZTk4N2NhNmU3Nzg3Mjg3Y2U1MmRkNyIsIm5iZiI6MTcyNjM1NzIwOS43NDE2MDksInN1YiI6IjY2NzFmZDZmYWJkZDgzY2I3NDM0MzljMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.X-0o_nolihUkCgVU8qorsGFNppuNlC0q9Sb-ieIcJW0'
};

// Helper function for validating API responses
const validateResponse = (data: any) => {
  if (!data || !Array.isArray(data.results)) {
    throw new Error('Invalid response from API');
  }
  return data.results;
};

// Reusable function for making API requests
const fetchMovies = async (url: string) => {
  try {
    const response = await axios.get(url, { headers: apiHeaders });
    console.log('API Response:', response.data); // Logging for debugging
    return validateResponse(response.data);
  } catch (error: any) {
    console.error('API Error:', error.message); // Improved error logging
    throw new Error(error.response?.data?.status_message || 'Failed to fetch data from API');
  }
};

// Get upcoming movies
export const GetUpcoming = createAsyncThunk<Movie[]>(
  'movies/GetUpcoming',
  async () => await fetchMovies('https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1')
);

// Get top-rated movies
export const GetTopRated = createAsyncThunk<Movie[]>(
  'movies/GetTopRated',
  async () => await fetchMovies('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1')
);

// Get now-playing movies
export const GetNowPlaying = createAsyncThunk<Movie[]>(
  'movies/GetNowPlaying',
  async () => await fetchMovies('https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1')
);

// Get popular movies
export const GetPopular = createAsyncThunk<Movie[]>(
  'movies/GetPopular',
  async () => await fetchMovies('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1')
);

// Update the UpcomingState interface
interface UpcomingState {
  movies: Movie[];
  topRatedMovies: Movie[];
  popularMovies: Movie[];
  nowPlayingMovies: Movie[];
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: UpcomingState = {
  movies: [],
  topRatedMovies: [],
  popularMovies: [],
  nowPlayingMovies: [],
  isLoading: false,
  error: null,
};

// Create the slice for movie data
const upcomingSlice = createSlice({
  name: 'upcoming',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Upcoming Movies
      .addCase(GetUpcoming.pending, (state) => {
        state.isLoading = true;
        state.error = null; // Clear any previous error
      })
      .addCase(GetUpcoming.fulfilled, (state, action) => {
        state.movies = action.payload;
        state.isLoading = false;
      })
      .addCase(GetUpcoming.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch upcoming movies';
      })
      // Top-Rated Movies
      .addCase(GetTopRated.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(GetTopRated.fulfilled, (state, action) => {
        state.topRatedMovies = action.payload;
        state.isLoading = false;
      })
      .addCase(GetTopRated.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch top-rated movies';
      })
      // Now-Playing Movies
      .addCase(GetNowPlaying.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(GetNowPlaying.fulfilled, (state, action) => {
        state.nowPlayingMovies = action.payload;
        state.isLoading = false;
      })
      .addCase(GetNowPlaying.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch now-playing movies';
      })
      // Popular Movies
      .addCase(GetPopular.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(GetPopular.fulfilled, (state, action) => {
        state.popularMovies = action.payload;
        state.isLoading = false;
      })
      .addCase(GetPopular.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch popular movies';
      });
  },
});

export default upcomingSlice.reducer;
