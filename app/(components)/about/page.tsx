import React from 'react'
import Image from 'next/image'
import defaultImage from '../../assets/cosmas.jpg'
import { Inter } from 'next/font/google'
import Soonall from '@/app/_components/Soonall/page'

const inter = Inter({ subsets: ['latin'] })

export default function About() {
  return (
    <div className={`container mx-auto px-4 py-8 ${inter.className}`}>
      <h1 className="text-3xl font-bold mb-6">About Us</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Welcome to Moves DB</h2>
          <p className="mb-4">
            Welcome to Moves DB, your ultimate destination for discovering and exploring a world of movies and TV shows. 
            At Moves DB, we are passionate about connecting you with the cinematic universe, offering an intuitive platform to browse, search, and learn about your favorite films and series.
          </p>
          <p className="mb-4">
            Our mission is to provide movie enthusiasts with a seamless and enjoyable experience. Built using the cutting-edge Next.js framework, Moves DB is designed for speed, responsiveness, and a user-friendly interface, ensuring that you can dive into the world of entertainment without any interruptions.
          </p>
          <p className="mb-4">
            Whether you're a casual viewer or a die-hard cinephile, Moves DB is here to cater to your needs. From the latest blockbusters to timeless classics, we strive to keep you informed and inspired with accurate information and updates about the ever-evolving entertainment industry.
          </p>
          <p className="mb-4">
            Founded by Cosmas Alor, Moves DB reflects a dedication to excellence and a love for storytelling through movies and TV shows. We invite you to join our growing community of film lovers and embark on an exciting journey through the world of cinema.
          </p>
          <p>
            Thank you for choosing Moves DB – your guide to endless entertainment possibilities.
          </p>
        </div>
        
        <div className="flex justify-center items-center">
          <Image
            src={defaultImage}
            alt="Our team"
            width={400}
            height={100}
            className="rounded-lg"
          />
        </div>
      </div>

      {/* <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="text-center">
            <Image
              src={defaultImage}
              alt="Team Member Name"
              width={150}
              height={150}
              className="rounded-full mx-auto mb-2"
            />
            <h3 className="font-semibold">Team Member Name</h3>
            <p className="text-sm text-gray-600">Position</p>
          </div>
          <div className="text-center">
            <Image
              src={defaultImage}
              alt="Team Member Name"
              width={150}
              height={150}
              className="rounded-full mx-auto mb-2"
            />
            <h3 className="font-semibold">Team Member Name</h3>
            <p className="text-sm text-gray-600">Position</p>
          </div>
          <div className="text-center">
            <Image
              src={defaultImage}
              alt="Team Member Name"
              width={150}
              height={150}
              className="rounded-full mx-auto mb-2"
            />
            <h3 className="font-semibold">Team Member Name</h3>
            <p className="text-sm text-gray-600">Position</p>
          </div>
          <div className="text-center">
            <Image
              src={defaultImage}
              alt="Team Member Name"
              width={150}
              height={150}
              className="rounded-full mx-auto mb-2"
            />
            <h3 className="font-semibold">Team Member Name</h3>
            <p className="text-sm text-gray-600">Position</p>
          </div>
      
        </div>
      </div> */}


<section className="my-12 mx-4">
  <Soonall />
</section>

    </div>
  )
}
