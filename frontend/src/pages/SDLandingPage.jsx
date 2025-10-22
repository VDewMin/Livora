import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import mainbuilding from '../assets/main-building.jpg';
import opening from '../assets/opening.jpg';
import bedroom from '../assets/bed-room.jpg';
import kitchen from '../assets/kitchen.jpg';
import livingroom from '../assets/living-room.jpg';
import logo from '../assets/logo.png'

// Presentational modern landing page
export default function SDLandingPage() {
  const [activePhoto, setActivePhoto] = useState(null);

  // Photo details with descriptions and metadata
  const galleryPhotos = [
    { 
      src: opening,
      title: "Grand Entrance",
      description: "Modern lobby with 24/7 concierge service",
      details: ["Double-height ceiling", "Designer furnishings", "Smart access control"]
    },
    { 
      src: bedroom,
      title: "Master Bedroom",
      description: "Spacious bedrooms with natural light",
      details: ["En-suite bathroom", "Built-in wardrobes", "City views"]
    },
    { 
      src: kitchen,
      title: "Gourmet Kitchen",
      description: "Premium appliances and finishes",
      details: ["Stone countertops", "European appliances", "Custom cabinetry"]
    },
    { 
      src: livingroom,
      title: "Living Space",
      description: "Open-plan living areas",
      details: ["Floor-to-ceiling windows", "Balcony access", "Smart lighting"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
     { /* Header */}
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
          <Link to="/livora" className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-700 transition">Livora Landing</Link>
            </div>
          </div>
        </header>
        <section id="home" className="relative h-[68vh] flex items-center bg-gray-900 overflow-hidden">
          <img src={mainbuilding} alt="Hero Building" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
          <div className="container mx-auto px-6 relative z-10 text-center">
            <div className="max-w-4xl mx-auto text-white">
          <div className="text-sm uppercase tracking-widest mb-2">Now Leasing</div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">Pearl Residencies — Modern, Comfortable, Connected</h1>
          <p className="mt-4 text-lg text-white/90">Discover thoughtfully designed apartments with premium amenities and a vibrant community.</p>
          <div className="mt-6 flex gap-4 justify-center">
            <Link to="/apartments" className="bg-white text-teal-600 px-6 py-3 rounded-md font-semibold shadow hover:bg-gray-100 transition">View Apartments</Link>
            <Link to="#contact" className="text-white/90 underline hover:text-white transition">Schedule a Visit</Link>
          </div>
            </div>
          </div>
        </section>

        {/* Features Strip */}
      <section className="py-12 -mt-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-2">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded bg-teal-600 flex items-center justify-center text-white">🏋️</div>
                <div>
                  <div className="font-semibold">Fitness Centre</div>
                  <div className="text-sm text-gray-500">Open 24/7 with modern equipment</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-2">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded bg-teal-600 flex items-center justify-center text-white">🏊</div>
                <div>
                  <div className="font-semibold">Rooftop Pool</div>
                  <div className="text-sm text-gray-500">Panoramic views and lounge area</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-2">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded bg-teal-600 flex items-center justify-center text-white">🛡️</div>
                <div>
                  <div className="font-semibold">Secure & Managed</div>
                  <div className="text-sm text-gray-500">24/7 security and on-site management</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-8">Gallery</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-lg overflow-hidden shadow-lg">
              <img src={opening} alt="Showcase Entrance" className="w-full h-[520px] object-cover hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="grid grid-cols-1 gap-4">
              {galleryPhotos.map((photo, index) => (
                <div key={index} className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
                  <img
                    src={photo.src}
                    alt={`${photo.title}`}
                    className="w-full h-48 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => setActivePhoto(photo)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        {activePhoto && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center" onClick={() => setActivePhoto(null)}>
            <div className="relative max-w-4xl w-full p-6">
              <img src={activePhoto.src} alt={activePhoto.title} className="w-full h-auto max-h-[80vh] object-contain" />
              <div className="text-white mt-4">
                <h3 className="text-xl font-bold">{activePhoto.title}</h3>
                <p className="text-gray-300">{activePhoto.description}</p>
                <ul className="list-disc list-inside mt-2 text-sm">
                  {activePhoto.details.map((detail, i) => <li key={i}>{detail}</li>)}
                </ul>
              </div>
              <button className="absolute top-4 right-4 text-white text-2xl" onClick={() => setActivePhoto(null)}>×</button>
            </div>
          </div>
        )}
      </section>

      {/* Details / CTA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Apartment Details</h2>
          <p className="max-w-2xl mx-auto text-gray-600 mb-6">Spacious floor plans, premium finishes, and smart home features make every unit a great place to live.</p>
          <div className="flex flex-col md:flex-row md:justify-center gap-4">
            <Link to="/create" className="bg-teal-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-teal-700 transition">Contact Leasing</Link>
            <Link to="/apartments" className="border border-gray-200 px-6 py-3 rounded-md hover:bg-gray-50 transition">View Floor Plans</Link>
          </div>
        </div>
      </section>

      {/* Contact Strip */}
      <section className="py-10 bg-gradient-to-r from-teal-600 to-emerald-500 text-white">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold">Ready to Tour?</h3>
            <p className="text-sm opacity-90">Contact our leasing team for availability and private tours.</p>
          </div>
          <div className="flex gap-3">
            <a href="tel:+94112345678" className="bg-white text-teal-600 px-4 py-2 rounded-md font-semibold hover:bg-gray-100 transition">Call +94 11 234 5678</a>
            <Link to="/create" className="bg-white/10 text-white px-4 py-2 rounded-md hover:bg-white/20 transition">Request Info</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-white font-bold mb-2">Pearl Residencies</div>
            <p className="text-sm">Luxury apartments in Colombo. Experience modern living with convenient access to shopping, dining, and transport.</p>
          </div>
          <div>
            <div className="font-semibold mb-2">Quick Links</div>
            <ul className="text-sm space-y-1">
              <li><a href="#apartments" className="hover:text-white transition">Apartments</a></li>
              <li><a href="#gallery" className="hover:text-white transition">Gallery</a></li>
              <li><a href="#contact" className="hover:text-white transition">Contact</a></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2">Contact</div>
            <p className="text-sm">Email: info@pearlresidencies.com</p>
            <p className="text-sm">Phone: +94 11 234 5678</p>
          </div>
          <div>
            <div className="font-semibold mb-2">Follow</div>
            <div className="flex gap-3 mt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/10 rounded flex items-center justify-center hover:bg-white/20 transition">
                <img src="https://cdn.simpleicons.org/facebook/1877F2" alt="Facebook" className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/10 rounded flex items-center justify-center hover:bg-white/20 transition">
                <img src="https://cdn.simpleicons.org/instagram/E1306C" alt="Instagram" className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/10 rounded flex items-center justify-center hover:bg-white/20 transition">
                <img src="https://cdn.simpleicons.org/twitter/1DA1F2" alt="Twitter" className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-6 mt-8 text-center text-sm text-gray-500">© {new Date().getFullYear()} Pearl Residencies. All rights reserved.</div>
      </footer>
    </div>
  );
}