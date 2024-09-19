import React from 'react'
import Image from 'next/image'

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">About Us</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="mb-4">
            Founded in [year], [Company Name] has been at the forefront of [industry/field]. 
            Our mission is to [brief mission statement].
          </p>
          <p>
            We're passionate about [key focus areas] and committed to [company values or goals].
          </p>
        </div>
        
        <div>
          <Image
            src="/path-to-your-image.jpg"
            alt="Our team"
            width={500}
            height={300}
            className="rounded-lg"
          />
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Repeat this block for each team member */}
          <div className="text-center">
            <Image
              src="/path-to-team-member-image.jpg"
              alt="Team Member Name"
              width={150}
              height={150}
              className="rounded-full mx-auto mb-2"
            />
            <h3 className="font-semibold">Team Member Name</h3>
            <p className="text-sm text-gray-600">Position</p>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
        <p>
          Have questions or want to learn more? Reach out to us at{' '}
          <a href="mailto:contact@example.com" className="text-blue-600 hover:underline">
            contact@example.com
          </a>
          {' '}or call us at (123) 456-7890.
        </p>
      </div>
    </div>
  )
}
