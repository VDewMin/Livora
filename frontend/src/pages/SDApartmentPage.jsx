import React from 'react';
import { Link } from 'react-router-dom';

const SDApartmentPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Header */}
      <header className="bg-teal-700 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Pearl Residencies</h1>
          <nav>
            <ul className="flex space-x-6">
              <li><Link to="/landing" className="hover:text-teal-200">Home</Link></li>
              <li><Link to="/about" className="hover:text-teal-200">About</Link></li>
              <li><Link to="/apartments" className="hover:text-teal-200">Apartments</Link></li>
              <li><Link to="/contact" className="hover:text-teal-200">Contact</Link></li>
              

            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-teal-100 py-20 text-center">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-4">Explore Our Apartments</h2>
          <p className="text-lg mb-6">Luxury living awaits at Pearl Residencies!</p>
          <div className="w-full h-64 bg-gray-300 mx-auto overflow-hidden">
            <img
              src="https://via.placeholder.com/800x400?text=Apartment+Exterior"
              alt="Exterior view of Pearl Residencies"
              className="w-full h-full object-cover"
            />
            {/* Photo Spot: Apartment Exterior */}
            {/* Replace with: <img src={exteriorPhoto} alt="Apartment exterior" /> */}
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-teal-700">Our Premium Facilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Convention Halls */}
            <div className="bg-teal-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 flex flex-col items-center">
              <img
                src="https://via.placeholder.com/80?text=Convention"
                alt="Convention Hall Logo"
                className="w-20 h-20 mb-4"
              />
              {/* Replace with: <img src={conventionLogo} alt="Convention Hall Logo" /> */}
              <h3 className="text-xl font-semibold text-teal-600">Convention Halls</h3>
              <p className="text-gray-600 mt-2">Spacious halls for events and gatherings.</p>
            </div>

            {/* Service Maintainers */}
            <div className="bg-teal-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 flex flex-col items-center">
              <img
                src="https://via.placeholder.com/80?text=Service"
                alt="Service Maintainers Logo"
                className="w-20 h-20 mb-4"
              />
              {/* Replace with: <img src={serviceLogo} alt="Service Maintainers Logo" /> */}
              <h3 className="text-xl font-semibold text-teal-600">Service Maintainers</h3>
              <p className="text-gray-600 mt-2">Dedicated team for repairs and upkeep.</p>
            </div>

            {/* 24/7 Security */}
            <div className="bg-teal-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 flex flex-col items-center">
              <img
                src="https://via.placeholder.com/80?text=Security"
                alt="Security Logo"
                className="w-20 h-20 mb-4"
              />
              {/* Replace with: <img src={securityLogo} alt="Security Logo" /> */}
              <h3 className="text-xl font-semibold text-teal-600">24/7 Security</h3>
              <p className="text-gray-600 mt-2">Round-the-clock safety for residents.</p>
            </div>

            {/* Laundry Service */}
            <div className="bg-teal-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 flex flex-col items-center">
              <img
                src="https://via.placeholder.com/80?text=Laundry"
                alt="Laundry Service Logo"
                className="w-20 h-20 mb-4"
              />
              {/* Replace with: <img src={laundryLogo} alt="Laundry Service Logo" /> */}
              <h3 className="text-xl font-semibold text-teal-600">Laundry Service</h3>
              <p className="text-gray-600 mt-2">Convenient on-site laundry options.</p>
            </div>

            {/* Friendly Staff */}
            <div className="bg-teal-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 flex flex-col items-center">
              <img
                src="https://via.placeholder.com/80?text=Staff"
                alt="Friendly Staff Logo"
                className="w-20 h-20 mb-4"
              />
              {/* Replace with: <img src={staffLogo} alt="Friendly Staff Logo" /> */}
              <h3 className="text-xl font-semibold text-teal-600">Friendly Staff</h3>
              <p className="text-gray-600 mt-2">Warm and helpful community support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Apartment Details */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-teal-700">Apartment Features</h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Our 2-bedroom apartments span 1200 sq.ft. with modern kitchens, spacious living areas, and breathtaking city views. Located in the heart of Colombo, enjoy proximity to shops and parks.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="w-full h-48 bg-gray-300 overflow-hidden">
              <img
                src="https://via.placeholder.com/400x300?text=Interior+View"
                alt="Interior view of an apartment"
                className="w-full h-full object-cover"
              />
              {/* Photo Spot: Interior View */}
              {/* Replace with: <img src={interiorPhoto} alt="Apartment interior" /> */}
            </div>
            <div className="w-full h-48 bg-gray-300 overflow-hidden">
              <img
                src="https://via.placeholder.com/400x300?text=Amenities"
                alt="Apartment amenities"
                className="w-full h-full object-cover"
              />
              {/* Photo Spot: Amenities */}
              {/* Replace with: <img src={amenitiesPhoto} alt="Apartment amenities" /> */}
            </div>
          </div>
          <p className="text-gray-700 mt-6">Starting at LKR 75,000/month. Contact us for a tour!</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-teal-700 text-white p-6 text-center">
        <div className="container mx-auto">
          <ul className="flex justify-center space-x-6 mb-4">
            <li><Link to="/landing" className="hover:text-teal-200">Home</Link></li>
            <li><Link to="/apartments" className="hover:text-teal-200">Apartments</Link></li>
            <li><Link to="/create" className="hover:text-teal-200">Contact</Link></li>
            <li><Link to="/about" className="hover:text-teal-200">Contact</Link></li>

          </ul>
          <p className="text-sm">Pearl Residencies © 2025 | 123 Main Street, Colombo, Sri Lanka</p>
          <p className="text-sm mt-2">Follow us: [Facebook] [Twitter] [Instagram]</p>
        </div>
      </footer>
    </div>
  );
};

export default SDApartmentPage;