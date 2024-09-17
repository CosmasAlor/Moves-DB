'use client'

import { useState, useEffect } from "react";
import Image from "next/image";
import Trending from "./_components/trending/page";
import Upcoming from "./_components/Upcoming/page";
import TopRated from "./_components/Toprated/page";
import Head from "next/head";
import Soonall from "./_components/Soonall/page";
import Carousel from "./_components/Carousel/page";
import Loading from "./loading";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Adjust this time as needed

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (

      <Loading />
    );
  }

  return <>
        <Head>
        <link
          href="https://cdn.jsdelivr.net/npm/flowbite@2.5.1/dist/flowbite.min.css"
          rel="stylesheet"
        />
      </Head>
<main>

<section >
  
  <Carousel />


</section>

{/* 
<section className="" style={{  padding: '50px' }}>
      <div id="media_v4" className="media discover">
        <div className="column_wrapper">

          <div className="flex flex-col items-center justify-center align-middle h-full p-10">
            <div className="title text-center mb-4">
              <h2 className="text-2xl font-bold">Welcome...</h2>
              <h3 className="text-lg">Millions of movies, TV shows and people to discover. Explore now.</h3>
            </div>


            <div className="search w-full max-w-md">
              <form id="inner_search_form" action="/search" method="get" accept-charset="utf-8" className="flex">
                <label className="w-full">
                  
                  <input 
                    dir="auto" 
                    id="inner_search_v4" 
                    name="query" 
                    type="text" 
                    autoCorrect="off" 
                    autoComplete="off" 
                    spellCheck="false" 
                    placeholder="Search for a movie, tv show, person......" 
                    className="w-full p-2 rounded-l-md border-2 border-r-0 border-gray-300 focus:outline-none focus:border-blue-500"
                  />
                </label>
                <input 
                  type="submit" 
                  value="Search" 
                  className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition duration-300"
                />
              </form>
            </div>
          </div>

        </div>
      </div>
    </section> */}

    <section  className="my-12 mx-4">
      <Trending />
    </section>

<section className="my-12 mx-4">
  <Soonall />
</section>

</main>

    
  </>;
}
