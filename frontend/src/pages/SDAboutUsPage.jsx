import React from 'react';
import { Link } from 'react-router-dom';
import legacyPhoto from '../assets/historical.jpg';
import foundingPhoto from '../assets/founding.jpeg';
import awardsPhoto from '../assets/awards.jpeg';
import Gathering from '../assets/gathering.jpg';
import Community from '../assets/commiunity-awards.jpg';
import future from '../assets/future.jpg';
import logo from '../assets/logo.png'

const SDAboutUsPage = () => {
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
                 <a href="/landing" className="hover:text-teal-600 transition">Home</a>
                 <a href="/about" className="hover:text-teal-600 transition">About</a>
                 <a href="/apartments" className="hover:text-teal-600 transition">Apartment</a>
                 <a href="/contact" className="hover:text-teal-600 transition">Contact</a>
               </nav>
               <div className="flex items-center gap-3">
                 <Link to="/create" className="bg-teal-600 text-white px-4 py-2 rounded-md shadow hover:bg-teal-700 transition">Contact</Link>
               </div>
             </div>
           </header>

      {/* Introduction */}
      <section className="relative h-[68vh] flex items-center bg-gray-900 overflow-hidden">
        <img src={legacyPhoto} alt="Historical view of Pearl Residencies" className="absolute inset-0 w-full h-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="max-w-4xl mx-auto text-white">
            <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">Our Legacy at Pearl Residencies</h2>
            <p className="mt-4 text-lg text-white/90 max-w-2xl mx-auto">
              Since 1995, Pearl Residencies has been a cornerstone of luxury living in Colombo, building a legacy of excellence and community.
            </p>
          </div>
        </div>
      </section>

      {/* Milestone Timeline */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-teal-700 text-center">Our Journey</h2>
          <div className="space-y-12">
            <div className="flex items-center">
              <div className="w-1/4 text-right pr-6">
                <p className="text-gray-600 font-medium">1995</p>
              </div>
              <div className="w-3/4 pl-6 border-l-4 border-teal-500">
                <h3 className="text-xl font-semibold">Founded in Colombo</h3>
                <p className="text-gray-600 mt-2">Pearl Residencies was established, marking the beginning of luxury apartment living.</p>
                <div className="w-40 h-24 bg-gray-300 mt-4 overflow-hidden rounded shadow-md hover:shadow-lg transition">
                  <img src={foundingPhoto} alt="Founding ceremony of Pearl Residencies" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-1/4 text-right pr-6">
                <p className="text-gray-600 font-medium">2005</p>
              </div>
              <div className="w-3/4 pl-6 border-l-4 border-teal-500">
                <h3 className="text-xl font-semibold">First Award Won</h3>
                <p className="text-gray-600 mt-2">Received the Colombo Excellence Award for Best Residential Development.</p>
                <div className="w-40 h-24 bg-gray-300 mt-4 overflow-hidden rounded shadow-md hover:shadow-lg transition">
                  <img src={awardsPhoto} alt="Award ceremony at Pearl Residencies" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-1/4 text-right pr-6">
                <p className="text-gray-600 font-medium">2015</p>
              </div>
              <div className="w-3/4 pl-6 border-l-4 border-teal-500">
                <h3 className="text-xl font-semibold">Expanded to 500 Units</h3>
                <p className="text-gray-600 mt-2">Grew to accommodate over 500 families with new amenities.</p>
                <div className="w-40 h-24 bg-gray-300 mt-4 overflow-hidden rounded shadow-md hover:shadow-lg transition">
                  <img src={Gathering} alt="Community gathering at Pearl Residencies" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications & Approvals */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8 text-teal-700">Our Credibility</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-teal-50 p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-teal-600">Government Approval</h3>
              <p className="text-gray-600 mt-2">Certified by the Urban Development Authority (UDA) in 2000 for sustainable construction.</p>
            </div>
            <div className="bg-teal-50 p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-teal-600">ISO 9001 Certification</h3>
              <p className="text-gray-600 mt-2">Achieved in 2010 for quality management in residential services.</p>
            </div>
            <div className="bg-teal-50 p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-teal-600">Environmental Award</h3>
              <p className="text-gray-600 mt-2">Recognized by the Ministry of Environment in 2020 for green initiatives.</p>
            </div>
          </div>
          <div className="w-1/2 h-64 bg-gray-300 mx-auto mt-8 overflow-hidden rounded-lg shadow-md hover:shadow-lg transition">
            <img src={Community} alt="Certificates display" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Community Impact */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8 text-teal-700">Our Community Impact</h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Pearl Residencies has donated over LKR 5 million to local charities and hosted free community events annually since 2010, enriching Colombo’s social fabric.
          </p>
          <p className="text-gray-700 max-w-2xl mx-auto">
            We’ve partnered with schools to provide educational resources and supported environmental clean-up drives, earning community trust.
          </p>
        </div>
      </section>

      {/* Future Vision */}
      <section className="py-16 bg-gray-100 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4 text-teal-700">Our Future Vision</h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            By 2030, we aim to expand to 1000 units, introduce smart home technology, and achieve carbon neutrality, setting new standards in luxury living.
          </p>
          <div className="w-1/2 h-64 bg-gray-300 mx-auto overflow-hidden rounded-lg shadow-md hover:shadow-lg transition">
            <img src={future} alt="Future vision of Pearl Residencies" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-teal-700 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <ul className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6 mb-6">
            <li><Link to="/landing" className="hover:text-teal-200 transition">Home</Link></li>
            <li><Link to="/apartments" className="hover:text-teal-200 transition">Apartments</Link></li>
            <li><Link to="/about" className="hover:text-teal-200 transition">About</Link></li>
            <li><Link to="/contact" className="hover:text-teal-200 transition">Contact</Link></li>
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

export default SDAboutUsPage;