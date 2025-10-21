import React from 'react';
import { Link } from 'react-router-dom';
import Gagagana from '../assets/gagana.jpg';
import vindi from '../assets/vindi.jpg';
import sandeepa from '../assets/sandeepa.jpg'

const LivoraLandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-gold-500 flex items-center justify-center text-white font-bold text-xl">L</div>
            <h1 className="text-2xl font-bold">Livora</h1>
          </div>
          
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center bg-gray-800 overflow-hidden">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 text-left">
            <h1 className="text-5xl font-extrabold mb-4 text-gold-500">Welcome to Livora</h1>
            <p className="text-lg mb-6 text-gray-300 max-w-md">
              Experience unparalleled luxury and innovation in modern living spaces.
            </p>
            <Link to="/contact" className="bg-teal-500 text-white px-6 py-3 rounded-full hover:bg-teal-600 transition duration-300 font-semibold">
              Discover More
            </Link>
          </div>
          <div className="md:w-1/2 mt-6 md:mt-0">
            {/* COMMENT: Add your hero photo here */}
            {/* Replace with: <img src={heroPhoto} alt="Livora Hero" className="w-full h-64 object-cover rounded-lg" /> */}
            <div className="w-full h-64 bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-16 bg-gray-850">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-10 text-center text-gold-500">Why Choose Livora</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-2">
              <h3 className="text-xl font-semibold mb-2 text-teal-400">Prime Location</h3>
              <p className="text-gray-400">
                Strategically located near key amenities and transport hubs for convenience.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-2">
              <h3 className="text-xl font-semibold mb-2 text-teal-400">Sustainable Design</h3>
              <p className="text-gray-400">
                Built with eco-friendly materials and energy-efficient systems.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-2">
              <h3 className="text-xl font-semibold mb-2 text-teal-400">Luxury Amenities</h3>
              <p className="text-gray-400">
                Access to pools, gyms, and exclusive resident lounges.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-2">
              <h3 className="text-xl font-semibold mb-2 text-teal-400">Smart Technology</h3>
              <p className="text-gray-400">
                Integrated smart home features for enhanced living.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-2">
              <h3 className="text-xl font-semibold mb-2 text-teal-400">24/7 Security</h3>
              <p className="text-gray-400">
                Advanced security systems for peace of mind.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-2">
              <h3 className="text-xl font-semibold mb-2 text-teal-400">Affordable Luxury</h3>
              <p className="text-gray-400">
                Premium living at competitive prices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-10 text-center text-gold-500">About Livora</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2 text-teal-400">Our Story</h3>
              <p className="text-gray-400">
                Founded in 2000, Livora has been redefining luxury living with innovative designs and community-focused developments.
              </p>
              {/* COMMENT: Add your story photo here */}
              {/* Replace with: <img src={storyPhoto} alt="Livora Story" className="w-full h-40 object-cover mt-4 rounded" /> */}
              <div className="w-full h-40 bg-gray-700 mt-4 rounded"></div>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2 text-teal-400">Our Mission</h3>
              <p className="text-gray-400">
                To create sustainable, luxurious homes that enhance the quality of life for our residents.
              </p>
              {/* COMMENT: Add your mission photo here */}
              {/* Replace with: <img src={missionPhoto} alt="Livora Mission" className="w-full h-40 object-cover mt-4 rounded" /> */}
              <div className="w-full h-40 bg-gray-700 mt-4 rounded"></div>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2 text-teal-400">Our Vision</h3>
              <p className="text-gray-400">
                To be the leading name in luxury residential developments by 2035.
              </p>
              {/* COMMENT: Add your vision photo here */}
              {/* Replace with: <img src={visionPhoto} alt="Livora Vision" className="w-full h-40 object-cover mt-4 rounded" /> */}
              <div className="w-full h-40 bg-gray-700 mt-4 rounded"></div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-4xl font-bold mb-6 text-center text-gold-500">Developers</h2>
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
              {/* Replace with: <img src={developer1Photo} alt="Developer 1" className="w-32 h-32 object-cover rounded-full mb-4" /> */}
                <div className="w-32 h-32 bg-gray-700 rounded-full mb-4"></div>
                <h3 className="text-xl font-semibold mb-2 text-teal-400">Sachintha Nirmal</h3>
                <p className="text-gray-400 text-center">Project Leader.Payment Management System.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
                {/* Replace with: <img src={developer2Photo} alt="Developer 2" className="w-32 h-32 object-cover rounded-full mb-4" /> */}
                <div className="w-32 h-32 bg-gray-700 rounded-full mb-4"></div>
                <h3 className="text-xl font-semibold mb-2 text-teal-400">Kaveesha Fernando</h3>
                <p className="text-gray-400 text-center">Parcel Delivery Management System.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
                <div className="w-32 h-32 bg-gray-700 rounded-full mb-4">
                                    <img src={vindi} alt="Developer 3" className="w-32 h-32 object-cover rounded-full mb-4" /> 

                </div>
                <h3 className="text-xl font-semibold mb-2 text-teal-400">Vindiya Dewmin</h3>
                <p className="text-gray-400 text-center">User Account Management.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
                <div className="w-32 h-32 bg-gray-700 rounded-full mb-4">
                                  <img src={Gagagana} alt="Developer 4" className="w-32 h-32 object-cover rounded-full mb-4" /> 
                </div>
                <h3 className="text-xl font-semibold mb-2 text-teal-400">Gagagana Kalhara</h3>
                <p className="text-gray-400 text-center">Maintains and Announcement Management.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
                <div className="w-32 h-32 bg-gray-700 rounded-full mb-4">
                                    <img src={sandeepa} alt="Developer 5" className="w-32 h-32 object-cover rounded-full mb-4" /> 

                </div>
                <h3 className="text-xl font-semibold mb-2 text-teal-400">Kulain Sandeepa</h3>
                <p className="text-gray-400 text-center">UI and Booking Management.</p>
            </div>
        </div>

      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-850 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-6 text-gold-500">Ready to Live the Livora Way?</h2>
          <p className="text-gray-300 mb-6 max-w-xl mx-auto">
            Contact us today to schedule a tour or learn more about our exclusive offers.
          </p>
          <Link to="/login" className="bg-teal-500 text-white px-6 py-3 rounded-full hover:bg-teal-600 transition duration-300 font-semibold shadow-lg">
            Get Started
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-8 text-center">
        <div className="container mx-auto px-6">
          
          <p className="text-sm text-gray-500">© 2025 Livora. All rights reserved. | 456 Prestige Lane, Colombo, Sri Lanka</p>
          <p className="text-sm mt-2 text-gray-400">Email: info@livora.com | Phone: +94 114 567 890</p>
        </div>
      </footer>
    </div>
  );
};

export default LivoraLandingPage;