export interface Movie {
    backdrop_path: string;
    id: number;
    title: string;
    original_title: string;
    overview: string;
    poster_path: string;
    media_type: string;
    adult: boolean;
    original_language: string;
    genre_ids: number[];
    popularity: number;
    release_date: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}

export interface MovieResponse {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
}

// import { Movie } from "../app/interfaces";

export interface MovieState {
  movies: Movie[];
  isLoading: boolean;
  error: string | null;
}


export interface TVShow {
  id: number;
  name: string;
  poster_path: string | null;
  vote_average: number;
  overview: string;
  first_air_date: string;
  genre_ids: number[];
}

export interface UpcomingState {
  upcoming: MovieState;
  topRated: MovieState;
  nowPlaying: MovieState;
  popular: MovieState;
}


export interface Person {
  name: string;
  known_for_department?: string; // Add this if it's missing
  // other fields...
}
