import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface TvShow {
  id: number;
  name: string;
  first_air_date: string;
  overview: string;
  vote_average: number;
  poster_path: string | null;
  // Add any other properties you're using
}

interface TvState {
  airingToday: TvShow[];
  onTheAir: TvShow[];
  topRated: TvShow[];
  popular: TvShow[]; // New state for popular shows
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TvState = {
  airingToday: [],
  onTheAir: [],
  topRated: [], // Initialize the new state
  popular: [], // Initialize the new state
  loading: 'idle',
  error: null,
};

export const fetchOnTheAir = createAsyncThunk(
  'tv/fetchOnTheAir',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        'https://api.themoviedb.org/3/tv/on_the_air',
        {
          params: {
            language: 'en-US',
            page: 1,
          },
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MTAzMDVjYjkyZTk4N2NhNmU3Nzg3Mjg3Y2U1MmRkNyIsIm5iZiI6MTcyNjM1NzIwOS43NDE2MDksInN1YiI6IjY2NzFmZDZmYWJkZDgzY2I3NDM0MzljMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.X-0o_nolihUkCgVU8qorsGFNppuNlC0q9Sb-ieIcJW0',
            accept: 'application/json',
          },
        }
      );
      return response.data.results;
    } catch (error) {
      return rejectWithValue('Failed to fetch on the air TV shows');
    }
  }
);

export const fetchAiringToday = createAsyncThunk(
  'tv/fetchAiringToday',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        'https://api.themoviedb.org/3/tv/airing_today',
        {
          params: {
            language: 'en-US',
            page: 1,
          },
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MTAzMDVjYjkyZTk4N2NhNmU3Nzg3Mjg3Y2U1MmRkNyIsIm5iZiI6MTcyNjM1NzIwOS43NDE2MDksInN1YiI6IjY2NzFmZDZmYWJkZDgzY2I3NDM0MzljMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.X-0o_nolihUkCgVU8qorsGFNppuNlC0q9Sb-ieIcJW0',
            accept: 'application/json',
          },
        }
      );
      return response.data.results;
    } catch (error) {
      return rejectWithValue('Failed to fetch airing today TV shows');
    }
  }
);

export const fetchTopRated = createAsyncThunk(
  'tv/fetchTopRated',
  async (params: {
    language: string;
    sort_by: string;
    'vote_average.gte': number;
    'first_air_date.gte': string;
    'first_air_date.lte': string;
    with_genres: string;
    page: number;
  }) => {
    const response = await axios.get('https://api.themoviedb.org/3/tv/top_rated', {
      params: {
        api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY,
        ...params,
      },
    });
    return response.data.results;
  }
);

export const fetchPopular = createAsyncThunk(
  'tv/fetchPopular',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        'https://api.themoviedb.org/3/tv/popular',
        {
          params: {
            language: 'en-US',
            page: 1,
          },
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MTAzMDVjYjkyZTk4N2NhNmU3Nzg3Mjg3Y2U1MmRkNyIsIm5iZiI6MTcyNjM1NzIwOS43NDE2MDksInN1YiI6IjY2NzFmZDZmYWJkZDgzY2I3NDM0MzljMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.X-0o_nolihUkCgVU8qorsGFNppuNlC0q9Sb-ieIcJW0',
            accept: 'application/json',
          },
        }
      );
      return response.data.results;
    } catch (error) {
      return rejectWithValue('Failed to fetch popular TV shows');
    }
  }
);

const tvSlice = createSlice({
  name: 'tv',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAiringToday.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(fetchAiringToday.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.airingToday = action.payload;
      })
      .addCase(fetchAiringToday.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchOnTheAir.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(fetchOnTheAir.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.onTheAir = [...state.onTheAir, ...action.payload];
      })
      .addCase(fetchOnTheAir.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchTopRated.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(fetchTopRated.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.topRated = action.payload;
      })
      .addCase(fetchTopRated.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchPopular.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(fetchPopular.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.popular = action.payload;
      })
      .addCase(fetchPopular.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default tvSlice.reducer;
