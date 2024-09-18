'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { fetchPersonalDetails, fetchMovieCredits } from '@/redux/personalDetails';
import { AppDispatch, RootState } from '@/redux/store';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Loading from '@/app/loading';
import Link from 'next/link';
import { FaBirthdayCake, FaMapMarkerAlt, FaVenusMars, FaUser, FaFilm, FaIdCard } from 'react-icons/fa';

// Add these interfaces at the top of the file
interface Person {
  name: string;
  profile_path: string;
  known_for_department: string;
  gender: number;
  birthday: string;
  place_of_birth: string;
  also_known_as: string[];
  biography: string;
}

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
}

const PersonalDetails: React.FC = () => {
  const { id: personId } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  
  const { data: person, loading, error } = useSelector((state: RootState) => state.personalDetailsSlice as { data: Person | null, loading: boolean, error: string | null });

  const [showFullBio, setShowFullBio] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);

  const truncateBio = (bio: string, wordLimit: number) => {
    const words = bio.split(' ');
    if (words.length <= wordLimit) return bio;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  const formatBirthdate = (birthdate: string) => {
    if (!birthdate) return 'N/A';
    const date = new Date(birthdate);
    const formattedDate = date.toLocaleDateString('en-US', { day: 'numeric',month:'long',year: 'numeric' });
    const age = new Date().getFullYear() - date.getFullYear();
    return `${formattedDate} (${age} years)`;
  };

  useEffect(() => {
    if (personId) {
      dispatch(fetchPersonalDetails(personId))
        .then((action) => {
          if (fetchPersonalDetails.fulfilled.match(action)) {
            setMovies(action.payload.known_for || []);
          }
        });
      
      dispatch(fetchMovieCredits(personId))
        .then((action) => {
          if (fetchMovieCredits.fulfilled.match(action)) {
            setMovies(action.payload);
          }
        });
    }
  }, [dispatch, personId]);

  if (loading) return <Loading />;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;
  if (!person) return <div className="text-center"><Loading /></div>;

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplaySpeed: 3000,
    arrows: false,
    autoplay: true,
    centerMode: true,
    centerPadding: '60px',
    responsive: [
      {
        breakpoint: 9999,
        settings: {
          slidesToShow: 4,
          centerMode: false,
        }
      },
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4,
          centerMode: false,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          centerMode: false,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          centerMode: false,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
          centerMode: false,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          centerMode: true,
          centerPadding: '40px',
        }
      }
    ]
  };

  return (
    <section className="py-12 bg-gray-100 dark:bg-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-start lg:space-x-8">
          {/* Left column: Image and Personal Info */}
          <div className="lg:w-1/3">
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden">
              <img 
                className="w-full h-auto object-cover"
                src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                alt={person.name} 
              />
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Personal Info</h2>
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
                      <li key={index} className="">{name}</li>
                    ))}
                  </ul>
                </ul>
              </div>
            </div>
          </div>

          {/* Right column: Bio and Movies */}
          <div className="lg:w-2/3 mt-8 lg:mt-0">
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {person.name}
              </h1>
              <span className="text-lg text-gray-600 dark:text-gray-400">{person.known_for_department}</span>

              <hr className="my-6 border-gray-200 dark:border-gray-600" />

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Biography</h2>
              <p className="text-gray-600 dark:text-gray-300">
                {showFullBio ? person.biography : truncateBio(person.biography, 100)}
                {person.biography.split(' ').length > 100 && (
                  <button
                    onClick={() => setShowFullBio(!showFullBio)}
                    className="ml-2 text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {showFullBio ? 'Read less' : 'Read more'}
                  </button>
                )}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Known For</h2>
<div className=''>
<Slider {...sliderSettings}>
                {movies.map((movie) => (
                  <div key={movie.id} className="px-2">
                    <Link href={`/movie/${movie.id}`}>
                      <div className="group py-5">
                        <div className="transform transition-transform duration-300 group-hover:scale-105">
                          <img 
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                            alt={movie.title} 
                            className="rounded-lg shadow-md w-full"
                          />
                          <h3 className="mt-2 text-center font-semibold text-gray-800 dark:text-gray-200 truncate">
                            {movie.title}
                          </h3>
                          <div className="text-center mt-1">
                            <span className="inline-block px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded-full text-xs text-gray-700 dark:text-gray-300">
                              {movie.release_date?.split('-')[0] || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </Slider>
</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersonalDetails;