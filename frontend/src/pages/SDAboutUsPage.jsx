import React from 'react';
import { Link } from 'react-router-dom';
import legacyPhoto from '../assets/historical.jpg'; // Placeholder image import
import foundingPhoto from '../assets/founding.jpeg'; // Placeholder image import
import awardsPhoto from '../assets/awards.jpeg'; // Placeholder image import
import Gathering from '../assets/gathering.jpg'; // Placeholder image import
import Community from '../assets/commiunity-awards.jpg'; // Placeholder image import
import future from '../assets/future.jpg'; // Placeholder image import


const SDAboutUsPage = () => {
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
              <li><Link to="/create" className="hover:text-teal-200">Contact</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Introduction */}
      <section className="bg-teal-100 py-20 text-center">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-4">Our Legacy at Pearl Residencies</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Since 1995, Pearl Residencies has been a cornerstone of luxury living in Colombo, building a legacy of excellence and community.
          </p>
          <div className="w-full h-64 bg-gray-300 mx-auto overflow-hidden">
           
            {/* Photo Spot: Historical Legacy Photo */}
            <img
              src={legacyPhoto}
              alt="Historical view of Pearl Residencies"
              className="w-full h-full object-cover"
            />
            {/* Photo Spot: Historical Legacy Photo */}
            {/* Replace with: <img src={legacyPhoto} alt="Historical view" /> */}
          </div>
        </div>
      </section>

      {/* Milestone Timeline */}
      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-teal-700 text-center">Our Journey</h2>
          <div className="space-y-8">
            <div className="flex items-center">
              <div className="w-1/4 text-right pr-4">
                <p className="text-gray-600">1995</p>
              </div>
              <div className="w-3/4 pl-4 border-l-4 border-teal-500">
                <h3 className="text-xl font-semibold">Founded in Colombo</h3>
                <p className="text-gray-600">Pearl Residencies was established, marking the beginning of luxury apartment living.</p>
                <div className="w-32 h-20 bg-gray-300 mt-2">
                  {/* Photo Spot: Founding Ceremony */}
                  <img
                    src={foundingPhoto}
                    alt="Founding ceremony of Pearl Residencies"
                    className="w-full h-full object-cover"
                  />
                  {/* Photo Spot: Founding Ceremony */}
                  {/* Replace with: <img src={foundingPhoto} alt="Founding ceremony" /> */}
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-1/4 text-right pr-4">
                <p className="text-gray-600">2005</p>
              </div>
              <div className="w-3/4 pl-4 border-l-4 border-teal-500">
                <h3 className="text-xl font-semibold">First Award Won</h3>
                <p className="text-gray-600">Received the Colombo Excellence Award for Best Residential Development.</p>
                <div className="w-32 h-20 bg-gray-300 mt-2">
                  {/* Photo Spot: Award Ceremony */}
                  <img
                    src={awardsPhoto}
                    alt="Award ceremony at Pearl Residencies"
                    className="w-full h-full object-cover"
                  />

                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-1/4 text-right pr-4">
                <p className="text-gray-600">2015</p>
              </div>
              <div className="w-3/4 pl-4 border-l-4 border-teal-500">
                <h3 className="text-xl font-semibold">Expanded to 500 Units</h3>
                <p className="text-gray-600">Grew to accommodate over 500 families with new amenities.</p>
                <div className="w-32 h-20 bg-gray-300 mt-2">
                  {/* Photo Spot: Expansion Photo */}
                  <img 
                    src={Gathering}
                    alt="Community gathering at Pearl Residencies"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications & Approvals */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-teal-700">Our Credibility</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-teal-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition">
              <h3 className="text-xl font-semibold text-teal-600">Government Approval</h3>
              <p className="text-gray-600 mt-2">Certified by the Urban Development Authority (UDA) in 2000 for sustainable construction.</p>
            </div>
            <div className="bg-teal-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition">
              <h3 className="text-xl font-semibold text-teal-600">ISO 9001 Certification</h3>
              <p className="text-gray-600 mt-2">Achieved in 2010 for quality management in residential services.</p>
            </div>
            <div className="bg-teal-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition">
              <h3 className="text-xl font-semibold text-teal-600">Environmental Award</h3>
              <p className="text-gray-600 mt-2">Recognized by the Ministry of Environment in 2020 for green initiatives.</p>
            </div>
          </div>
          <div className="w-1/2 h-58 bg-gray-300 mx-auto mt-6 overflow-hidden">
            <img
              src ={Community}
              alt="Certificates display"
              className="w-full h-full object-cover"
            />
            {/* Photo Spot: Certificates Display */}
            {/* Replace with: <img src={certificatePhoto} alt="Certificates display" /> */}
          </div>
        </div>
      </section>

      {/* Community Impact */}
      <section className="py-16 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-teal-700">Our Community Impact</h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Pearl Residencies has donated over LKR 5 million to local charities and hosted free community events annually since 2010, enriching Colombo’s social fabric.
          </p>
          <p className="text-gray-700">
            We’ve partnered with schools to provide educational resources and supported environmental clean-up drives, earning community trust.
          </p>
        </div>
      </section>

      {/* Future Vision */}
      <section className="py-16 bg-gray-100 text-center">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-teal-700">Our Future Vision</h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            By 2030, we aim to expand to 1000 units, introduce smart home technology, and achieve carbon neutrality, setting new standards in luxury living.
          </p>
          <div className="w-1/2 h-49 bg-gray-300 mx-auto overflow-hidden">
            <img
              src={future}
              alt="Future vision of Pearl Residencies"
              className="w-full h-full object-cover"
            />
            {/* Photo Spot: Future Vision Photo */}
            {/* Replace with: <img src={futurePhoto} alt="Future vision" /> */}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-teal-700 text-white p-6 text-center">
        <div className="container mx-auto">
          <ul className="flex justify-center space-x-6 mb-4">
            <li><Link to="/landing" className="hover:text-teal-200">Home</Link></li>
            <li><Link to="/apartments" className="hover:text-teal-200">Apartments</Link></li>
            <li><Link to="/about" className="hover:text-teal-200">About</Link></li>
            <li><Link to="/contact" className="hover:text-teal-200">Contact</Link></li>
          </ul>
          <p className="text-sm">Pearl Residencies © 2025 | 123 Main Street, Colombo, Sri Lanka</p>
          <p className="text-sm mt-2">Follow us: 
            <div className="inline-flex space-x-4 ml-2 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 px-2 py-1 rounded">
                              <img src="https://cdn.simpleicons.org/facebook/1877F2" alt="Facebook icon" className="w-6 h-6 mr-2" />
                              <img src="https://cdn.simpleicons.org/instagram/E1306C" alt="Instagram icon" className="w-6 h-6 mr-2" />
                      </div>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SDAboutUsPage;