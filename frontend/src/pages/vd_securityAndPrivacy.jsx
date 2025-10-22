import { useEffect, useState} from "react";
import { Shield, Lock, Eye, EyeOff, Key, Smartphone, Bell, Database, UserX, Download, Trash2, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";
import { useAuth } from "../context/vd_AuthContext";
import html2pdf from "html2pdf.js";
import "jspdf-autotable";
import ConfirmDialog from "../components/vd_confirmDialog.jsx";
import { useNavigate } from "react-router-dom";

const SecurityPrivacy = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const getProfilePictureDataUrl = (profilePicture) => {
  if (!profilePicture?.data || !profilePicture?.contentType) return null;

  // If already a string, use directly
  if (typeof profilePicture.data === "string") {
    return `data:${profilePicture.contentType};base64,${profilePicture.data}`;
  }

  // If it's a Buffer-like object (Mongoose), convert to Base64
  if (profilePicture.data.data) { // check if it's nested Uint8Array
    const binary = new Uint8Array(profilePicture.data.data)
      .reduce((acc, byte) => acc + String.fromCharCode(byte), '');
    return `data:${profilePicture.contentType};base64,${btoa(binary)}`;
  }

  return null;
};


  // Load current 2FA status on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get("/users/2fa-status");
        setTwoFactorEnabled(res.data?.twoFactorEnabled || false);
      } catch (e) {
        
      }
    })();
  }, []);

  

  const handleEnable2FA = async () => {
    try {
      setLoading(true);
      // Request backend to send OTP
      await axiosInstance.post("/users/send-2fa-otp");
      setShowOtpInput(true);
      toast.success("OTP sent to your email");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.post("/users/toggle-2fa", { otp, enabled: true });
      setTwoFactorEnabled(res.data.twoFactorEnabled);
      setShowOtpInput(false);
      setOtp("");
      toast.success("Two-factor authentication enabled");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to enable 2FA");
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.post("/users/toggle-2fa", { enabled: false });
      setTwoFactorEnabled(res.data.twoFactorEnabled);
      toast.success("Two-factor authentication disabled");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to disable 2FA");
    } finally {
      setLoading(false);
    }
  };

  const handleDataDownload = () => {

    let profilePicUrl = null;
    if (user.profilePicture?.data && user.profilePicture?.contentType) {
      // Convert Binary to base64
      const base64String = btoa(
        new Uint8Array(user.profilePicture.data.data)
          .reduce((data, byte) => data + String.fromCharCode(byte), "")
      );
      profilePicUrl = `data:${user.profilePicture.contentType};base64,${base64String}`;
    }

    if (!user) return toast.error("User data not available");

    const pdfDiv = document.createElement("div");
    pdfDiv.className = "min-h-screen bg-slate-100 p-8";

    pdfDiv.innerHTML = `
      <div class="max-w-4xl mx-auto bg-white shadow-2xl">
        <!-- Header -->
        <div class="border-b-4 border-blue-600 p-8 bg-gradient-to-r from-blue-50 to-blue-100">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h1 class="text-4xl font-bold text-blue-700">Pearl Residencies</h1>
              <p class="text-gray-600 text-lg">Premium Living Spaces</p>
            </div>
            <div class="text-right">
              <h2 class="text-2xl font-bold text-gray-800">USER PROFILE REPORT</h2>
              <p class="text-gray-600 text-sm mt-1">Personal Information Summary</p>
            </div>
          </div>
        </div>

        <!-- Profile Info -->
        <div class="p-8 bg-gray-50 border-b-2 border-gray-200">
          <div class="flex items-center gap-6 mb-6">
            ${
              profilePicUrl
                ? `<img src="${profilePicUrl}" alt="Profile Picture" class="w-24 h-24 rounded-full object-cover border-4 border-blue-500 shadow-md" />`
                : `<div class="w-24 h-24 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 text-3xl font-bold shadow-md">
                    ${user.firstName ? user.firstName[0] : "U"}
                  </div>`
            }

            <div>
              <h3 class="text-2xl font-bold text-gray-800">${user.firstName || "-"} ${user.lastName || ""}</h3>
              <p class="text-gray-600">${user.email || "-"}</p>
              <p class="text-gray-600">${user.role || "-"}</p>
            </div>
          </div>

          <h3 class="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-blue-500">CONTACT DETAILS</h3>
          <div class="grid grid-cols-2 gap-6">
            <div>
              <p class="text-sm text-gray-600 font-semibold">Phone Number</p>
              <p class="text-gray-800 text-base font-semibold">${user.phoneNo || "-"}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600 font-semibold">Secondary Phone</p>
              <p class="text-gray-800 text-base font-semibold">${user.secondaryPhoneNo || "-"}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600 font-semibold">Recovery Email</p>
              <p class="text-gray-800 text-base font-semibold">${user.recoveryEmail || "-"}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600 font-semibold">Apartment No</p>
              <p class="text-gray-800 text-base font-semibold">${user.apartmentNo || "-"}</p>
            </div>
          </div>
        </div>

        <!-- Personal Information -->
        <div class="p-8 border-b-2 border-gray-200">
          <h3 class="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-blue-500">PERSONAL INFORMATION</h3>
          <div class="grid grid-cols-2 gap-6">
            <div>
              <p class="text-sm text-gray-600 font-semibold">Date of Birth</p>
              <p class="text-gray-800 text-base">${user.dateOfBirth || "-"}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600 font-semibold">Resident Type</p>
              <p class="text-gray-800 text-base">${user.residentType || "-"}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600 font-semibold">Staff Type</p>
              <p class="text-gray-800 text-base">${user.staffType || "-"}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600 font-semibold">Job</p>
              <p class="text-gray-800 text-base">${user.job || "-"}</p>
            </div>
          </div>
        </div>

        <!-- Emergency & Family -->
        <div class="p-8 border-b-2 border-gray-200">
          <h3 class="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-blue-500">EMERGENCY & FAMILY</h3>
          <div class="grid grid-cols-2 gap-6">
            <div>
              <p class="text-sm text-gray-600 font-semibold">Emergency Contact Name</p>
              <p class="text-gray-800 text-base">${user.emergencyContactName || "-"}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600 font-semibold">Emergency Contact Number</p>
              <p class="text-gray-800 text-base">${user.emergencyContactNumber || "-"}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600 font-semibold">Family Members</p>
              <p class="text-gray-800 text-base">${user.familyMembers || "-"}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600 font-semibold">Medical Conditions</p>
              <p class="text-gray-800 text-base">${user.medicalConditions || "-"}</p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-8 bg-gradient-to-r from-blue-50 to-blue-100 border-t-4 border-blue-600 text-center">
          <p class="font-semibold text-gray-800 text-lg mb-2">Pearl Residencies</p>
          <p class="text-gray-700">Premium Living Spaces</p>
          <p class="text-gray-700 text-sm mt-2">Customer Support: +971 4 XXXX XXXX</p>
          <p class="text-gray-700 text-sm">Website: www.pearlresidencies.com</p>
          <div class="text-xs text-gray-600 mt-6 pt-4 border-t border-gray-300">
            <p>This document is confidential and intended solely for the addressee.</p>
            <p class="mt-1">Generated on: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    `;

    const opt = {
      margin: 0.5,
      filename: `${user.firstName || "User"}_${user._id}_Profile.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a2", orientation: "portrait" },
    };

    html2pdf().set(opt).from(pdfDiv).save();

    toast.success("User profile exported successfully");
  };


  const handleAccountDelete = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Account',
      message: 'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.',
      onConfirm: async () => {
        try {
          setLoading(true);
          await axiosInstance.delete(`/users/${user._id}`);
          toast.success("Account deleted successfully!");
          logout();
          navigate("/login");
        } catch (error) {
          console.error("Error deleting account:", error);
          toast.error(error.response?.data?.message || "Failed to delete account");
        } finally {
          setLoading(false);
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Security & Privacy</h1>
            <p className="text-gray-600 mt-1">Manage your account security and privacy settings</p>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Lock className="w-5 h-5 mr-2 text-blue-600" />
            Two-Factor Authentication
          </h3>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Smartphone className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">Enhanced Account Security</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Two-factor authentication adds an extra layer of security to your account. When enabled, 
                  you'll need to enter a verification code from your mobile device in addition to your password.
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      twoFactorEnabled 
                        ? "bg-green-100 text-green-700" 
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {twoFactorEnabled ? "Enabled" : "Disabled"}
                    </span>
                  </div>

                  {/* Enable/Disable 2FA buttons */}
                  {!twoFactorEnabled && !showOtpInput && (
                    <button
                      onClick={handleEnable2FA}
                      disabled={loading}
                      className="px-6 py-2 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Processing..." : "Enable 2FA"}
                    </button>
                  )}

                  {!twoFactorEnabled && showOtpInput && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="px-3 py-2 border rounded-lg text-sm"
                      />
                      <button
                        onClick={handleVerify2FA}
                        disabled={loading || otp.length === 0}
                        className="px-4 py-2 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? "Verifying..." : "Verify OTP"}
                      </button>
                    </div>
                  )}

                  {twoFactorEnabled && (
                    <button
                      onClick={handleDisable2FA}
                      disabled={loading}
                      className="px-6 py-2 rounded-lg font-medium bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Processing..." : "Disable 2FA"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

       {/*  <div className="bg-white rounded-2xl shadow-sm p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-blue-600" />
            Privacy Settings
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-4 border-b border-gray-200">
              <div>
                <h4 className="font-medium text-gray-900">Email Notifications</h4>
                <p className="text-sm text-gray-600">Receive updates about your account activity</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" disabled/>
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-4 border-b border-gray-200">
              <div>
                <h4 className="font-medium text-gray-900">SMS Notifications</h4>
                <p className="text-sm text-gray-600">Get text messages for important alerts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" disabled/>
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-4 border-b border-gray-200">
              <div>
                <h4 className="font-medium text-gray-900">Activity Tracking</h4>
                <p className="text-sm text-gray-600">Allow us to track your activity for better experience</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" disabled/>
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-4">
              <div>
                <h4 className="font-medium text-gray-900">Profile Visibility</h4>
                <p className="text-sm text-gray-600">Make your profile visible to other residents</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" disabled/>
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>  */}

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Database className="w-5 h-5 mr-2 text-blue-600" />
            Data Management
          </h3>

          <div className="space-y-4">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Download className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">Download Your Data</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Request a copy of your personal data including profile information.
                  </p>
                  <button
                    onClick={handleDataDownload}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium text-sm"
                  >
                    Request Data Export
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-2xl shadow-sm p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
            Danger Zone
          </h3>

          <div className="bg-white border border-red-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <UserX className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">Delete Account</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Once you delete your account, there is no going back. Please be certain. All your data will be permanently removed.
                </p>
                <button
                  onClick={handleAccountDelete}
                  disabled={loading}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-medium text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                  {loading ? "Deleting..." : "Delete Account"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default SecurityPrivacy;