import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import axios from 'axios';

// Define the movie details interface
interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  genres: { id: number; name: string }[];
  tagline: string;
  origin_country: string;
  // Add other properties as needed
}

interface SimilarMovie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
}

interface MovieDetailsState {
  data: MovieDetails | null;
  similarMovies: SimilarMovie[];
  loading: boolean;
  error: string | null;
}

const initialState: MovieDetailsState = {
  data: null,
  similarMovies: [],
  loading: false,
  error: null,
};

// Create an async thunk for fetching movie details
export const fetchMovieDetails = createAsyncThunk(
  'movieDetails/fetchMovieDetails',
  async (movieId: string) => {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
      {
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MTAzMDVjYjkyZTk4N2NhNmU3Nzg3Mjg3Y2U1MmRkNyIsIm5iZiI6MTcyNjM1NzIwOS43NDE2MDksInN1YiI6IjY2NzFmZDZmYWJkZDgzY2I3NDM0MzljMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.X-0o_nolihUkCgVU8qorsGFNppuNlC0q9Sb-ieIcJW0', // Replace with your actual API key
          accept: 'application/json',
        },
      }
    );
    console.log(response.data);
    
    return response.data;
  }
);

export const fetchSimilarMovies = createAsyncThunk(
  'movieDetails/fetchSimilarMovies',
  async (movieId: string) => {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/similar?language=en-US&page=1`,
      {
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MTAzMDVjYjkyZTk4N2NhNmU3Nzg3Mjg3Y2U1MmRkNyIsIm5iZiI6MTcyNjM1NzkzNy4xNzQ1ODMsInN1YiI6IjY2NzFmZDZmYWJkZDgzY2I3NDM0MzljMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.XJ8m_RoIctF7bJdeSHKEYl00_F2hE0volPK_AZg8jao',
          accept: 'application/json',
        },
      }
    );
    return response.data.results;
  }
);

const movieDetailsSlice = createSlice({
  name: 'movieDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovieDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovieDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchMovieDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch movie details';
      })
      .addCase(fetchSimilarMovies.fulfilled, (state, action) => {
        state.similarMovies = action.payload;
      })
      .addCase(fetchSimilarMovies.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch similar movies';
      });
  },
});

export default movieDetailsSlice.reducer;
