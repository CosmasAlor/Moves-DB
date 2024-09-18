'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { fetchPersonalDetails, fetchMovieCredits } from '@/redux/personalDetails';
import { AppDispatch, RootState } from '@/redux/store';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Loading from '@/app/loading';
import Link from 'next/link';
import { FaBirthdayCake, FaMapMarkerAlt, FaVenusMars, FaUser, FaFilm } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Trending from '@/app/_components/trending/page';

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date?: string;
}

interface Person {
  name: string;
  profile_path: string | null;
  known_for_department: string;
  gender: number;
  birthday: string;
  place_of_birth: string;
  also_known_as: string[];
  biography: string;
}

const PersonalDetails: React.FC = () => {
  const { id: personId } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const { data: person, loading, error } = useSelector((state: RootState) => state.personalDetailsSlice || { data: null, loading: false, error: null });

  const [showFullBio, setShowFullBio] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);

  const truncateBio = (bio: string, wordLimit: number) => {
    const words = bio.split(' ');
    if (words.length <= wordLimit) return bio;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  const formatBirthdate = (birthdate: string | undefined) => {
    if (!birthdate) return 'N/A';
    const date = new Date(birthdate);
    const formattedDate = date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    const age = new Date().getFullYear() - date.getFullYear();
    return `${formattedDate} (${age} years)`;
  };

  useEffect(() => {
    if (personId) {
      Promise.all([
        dispatch(fetchPersonalDetails(personId)),
        dispatch(fetchMovieCredits(personId))
      ]).then(([personalDetailsAction, movieCreditsAction]) => {
        if (fetchPersonalDetails.fulfilled.match(personalDetailsAction)) {
          setMovies(personalDetailsAction.payload.known_for || []);
        }
        if (fetchMovieCredits.fulfilled.match(movieCreditsAction)) {
          setMovies(movieCreditsAction.payload);
        }
        setIsDataLoaded(true);
      });
    }
  }, [dispatch, personId]);

  const sliderSettings = useMemo(() => ({
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  }), []);

  if (loading || !isDataLoaded) return <Loading />;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;
  if (!person) {
    router.push('/404');
    return null;
  }

  return ( <>
    <section className="py-12 bg-gray-100 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-start lg:space-x-8">
          {/* Left column: Image and Personal Info */}
          <div className="lg:w-1/3 mb-8 lg:mb-0">
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden">
              <img 
                className="w-full h-auto object-cover"
                src={person.profile_path 
                  ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
                  : '/images/default-profile.png'}
                alt={person.name} 
              />
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Personal Info</h2>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li className="flex items-center">
                    <FaUser className="mr-2" />
                    <span><strong>Name:</strong> {person.name}</span>
                  </li>
                  <li className="flex items-center">
                    <FaFilm className="mr-2" />
                    <span><strong>Known For:</strong> {person.known_for_department}</span>
                  </li>
                  <li className="flex items-center">
                    <FaVenusMars className="mr-2" />
                    <span><strong>Gender:</strong> {person.gender === 2 ? 'Male' : 'Female'}</span>
                  </li>
                  <li className="flex items-center">
                    <FaBirthdayCake className="mr-2" />
                    <span><strong>Birthdate:</strong> {formatBirthdate(person.birthday)}</span>
                  </li>
                  <li className="flex items-center">
                    <FaMapMarkerAlt className="mr-2" />
                    <span><strong>Place of Birth:</strong> {person.place_of_birth}</span>
                  </li>
                  <li className="flex items-center">
                    <FaUser className="mr-2" />
                    <span><strong>Also Known As:</strong></span>
                  </li>
                  <ul className="list-disc list-inside ml-6 mt-1">
                    {person.also_known_as && person.also_known_as.map((name: string, index: number) => (
                      <li key={index}>{name}</li>
                    ))}
                  </ul>
                </ul>
              </div>
            </div>
          </div>

          {/* Right column: Bio and Movies */}
          <div className="lg:w-2/3">
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {person.name}
              </h1>
              <span className="text-xl text-gray-600 dark:text-gray-400">{person.known_for_department}</span>

              <hr className="my-6 border-gray-200 dark:border-gray-600" />

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Biography</h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                {showFullBio ? person.biography : truncateBio(person.biography, 100)}
                {person.biography.split(' ').length > 100 && (
                  <button
                    onClick={() => setShowFullBio(!showFullBio)}
                    className="ml-2 text-blue-600 hover:underline dark:text-blue-400 font-semibold"
                  >
                    {showFullBio ? 'Read less' : 'Read more'}
                  </button>
                )}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Known For</h2>
              <div className='overflow-hidden'>
                {movies && movies.length > 1 && movies.some(movie => movie.poster_path) ? (
                  <Slider {...sliderSettings}>
                    {movies.filter(movie => movie.poster_path).map((movie) => (
                      <MovieCard key={movie.id} movie={movie} />
                    ))}
                  </Slider>
                ) : movies.filter(movie => movie.poster_path).length === 1 ? (
                  <div className="flex justify-center">
                    <MovieCard movie={movies.find(movie => movie.poster_path)!} />
                  </div>
                ) : (
                  <p className="text-center text-gray-600 dark:text-gray-400">No known movies available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="mt-12 bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Trending Now</h2>
        <Trending />
      </div>
    </section>
  </>);
};

const MovieCard: React.FC<{ movie: Movie }> = ({ movie }) => (
  <Link href={`/movie/${movie.id}`}>
    <div className="px-2">
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
        <img 
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-64 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{movie.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">{movie.release_date?.split('-')[0] || 'N/A'}</p>
        </div>
      </div>
    </div>
  </Link>
);

export default PersonalDetails;