// vd_profileSettings.jsx
import React, { useEffect, useState } from 'react';
import UserProfile from '../pages/vd_userProfile';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const ProfileSettings = () => {
  const { userId } = useParams(); // get userId from route
  const location = useLocation();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('account-information');

  // Sync active tab with ?tab=
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab) setActiveItem(tab);
  }, [location.search]);

  const handleItemClick = (item) => {
    setActiveItem(item);
    const params = new URLSearchParams(location.search);
    params.set('tab', item);
    navigate({ search: params.toString() }, { replace: true });
  };

  const renderContent = () => {
    switch (activeItem) {
      case "account-information":
        return <UserProfile userId={userId} />;
      case "change-password":
        return (
          <div className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Change Password
              </h2>
              <p className="text-gray-600">
                Password change functionality coming soon.
              </p>
            </div>
          </div>
        );
      case "notification":
        return (
          <div className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Notification Settings
              </h2>
              <p className="text-gray-600">
                Notification preferences coming soon.
              </p>
            </div>
          </div>
        );
      case "personalization":
        return (
          <div className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Personalization
              </h2>
              <p className="text-gray-600">
                Personalization options coming soon.
              </p>
            </div>
          </div>
        );
      case "security-privacy":
        return (
          <div className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Security & Privacy
              </h2>
              <p className="text-gray-600">
                Security and privacy settings coming soon.
              </p>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {activeItem
                  .replace("-", " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </h2>
              <p className="text-gray-600">This section is coming soon.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex-1">
      {renderContent()}
    </div>
  );
};

export default ProfileSettings;
