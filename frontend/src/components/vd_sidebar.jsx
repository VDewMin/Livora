import {
  LayoutDashboard,
  BrushCleaning,
  Album,
  Package,
  CreditCard,
  UserCog,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  ScanLine,
  PackagePlus,
  Building2,
  NotepadText,
  Users,
  MessageSquareHeart,
  Grid3x3,
  Shirt

} from "lucide-react";
import { useAuth } from "../context/vd_AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

const roleRoutes = {
  Admin: {
    dashboard: "/admin/dashboard/",
    deliveries: "/admin/deliveries",
    services: "/admin/admin-view",
    booking: "/admin/convention-hall-bookings",
    billing: "/admin/billing",
    "staff-management": "/admin/stafflist",
    "resident-management": "admin/residentlist",
    announcements: "/admin/send-announcements",
    feedback: "/admin/feedback",

    //"resident-management": "admin/residentlist",
    apartments: "/purchases",
    help: "/help"
  },
  Resident: {
    dashboard: `/resident/dashboard/userId`,
  
    services: "/resident/user-view",
    booking: "/convention-hall-home",
    billing: "/resident/billing",
    feedback: "/resident/feedback",
    help: "/help"
  },
  Security: {
    dashboard: "/securityDashboard",
    deliveries: "/security/deliveries",
    "parcel-logs": "/viewParcels",
    "parcel-pickup-verification": "/scanner",
    "add-parcel": "/addParcel",
    "parcel-slots": "/slots",
    help: "/help"
  },

  Laundry: {
    dashboard: "/laundry/dashboard",
    help: "/help",
    requests: "/laundry/staff",
  },
};

const Sidebar = ({ activeItem, onItemClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleLogoutClick = () => setShowLogoutConfirm(true);

  const confirmLogout = () => {
    logout();
    navigate("/login");
    setShowLogoutConfirm(false);
  };

  const cancelLogout = () => setShowLogoutConfirm(false);
const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["Admin", "Resident", "Staff", "Security", "Laundry"]  },
  { id: "services", label: "Services", icon: BrushCleaning, roles: ["Resident", "Admin"] },
  { id: "booking", label: "Booking", icon: Album, roles: ["Resident", "Admin"] },
  { id: "deliveries", label: "Deliveries", icon: Package, roles: ["Admin"] },
  { id: "billing", label: "Finance", icon: CreditCard, roles: ["Resident", "Admin"] },
  { id: "billing", label: "Billing", icon: CreditCard, roles: ["Resident", "Admin"] },
  //{ id: "analytics", label: "Analytics", icon: BarChart3, roles: ["Admin"] },
  { id: "resident-management", label: "Residents", icon: Users, roles:["Admin"]},
  { id: "staff-management", label: "Employees", icon: UserCog, roles: ["Admin"] },
  { id: "parcel-logs", label: "Parcel Entries", icon: Package, roles: ["Security"] , route: "/viewParcels"},
  { id: "add-parcel", label: "Add Parcel", icon: PackagePlus, roles: ["Security"]},
  { id: "parcel-pickup-verification", label: "Qr Verification", icon: ScanLine, roles:["Security"]},
  { id: "parcel-slots", label: "Parcel Slots", icon: Grid3x3, roles: ["Security"]},
  { id: "apartments", label: "Apartments", icon: Building2, roles: ["Admin"]},
  { id: "announcements", label: "Announcements", icon: NotepadText, roles: ["Admin"] },
  { id: "feedback", label: "Feedback", icon: MessageSquareHeart, roles: ["Resident", "Admin"] },
  { id: "requests", label: "Laundry Requests", icon: Shirt, roles: ["Laundry"],route:"/laundry/staff" },


]
  const effectiveRole =
    user?.role === "Staff" && user?.staffType ? user.staffType : user?.role;

  const allowedMenuItems = menuItems.filter((item) =>
    item.roles.includes(effectiveRole)
  );

  const handleMenuClick = (item) => {
    const route = roleRoutes[effectiveRole]?.[item.id] || null;
    if (route) {
      navigate(route);
    } else {
      onItemClick(item.id);
    }
  };

  const settingsSubmenu = [
    {
      id: "account-information",
      label: "Account Information",
      route: (user) => `/profile/${user._id}`,
    },
    {
      id: "change-password",
      label: "Change Password",
      route: (user) => `/change-password/${user._id}`,
    },
    {
      id: "notification",
      label: "Notification",
      route: (user) => `/notifications/${user._id}`,
    },
    {
      id: "security-privacy",
      label: "Security & Privacy",
      route: (user) => `/security-privacy/${user._id}`,
    },
  ];

  return (
    <div className="w-64 bg-white h-screen shadow-sm border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <span className="font-semibold text-gray-900">Livora</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {allowedMenuItems.map((item) => {
          const Icon = item.icon;
          const route = roleRoutes[effectiveRole]?.[item.id] || null;

          return (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item)}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                route && location.pathname === route
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.label}
            </button>
          );
        })}

        {/* Settings */}
        <div className="pt-4">
          {/* settings row */}
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Settings className="mr-3 h-5 w-5" />
            Settings
            <ChevronRight
              className={`ml-auto h-4 w-4 transform transition-transform duration-200 ${
                isSettingsOpen ? "rotate-90" : ""
              }`}
            />
          </button>

          {/* Submenu */}
          {isSettingsOpen && (
            <div className="ml-6 mt-1 space-y-1">
              {settingsSubmenu.map((item) => {
                const route = item.route ? item.route(user) : null;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.route) {
                        navigate(item.route(user));
                      } else {
                        onItemClick(item.id);
                      }
                    }}
                    className={`w-full text-left px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      route && location.pathname === route
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-200 space-y-1">
        <button
          onClick={() => navigate(roleRoutes[effectiveRole]?.help || "/help")}
          className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            location.pathname === "/help"
              ? "bg-gray-100 text-gray-900"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <HelpCircle className="mr-3 h-5 w-5" />
          Help
        </button>
        <>
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Log out
          </button>
          {showLogoutConfirm && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
              <div className="bg-white p-6 rounded shadow-lg">
                <p className="mb-4">Are you sure you want to log out?</p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={cancelLogout}
                    className="px-4 py-2 bg-gray-200 rounded"
                  >
                    No
                  </button>
                  <button
                    onClick={confirmLogout}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      </div>
    </div>
  );
};

export default Sidebar;
