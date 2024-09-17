'use client'

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPopularPeople } from '@/redux/Person';
import { RootState, AppDispatch } from '@/redux/store';
import Image from 'next/image';
import Link from 'next/link';
import Loading from '@/app/loading'; // Import the Loading component

const Person: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { people, loading, error, totalPages } = useSelector((state: RootState) => state.personSlice);
  const [currentPage, setCurrentPage] = React.useState(1);

  useEffect(() => {
    dispatch(fetchPopularPeople(currentPage));
  }, [dispatch, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const totalPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(totalPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + totalPagesToShow - 1);

    if (endPage - startPage + 1 < totalPagesToShow) {
      startPage = Math.max(1, endPage - totalPagesToShow + 1);
    }

    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) pageNumbers.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pageNumbers.push('...');
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  if (loading) return <Loading />; // Use the Loading component instead of a simple div
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Popular People</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-5">
        {people.map((person) => (
          <Link href={`/personalDetails/${person.id}`} key={person.id}>
            <div className="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              <Image
                className="rounded-t-lg w-full h-64 object-cover"
                src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                alt={person.name}
                width={200}
                height={300}
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{person.name}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Department : {person.known_for_department}</p>
               
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <nav className="inline-flex rounded-md shadow">
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            className={`px-4 py-2 border rounded-l-md ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            disabled={currentPage === 1 || loading}
          >
            Previous
          </button>
          {renderPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && handlePageChange(page)}
              className={`px-4 py-2 border ${
                currentPage === page
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              disabled={loading || typeof page !== 'number'}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            className={`px-4 py-2 border rounded-r-md ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            disabled={currentPage === totalPages || loading}
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Person;