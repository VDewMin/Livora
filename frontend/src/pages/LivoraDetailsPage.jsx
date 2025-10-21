
import React from 'react';
import { Link } from 'react-router-dom';
import livoralogo from '../assets/livoralogo.png';

const LivoraDetailsPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-gold-500 flex items-center justify-center text-white font-bold text-xl">
                <img src={livoralogo} alt="Livora Logo" className="w-10 h-10 object-contain rounded-full" />
            </div>
            <h1 className="text-2xl font-bold">Livora</h1>
          </div>
          <nav className="space-x-4 hidden md:flex">
            <Link to="/landing" className="hover:text-teal-300">Home</Link>
            <Link to="/about" className="hover:text-teal-300">About</Link>
            <Link to="/contact" className="hover:text-teal-300">Contact</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center bg-gray-800 overflow-hidden">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 text-left">
            <h1 className="text-5xl font-extrabold mb-4 text-gold-500">Welcome to Livora</h1>
            <p className="text-lg mb-6 text-gray-300 max-w-md">
              Livora is a premier residential community dedicated to redefining luxury living with innovative designs, sustainable practices, and state-of-the-art amenities. Nestled in the heart of Colombo, Sri Lanka, we offer a harmonious blend of modern elegance and natural beauty, creating a sanctuary for our residents.
            </p>
           
          </div>
          <div className="md:w-1/2 mt-6 md:mt-0">
            <div className="w-full h-64 bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-12 text-center text-gold-500">Explore Our Smart Living Systems</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Smart Payment System */}
            <div className="bg-gradient-to-br from-teal-600 to-teal-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 text-gold-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-9c-1.657 0-3 .895-3 2s1.343 2 3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1" />
                </svg>
                <h3 className="text-2xl font-semibold text-white">Smart Payment System</h3>
              </div>
              <p className="text-gray-200">
                Our smart payment system allows residents to pay bills effortlessly through a secure online portal. With real-time transaction tracking, automated reminders, and multiple payment options (credit card, bank transfer), managing finances has never been easier. Enjoy seamless integration with your account for instant updates.
              </p>
            </div>

            {/* Delivery System */}
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 text-gold-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0zm-6 0a2 2 0 11-4 0 2 2 0 014 0zm2 2v1m0-10V8m0 0h-6m6 0v2m-6-2v2m0 0h6m-6 0v2" />
                </svg>
                <h3 className="text-2xl font-semibold text-white">Delivery System</h3>
              </div>
              <p className="text-gray-200">
                Our advanced delivery system ensures parcels are securely received and tracked. Residents can schedule deliveries, receive notifications, and pick up packages from a dedicated locker system. Integrated GPS tracking provides real-time updates for peace of mind.
              </p>
            </div>

            {/* Announcements */}
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 text-gold-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <h3 className="text-2xl font-semibold text-white">Announcements</h3>
              </div>
              <p className="text-gray-200">
                Stay informed with our announcement system, delivering timely updates on community events, maintenance schedules, and important notices. Accessible via a mobile app or resident portal, ensuring you never miss critical information.
              </p>
            </div>

            {/* Maintenance */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 text-gold-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <h3 className="text-2xl font-semibold text-white">Maintenance</h3>
              </div>
              <p className="text-gray-200">
                Our maintenance system offers prompt service requests through an online form. Residents can track repair statuses, schedule routine checks, and receive updates, ensuring a well-maintained living environment with minimal disruption.
              </p>
            </div>

            {/* Laundry System */}
            <div className="bg-gradient-to-br from-pink-600 to-pink-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 text-gold-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <h3 className="text-2xl font-semibold text-white">Laundry System</h3>
              </div>
              <p className="text-gray-200">
                Our laundry system provides on-demand pickup and delivery services. Schedule washes, track progress via the app, and enjoy professionally cleaned clothes delivered to your door, all managed with ease and efficiency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-850 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-6 text-gold-500">Ready to Live the Livora Way?</h2>
          <p className="text-gray-300 mb-6 max-w-xl mx-auto">
            Explore our exclusive residences and schedule a personalized tour to experience the Livora difference.
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

export default LivoraDetailsPage;