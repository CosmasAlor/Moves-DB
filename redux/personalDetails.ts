import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the personal details interface
interface PersonalDetails {
  id: number;
  name: string;
  age: number;
  biography: string;
  birthday: string;
  gender: number;
  place_of_birth: string;
  profile_path: string;
  known_for_department: string;
  // Add other properties as needed
}

// Add a new interface for movie credits
interface MovieCredit {
  id: number;
  title: string;
  character: string;
  release_date: string;
  // Add other properties as needed
}

interface PersonalDetailsState {
  data: PersonalDetails | null;
  movieCredits: MovieCredit[];
  loading: boolean;
  error: string | null;
}

const initialState: PersonalDetailsState = {
  data: null,
  movieCredits: [],
  loading: false,
  error: null,
};

// Create an async thunk for fetching personal details
export const fetchPersonalDetails = createAsyncThunk(
  'personalDetails/fetchPersonalDetails',
  async (personId: string) => {
    const response = await axios.get(
      `https://api.themoviedb.org/3/person/${personId}?language=en-US`,
      {
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MTAzMDVjYjkyZTk4N2NhNmU3Nzg3Mjg3Y2U1MmRkNyIsIm5iZiI6MTcyNjM1NzIwOS43NDE2MDksInN1YiI6IjY2NzFmZDZmYWJkZDgzY2I3NDM0MzljMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.X-0o_nolihUkCgVU8qorsGFNppuNlC0q9Sb-ieIcJW0',
          accept: 'application/json',
        },
      }
    );

    
    return response.data;
  }
);

// Create a new async thunk for fetching movie credits
export const fetchMovieCredits = createAsyncThunk(
  'personalDetails/fetchMovieCredits',
  async (personId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/person/${personId}/movie_credits?language=en-US`,
        {
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MTAzMDVjYjkyZTk4N2NhNmU3Nzg3Mjg3Y2U1MmRkNyIsIm5iZiI6MTcyNjM1NzIwOS43NDE2MDksInN1YiI6IjY2NzFmZDZmYWJkZDgzY2I3NDM0MzljMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.X-0o_nolihUkCgVU8qorsGFNppuNlC0q9Sb-ieIcJW0',
            accept: 'application/json',
          },
        }
      );
      
      console.log('API Response:', response.data);
      
      if (!response.data.cast) {
        console.log('not working');
        throw new Error('Cast data not found in the response');
       
        
      }
      
      return response.data.cast;
    } catch (error) {
        console.log('not ddd working');
      console.error('Error fetching movie credits:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const personalDetailsSlice = createSlice({
  name: 'personalDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPersonalDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPersonalDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPersonalDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch personal details';
      })
      .addCase(fetchMovieCredits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovieCredits.fulfilled, (state, action) => {
        state.loading = false;
        state.movieCredits = action.payload;
      })
      .addCase(fetchMovieCredits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch movie credits';
      });
  },
});

export default personalDetailsSlice.reducer;
