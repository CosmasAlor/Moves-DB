import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import axios from 'axios';

// Define the TV show details interface
interface TVShowDetails {
  id: number;
  name: string;
  overview: string;
  first_air_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  genres: { id: number; name: string }[];
  status?: string;
  homepage?: string;
  original_language: string;
  networks?: { id: number; name: string }[];
  created_by?: { id: number; name: string }[];
  number_of_seasons: number;
  last_episode_to_air?: {
    name: string;
    air_date: string;
    episode_number: number;
    season_number: number;
    overview: string;
  };
}

interface SimilarTVShow {
  id: number;
  name: string;
  poster_path: string | null;
  first_air_date?: string;
}

interface Credit {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface TVShowCredits {
  cast: Credit[];
  crew: {
    id: number;
    name: string;
    job: string;
    department: string;
  }[];
}

interface TVDetailsState {
  data: TVShowDetails | null;
  similarShows: SimilarTVShow[];
  credits: TVShowCredits | null;
  loading: boolean;
  error: string | null;
}

const initialState: TVDetailsState = {
  data: null,
  similarShows: [],
  credits: null,
  loading: false,
  error: null,
};

// Create async thunks for fetching TV show details
const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MTAzMDVjYjkyZTk4N2NhNmU3Nzg3Mjg3Y2U1MmRkNyIsIm5iZiI6MTcyNjM1NzkzNy4xNzQ1ODMsInN1YiI6IjY2NzFmZDZmYWJkZDgzY2I3NDM0MzljMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.XJ8m_RoIctF7bJdeSHKEYl00_F2hE0volPK_AZg8jao'; // Replace with your actual API key

export const fetchTVShowDetails = createAsyncThunk(
  'tvDetails/fetchTVShowDetails',
  async (tvId: string) => {
    const response = await axios.get(
      `https://api.themoviedb.org/3/tv/${tvId}?language=en-US`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          accept: 'application/json',
        },
      }
    );
    console.log(response.data);
    return response.data;
  }
);

export const fetchSimilarTVShows = createAsyncThunk(
  'tvDetails/fetchSimilarTVShows',
  async (tvId: string) => {
    const response = await axios.get(
      `https://api.themoviedb.org/3/tv/${tvId}/similar?language=en-US&page=1`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          accept: 'application/json',
        },
      }
    );
    return response.data.results;
  }
);

export const fetchTVShowCredits = createAsyncThunk(
  'tvDetails/fetchTVShowCredits',
  async (tvId: string) => {
    const response = await axios.get(
      `https://api.themoviedb.org/3/tv/${tvId}/aggregate_credits?language=en-US`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          accept: 'application/json',
        },
      }
    );
    return response.data;
  }
);

// Update the fetchSeasonDetails thunk to accept string parameters
export const fetchSeasonDetails = createAsyncThunk(
  'tvDetails/fetchSeasonDetails',
  async ({ tvId, seasonNumber }: { tvId: string; seasonNumber: string }) => {
    const response = await axios.get(
      `https://api.themoviedb.org/3/tv/${tvId}/season/${seasonNumber}?language=en-US`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          accept: 'application/json',
        },
      }
    );
    return response.data;
  }
);

export const fetchEpisodeDetails = createAsyncThunk(
  'tvDetails/fetchEpisodeDetails',
  async ({ tvId, seasonNumber, episodeNumber }: { tvId: string; seasonNumber: string; episodeNumber: string }) => {
    const response = await axios.get(
      `https://api.themoviedb.org/3/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}?language=en-US`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          accept: 'application/json',
        },
      }
    );
    return response.data;
  }
);

export interface EpisodeDetails {
  id: number;
  name: string;
  overview: string;
  vote_average: number;
  air_date: string;
  episode_number: number;
  season_number: number;
  still_path: string | null;
  runtime: number;
  guest_stars: Credit[];
  crew: Credit[];
}

const tvDetailsSlice = createSlice({
  name: 'tvDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTVShowDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTVShowDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchTVShowDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch TV show details';
      })
      .addCase(fetchSimilarTVShows.fulfilled, (state, action) => {
        state.similarShows = action.payload;
      })
      .addCase(fetchSimilarTVShows.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch similar TV shows';
      })
      .addCase(fetchTVShowCredits.fulfilled, (state, action) => {
        state.credits = action.payload;
      })
      .addCase(fetchTVShowCredits.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch TV show credits';
      })
      .addCase(fetchSeasonDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSeasonDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.seasonDetails = action.payload;
      })
      .addCase(fetchSeasonDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch season details';
      })
      .addCase(fetchEpisodeDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEpisodeDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.episodeDetails = action.payload;
      })
      .addCase(fetchEpisodeDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch episode details';
      });
  },
});

export default tvDetailsSlice.reducer;
