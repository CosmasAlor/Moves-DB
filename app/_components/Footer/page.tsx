import React from 'react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-xl font-bold mb-2">Company Name</h3>
            <p className="text-gray-400">Providing quality services since 2023</p>
          </div>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-xl font-bold mb-2">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-gray-300">Home</Link></li>
              <li><Link href="/about" className="hover:text-gray-300">About</Link></li>
              <li><Link href="/services" className="hover:text-gray-300">Services</Link></li>
              <li><Link href="/contact" className="hover:text-gray-300">Contact</Link></li>
            </ul>
          </div>
          <div className="w-full md:w-1/3">
            <h3 className="text-xl font-bold mb-2">Sign Up for News</h3>
            <form className="mt-2">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="p-2 w-full rounded-l text-gray-800"
                />
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 px-4 rounded-r"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Developed with ❤️ by <Link href="https://github.com/CosmasAlor" className="hover:text-gray-300">Cosmas Alor</Link></p>
        </div>
      </div>
    </footer>
  )
}
