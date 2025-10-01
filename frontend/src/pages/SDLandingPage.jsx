import React from 'react';
import { Link } from 'react-router-dom';

const SDLandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      
      <header className="bg-teal-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Pearl Residencies</h1>
          <nav>
            <ul className="flex space-x-4">
              <li><a href="/landing" className="hover:underline">Home</a></li>
              <li><a href="/about" className="hover:underline">About</a></li>
              <li><a href="/apartments" className="hover:underline">Apartments</a></li>
              <li><a href="/contact" className="hover:underline">Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="bg-teal-100 py-16 text-center">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-4">Welcome to Pearl Residencies</h2>
          <p className="text-lg mb-6">Discover your perfect home with us!</p>
          <div className="w-full h-64 bg-gray-300 mb-4">

            {/* Photo Spot: Building Exterior */}
            
            <p className="text-center pt-20 text-gray-600">Place building exterior photo here</p>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section id="about" className="py-16 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">About Us</h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            At Pearl Residencies, we strive to provide a luxurious and comfortable living experience. Our community focuses on safety, convenience, and modern amenities for all residents.
          </p>
          <div className="w-1/2 h-48 bg-gray-300 mx-auto mb-4">
            {/* Photo Spot: Community Area */}
            <p className="text-center pt-16 text-gray-600">Place community area photo here</p>
          </div>
        </div>
      </section>

      {/* Apartment Details */}
      <section id="apartments" className="py-16 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Apartment Details</h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Our apartments feature spacious layouts, modern kitchens, and stunning views. Enjoy amenities like a gym, pool, and 24/7 security.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="w-full h-40 bg-gray-300">
              {/* Photo Spot: Bedroom */}
              <p className="text-center pt-12 text-gray-600">Place bedroom photo here</p>
            </div>
            <div className="w-full h-40 bg-gray-300">
              {/* Photo Spot: Kitchen */}
              <p className="text-center pt-12 text-gray-600">Place kitchen photo here</p>
            </div>
            <div className="w-full h-40 bg-gray-300">
              {/* Photo Spot: Living Room */}
              <p className="text-center pt-12 text-gray-600">Place living room photo here</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us */}
      <section id="contact" className="py-16 bg-white text-center">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
          <p className="text-gray-700 mb-6">Interested in our apartments? Get in touch with us!</p>
          <Link
            to="/create"
            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition duration-200"
          >
            Contact Now
          </Link>
          <p className="text-gray-600 mt-4">Email: info@pearlresidencies.com | Phone: +94 112 345 678</p>
        </div>
      </section>


      

      {/* Footer */}
      <footer className="bg-teal-600 text-white p-4 text-center">
        <div className="container mx-auto">
          <ul className="flex justify-center space-x-4 mb-2">
            <li><a href="#home" className="hover:underline">Home</a></li>
            <li><a href="#about" className="hover:underline">About</a></li>
            <li><a href="#apartments" className="hover:underline">Apartments</a></li>
            <li><a href="#contact" className="hover:underline">Contact</a></li>
          </ul>
          <p className="text-sm">Pearl Residencies © 2025 | Colombo, Sri Lanka</p>
          <p className="text-sm">Follow us: [Social Media Icons Placeholder]</p>
        </div>
      </footer>
    </div>
  );
};

export default SDLandingPage;