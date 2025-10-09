import React from 'react';
import { Link } from 'react-router-dom';
import phoneIcon from '../assets/TELEFONE.jpeg'; // Placeholder image import
import emailIcon from '../assets/gmail.jpeg';
import locationIcon from '../assets/location.jpeg';
import toast from 'react-hot-toast'; // Assuming toast is available

const SDContactUsPage = () => {
  // Function to copy text to clipboard
  const handleCopyPhone = (phone) => {
    navigator.clipboard.writeText(phone).then(() => {
      toast.success(`Copied ${phone} to clipboard!`);
    }).catch(err => {
      toast.error('Failed to copy phone number');
      console.error('Copy error:', err);
    });
  };

  // Function to open Gmail with email address
  const handleOpenGmail = (email) => {
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`, '_blank');
  };

  // Function to open Google Maps 
  const handleOpenMap = () => {
    const dummyLocation = '6.9271,79.8612'; 
    window.open(`https://www.google.com/maps/search/?api=1&query=${dummyLocation}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-100 font-sans text-gray-800">
      {/* Header */}
      <header className="bg-teal-700 text-white p-4 shadow-lg">
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
      <section className="py-20 text-center bg-teal-100">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-teal-800">Get in Touch</h2>
          <p className="text-lg mb-6 max-w-xl mx-auto">
            We’re here to assist you with any inquiries about Pearl Residencies. Reach out today!
          </p>
        </div>
      </section>

      {/* Contact Details */}
      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-teal-700 text-center">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Phone */}
            <div className="bg-teal-50 p-6 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1 flex items-center cursor-pointer" onClick={() => handleCopyPhone('+94 112 345 678')}>
              <div className="w-12 h-12 bg-gray-300 mr-4 flex items-center justify-center">
                <img
                  src={phoneIcon}
                  alt="Phone Icon"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-teal-600">Phone</h3>
                <p className="text-gray-600" onClick={() => handleCopyPhone('+94 112 345 678')}>+94 112 345 678</p>
                <p className="text-gray-600" onClick={() => handleCopyPhone('+94 112 345 679')}>+94 112 345 679</p>
              </div>
            </div>

            {/* Email */}
            <div className="bg-teal-50 p-6 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1 flex items-center">
              <div className="w-12 h-12 bg-gray-300 mr-4 flex items-center justify-center">
                <img
                  src={emailIcon}
                  alt="Email Icon"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-teal-600">Email</h3>
                <p className="text-gray-600 cursor-pointer" onClick={() => handleOpenGmail('pearlresidentcies@gmail.com')}>pearlresidentcies@gmail.com</p>
                <p className="text-gray-600 cursor-pointer" onClick={() => handleOpenGmail('support@pearlresidencies.com')}>support@pearlresidencies.com</p>
              </div>
            </div>

            {/* Address */}
            <div className="bg-teal-50 p-6 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1 flex items-center cursor-pointer" onClick={handleOpenMap}>
              <div className="w-12 h-12 bg-gray-300 mr-4 flex items-center justify-center">
                <img
                  src={locationIcon}
                  alt="Location Icon"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-teal-600">Address</h3>
                <p className="text-gray-600">123 Main Street, Colombo 03, Sri Lanka</p>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-teal-50 p-6 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1 flex items-center col-span-1 md:col-span-2 lg:col-span-3">
              <div className="w-12 h-12 mr-4 flex items-center justify-center">
                {/* Icon Placeholder: Social Media */}
              </div>
              <div className="grid grid-cols-2 gap-4 w-full">
                <a href="#" className="flex items-center text-teal-600 hover:text-teal-800 hover:bg-teal-100 p-2 rounded transition-colors">
                  <img src="https://cdn.simpleicons.org/facebook/1877F2" alt="Facebook icon" className="w-6 h-6 mr-2" />
                  Facebook
                </a>
                <a href="#" className="flex items-center text-teal-600 hover:text-teal-800 hover:bg-teal-100 p-2 rounded transition-colors">
                  <img src="https://cdn.simpleicons.org/twitter/1DA1F2" alt="Twitter icon" className="w-6 h-6 mr-2" />
                  Twitter
                </a>
                <a href="#" className="flex items-center text-teal-600 hover:text-teal-800 hover:bg-teal-100 p-2 rounded transition-colors">
                  <img src="https://cdn.simpleicons.org/instagram/E1306C" alt="Instagram icon" className="w-6 h-6 mr-2" />
                  Instagram
                </a>
                <a href="#" className="flex items-center text-teal-600 hover:text-teal-800 hover:bg-teal-100 p-2 rounded transition-colors">
                  <img src="https://cdn.simpleicons.org/linkedin/0077B5" alt="LinkedIn icon" className="w-6 h-6 mr-2" />
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-teal-100 text-center">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-teal-800">Send Us a Message</h2>
          <p className="text-gray-700 mb-6 max-w-xl mx-auto">
            Have questions? Fill out the form below or contact us directly!
          </p>
          <Link
            to="/create"
            className="bg-teal-700 text-white px-6 py-3 rounded-lg hover:bg-teal-800 transition duration-200 font-semibold"
          >
            Contact Us Now
          </Link>
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
          <p className="text-sm mt-2">Email: pearlresidencies@gmail.com | Phone: +94 112 345 678</p>
        </div>
      </footer>
    </div>
  );
};

export default SDContactUsPage;