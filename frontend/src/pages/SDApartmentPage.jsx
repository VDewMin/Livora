import React from 'react';
import { Link } from 'react-router-dom';
import exterior from '../assets/exterior-view.jpg';
import ceremony from '../assets/ceremony.jpg';
import serviceLogo from '../assets/maintain.jpg';
import laundry from '../assets/laundry-service.jpg';
import staff from '../assets/staff.jpg';
import securityLogo from '../assets/security.jpg';
import interior from '../assets/interior.jpeg';
import amenities from '../assets/amenities.jpg';
import logo from '../assets/logo.png';

const SDApartmentPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
              <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center bg-gradient-to-br from-teal-600 to-emerald-500">
                    <img src={logo} alt="Pearl Residencies Logo" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold">Pearl Residencies</div>
                    <div className="text-xs text-gray-500">Luxury Apartments</div>
                  </div>
                </div>
                <nav className="hidden md:flex items-center gap-6 text-gray-700">
                  <a href="/home" className="hover:text-teal-600 transition">Home</a>
                  <a href="/about" className="hover:text-teal-600 transition">About</a>
                  <a href="/apartments" className="hover:text-teal-600 transition">Apartment</a>
                  <a href="/contact" className="hover:text-teal-600 transition">Contact</a>
                </nav>
                <div className="flex items-center gap-3">
                  <Link to="/create" className="bg-teal-600 text-white px-4 py-2 rounded-md shadow hover:bg-teal-700 transition">Contact</Link>
                </div>
              </div>
            </header>

      {/* Hero Section */}
      <section className="relative h-[68vh] flex items-center bg-gray-900 overflow-hidden">
        <img src={exterior} alt="Exterior view of Pearl Residencies" className="absolute inset-0 w-full h-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="max-w-4xl mx-auto text-white">
            <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">Explore Our Apartments</h2>
            <p className="mt-4 text-lg text-white/90">Luxury living awaits at Pearl Residencies!</p>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8 text-teal-700">Our Premium Facilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-teal-50 p-6 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-2 flex flex-col items-center">
              <img src={ceremony} alt="Convention Hall" className="w-40 h-30 mb-4 object-cover rounded" />
              <h3 className="text-xl font-semibold text-teal-600">Convention Halls</h3>
              <p className="text-gray-600 mt-2">Spacious halls for events and gatherings.</p>
            </div>
            <div className="bg-teal-50 p-6 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-2 flex flex-col items-center">
              <img src={serviceLogo} alt="Service Maintainers" className="w-40 h-30 mb-4 object-cover rounded" />
              <h3 className="text-xl font-semibold text-teal-600">Service Maintainers</h3>
              <p className="text-gray-600 mt-2">Dedicated team for repairs and upkeep.</p>
            </div>
            <div className="bg-teal-50 p-6 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-2 flex flex-col items-center">
              <img src={securityLogo} alt="Security" className="w-40 h-30 mb-4 object-cover rounded" />
              <h3 className="text-xl font-semibold text-teal-600">24/7 Security</h3>
              <p className="text-gray-600 mt-2">Round-the-clock safety for residents.</p>
            </div>
            <div className="bg-teal-50 p-6 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-2 flex flex-col items-center">
              <img src={laundry} alt="Laundry Service" className="w-40 h-30 mb-4 object-cover rounded" />
              <h3 className="text-xl font-semibold text-teal-600">Laundry Service</h3>
              <p className="text-gray-600 mt-2">Convenient on-site laundry options.</p>
            </div>
            <div className="bg-teal-50 p-6 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-2 flex flex-col items-center">
              <img src={staff} alt="Friendly Staff" className="w-40 h-30 mb-4 object-cover rounded" />
              <h3 className="text-xl font-semibold text-teal-600">Friendly Staff</h3>
              <p className="text-gray-600 mt-2">Warm and helpful community support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Apartment Details */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4 text-teal-700">Apartment Features</h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Our 2-bedroom apartments span 1200 sq.ft. with modern kitchens, spacious living areas, and breathtaking city views. Located in the heart of Colombo, enjoy proximity to shops and parks.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="w-full h-64 bg-gray-300 overflow-hidden rounded-lg shadow-md hover:shadow-lg transition">
              <img src={interior} alt="Apartment interior" className="w-full h-full object-cover" />
            </div>
            <div className="w-full h-64 bg-gray-300 overflow-hidden rounded-lg shadow-md hover:shadow-lg transition">
              <img src={amenities} alt="Apartment amenities" className="w-full h-full object-cover" />
            </div>
          </div>
          <p className="text-gray-700 mt-6">Starting at LKR 75,000/month. Contact us for a tour!</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-teal-700 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <ul className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6 mb-6">
            <li><Link to="/landing" className="hover:text-teal-200 transition">Home</Link></li>
            <li><Link to="/apartments" className="hover:text-teal-200 transition">Apartments</Link></li>
            <li><Link to="/create" className="hover:text-teal-200 transition">Contact</Link></li>
            <li><Link to="/about" className="hover:text-teal-200 transition">About</Link></li>
          </ul>
          <p className="text-sm mb-2">Pearl Residencies © 2025 | 123 Main Street, Colombo, Sri Lanka</p>
          <p className="text-sm">Follow us: 
            <div className="inline-flex space-x-4 ml-2 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 px-2 py-1 rounded">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <img src="https://cdn.simpleicons.org/facebook/1877F2" alt="Facebook" className="w-6 h-6" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <img src="https://cdn.simpleicons.org/instagram/E1306C" alt="Instagram" className="w-6 h-6" />
              </a>
            </div>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SDApartmentPage;