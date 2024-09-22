import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface SearchResult {
  id: number;
  media_type: 'movie' | 'tv' | 'person';
  name?: string;
  title?: string;
  profile_path?: string;
  poster_path?: string;
  // Add other common properties as needed
}

interface SearchState {
  results: SearchResult[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
}

const initialState: SearchState = {
  results: [],
  loading: false,
  error: null,
  totalPages: 0,
  currentPage: 1,
};

export const searchMulti = createAsyncThunk(
  'search/searchMulti',
  async ({ query, page = 1 }: { query: string; page?: number }, { rejectWithValue }) => {
    try {
      const response = await axios.get('https://api.themoviedb.org/3/search/multi', {
        params: {
          query,
          include_adult: false,
          language: 'en-US',
          page,
        },
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MTAzMDVjYjkyZTk4N2NhNmU3Nzg3Mjg3Y2U1MmRkNyIsIm5iZiI6MTcyNjM1NzkzNy4xNzQ1ODMsInN1YiI6IjY2NzFmZDZmYWJkZDgzY2I3NDM0MzljMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.XJ8m_RoIctF7bJdeSHKEYl00_F2hE0volPK_AZg8jao',
          accept: 'application/json',
        },
      });
      return {
        results: response.data.results,
        totalPages: response.data.total_pages,
        currentPage: response.data.page,
      };
    } catch (error) {
      return rejectWithValue('An error occurred while searching.');
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    clearSearch: (state) => {
      state.results = [];
      state.totalPages = 0;
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchMulti.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchMulti.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.results;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(searchMulti.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
