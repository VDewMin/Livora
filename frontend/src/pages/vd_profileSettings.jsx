import React, { useState } from 'react';
import Sidebar from '../components/vd_sidebar';
import ProfileHeader from '../components/vd_profileHeader';
import UserProfile from '../pages/vd_userProfile';
import { useParams, useNavigate } from 'react-router-dom'; // use react-router-dom

const ProfileSettings = () => {
  const { userId } = useParams(); // call useParams()
  const navigate = useNavigate(); // move inside component

  const [activeItem, setActiveItem] = useState('account-information');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleItemClick = (item) => {
    setActiveItem(item);

    // Only navigate if needed
    if (item === 'billing') {
      navigate("/admin/billing");
    }
    else if(item === 'parcel-logs'){
      navigate("/viewParcels");
    }
    else if(item === 'dashboard'){
      navigate("/secDashboard");
    }
    else if(item === 'add-parcel'){
      navigate("/addParcel");
    }
    else if(item === 'parcel-pickup-verification'){
      navigate("/scanner");
    }

    console.log('Navigating to:', item);
  };

  const renderContent = () => {
    switch (activeItem) {
      case 'account-information':
        return <UserProfile userId={userId} />;
      case 'change-password':
        return (
          <div className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Change Password</h2>
              <p className="text-gray-600">Password change functionality coming soon.</p>
            </div>
          </div>
        );
      case 'notification':
        return (
          <div className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Notification Settings</h2>
              <p className="text-gray-600">Notification preferences coming soon.</p>
            </div>
          </div>
        );
      case 'personalization':
        return (
          <div className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Personalization</h2>
              <p className="text-gray-600">Personalization options coming soon.</p>
            </div>
          </div>
        );
      case 'security-privacy':
        return (
          <div className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Security & Privacy</h2>
              <p className="text-gray-600">Security and privacy settings coming soon.</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {activeItem.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </h2>
              <p className="text-gray-600">This section is coming soon.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex -m-4">
      {/* Sidebar */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-0'} flex-shrink-0`}>
        <Sidebar activeItem={activeItem} onItemClick={handleItemClick} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <ProfileHeader />
        {renderContent()}
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default ProfileSettings;
