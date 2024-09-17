import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Person {
  id: number;
  name: string;
  profile_path: string;
  popularity: number;
  known_for_department?: string;
}

interface PersonState {
  people: Person[];
  loading: boolean;
  error: string | null;
  totalPages: number;
}

const initialState: PersonState = {
  people: [],
  loading: false,
  error: null,
  totalPages: 0,
};

export const fetchPopularPeople = createAsyncThunk(
  'person/fetchPopularPeople',
  async (page: number = 1) => {
    const response = await axios.get(
      `https://api.themoviedb.org/3/person/popular?language=en-US&page=${page}`,
      {
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MTAzMDVjYjkyZTk4N2NhNmU3Nzg3Mjg3Y2U1MmRkNyIsIm5iZiI6MTcyNjM1NzkzNy4xNzQ1ODMsInN1YiI6IjY2NzFmZDZmYWJkZDgzY2I3NDM0MzljMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.XJ8m_RoIctF7bJdeSHKEYl00_F2hE0volPK_AZg8jao',
          accept: 'application/json',
        },
      }
    );
    return {
      results: response.data.results,
      totalPages: response.data.total_pages,
    };
  }
);

const personSlice = createSlice({
  name: 'person',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPopularPeople.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPopularPeople.fulfilled, (state, action) => {
        state.loading = false;
        state.people = [...state.people, ...action.payload.results];
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchPopularPeople.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred';
      });
  },
});

export default personSlice.reducer;
