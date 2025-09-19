import React from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  UserCog,
  CreditCard,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/vd_AuthContext';
import{ useNavigate} from "react-router-dom";

const Sidebar = ({ activeItem, onItemClick }) => {

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'order', label: 'Order', icon: ShoppingCart },
    { id: 'product', label: 'Product', icon: Package },
    { id: 'customer', label: 'Customer', icon: Users },
    { id: 'employee', label: 'Employee', icon: UserCog },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const settingsSubmenu = [
    { id: 'account-information', label: 'Account Information' },
    { id: 'change-password', label: 'Change Password' },
    { id: 'notification', label: 'Notification' },
    { id: 'personalization', label: 'Personalization' },
    { id: 'security-privacy', label: 'Security & Privacy' },
  ];

  return (
    <div className="w-64 bg-white h-screen shadow-sm border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="font-semibold text-gray-900">Puzzler</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeItem === item.id
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.label}
            </button>
          );
        })}

        {/* Settings Section */}
        <div className="pt-4">
          <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-900">
            <Settings className="mr-3 h-5 w-5" />
            Settings
            <ChevronRight className="ml-auto h-4 w-4" />
          </div>
          <div className="ml-6 space-y-1">
            {settingsSubmenu.map((item) => (
              <button
                key={item.id}
                onClick={() => onItemClick(item.id)}
                className={`w-full text-left px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  activeItem === item.id
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-200 space-y-1">
        <button
          onClick={() => onItemClick('help')}
          className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeItem === 'help'
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <HelpCircle className="mr-3 h-5 w-5" />
          Help
        </button>
        <button
          onClick={() => onItemClick(handleLogout)}
          className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Log out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;