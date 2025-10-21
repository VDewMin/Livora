import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, Check, X, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import axiosInstance from "../lib/axios"; 
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/vd_AuthContext";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  
  // Validation states
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: '',
    color: '',
    requirements: {
      length: false,
      uppercase: false,
      number: false,
      symbol: false
    }
  });
  
  const [validationErrors, setValidationErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Calculate password strength
  const calculatePasswordStrength = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const score = Object.values(requirements).filter(Boolean).length;
    let label = '';
    let color = '';

    if (score === 0) {
      label = '';
      color = '';
    } else if (score <= 2) {
      label = 'Weak';
      color = 'bg-red-500';
    } else if (score === 3) {
      label = 'Medium';
      color = 'bg-yellow-500';
    } else {
      label = 'Strong';
      color = 'bg-green-500';
    }

    return { score, label, color, requirements };
  };

  // Real-time validation
  useEffect(() => {
    if (newPassword) {
      setPasswordStrength(calculatePasswordStrength(newPassword));
    } else {
      setPasswordStrength({ score: 0, label: '', color: '', requirements: { length: false, uppercase: false, number: false, symbol: false } });
    }
  }, [newPassword]);

  useEffect(() => {
    const errors = { ...validationErrors };
    
    if (confirmPassword && newPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    } else if (confirmPassword && newPassword === confirmPassword) {
      errors.confirmPassword = '';
    }
    
    setValidationErrors(errors);
  }, [newPassword, confirmPassword]);

  // Check if form is valid
  const isFormValid = () => {
    return (
      currentPassword &&
      newPassword &&
      confirmPassword &&
      passwordStrength.score >= 3 &&
      newPassword === confirmPassword
    );
  };

  const handleForgotPassword = () => {
    navigate("/account/forgot-password");
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccessMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("New password and confirm password do not match.");
      return;
    }

    if (passwordStrength.score < 3) {
      setMessage("Password does not meet strength requirements.");
      return;
    }

    setLoading(true);
    try {

      const response = await axiosInstance.post("/users/change-password", {
        userId: user._id,
        currentPassword,
        newPassword
      }, 
      {
        headers: {
          Authorization: `Bearer ${user.token}` // from AuthContext
        }
      });

      if (response.data.success) {
        setSuccessMessage(response.data.message);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        // optional: force logout for security
        // logout();
        // navigate("/login");
        logout();
        navigate("/login");

      } else {
        setMessage(response.data.message);
      }

    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage("An error occurred. Please try again.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Change Password</h2>
            </div>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Update your password regularly to keep your account secure. Choose a strong password with a mix of letters, numbers, and symbols.
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-green-700 font-medium">{successMessage}</p>
            </div>
          )}

          {/* Error Message */}
          {message && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700">{message}</p>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-6">
            {/* Current Password */}
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Enter your current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              
              {/* Forgot Password Link */}
              <div className="mt-2">
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                  onClick={handleForgotPassword}
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            {/* New Password Group */}
            <div className="bg-gray-50 p-6 rounded-lg space-y-6">
              <h3 className="font-semibold text-gray-900 text-lg">New Password</h3>
              
              {/* New Password Field */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Password Strength Indicator */}
              {newPassword && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Password Strength</span>
                    <span className={`text-sm font-semibold ${
                      passwordStrength.score <= 2 ? 'text-red-600' : 
                      passwordStrength.score === 3 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                    ></div>
                  </div>
                  
                  {/* Requirements Checklist */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div className={`flex items-center gap-2 ${passwordStrength.requirements.length ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordStrength.requirements.length ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      <span>At least 8 characters</span>
                    </div>
                    <div className={`flex items-center gap-2 ${passwordStrength.requirements.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordStrength.requirements.uppercase ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      <span>One uppercase letter</span>
                    </div>
                    <div className={`flex items-center gap-2 ${passwordStrength.requirements.number ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordStrength.requirements.number ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      <span>One number</span>
                    </div>
                    <div className={`flex items-center gap-2 ${passwordStrength.requirements.symbol ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordStrength.requirements.symbol ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      <span>One symbol</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                      validationErrors.confirmPassword 
                        ? 'border-red-300 focus:border-red-500' 
                        : confirmPassword && newPassword === confirmPassword
                        ? 'border-green-300 focus:border-green-500'
                        : 'border-gray-300 focus:border-blue-500'
                    }`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                
                {/* Validation Message */}
                {confirmPassword && (
                  <div className="mt-2 flex items-center gap-2">
                    {validationErrors.confirmPassword ? (
                      <>
                        <X className="w-4 h-4 text-red-500" />
                        <span className="text-red-600 text-sm">{validationErrors.confirmPassword}</span>
                      </>
                    ) : newPassword === confirmPassword ? (
                      <>
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-green-600 text-sm">Passwords match</span>
                      </>
                    ) : null}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !isFormValid()}
              className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
                isFormValid() && !loading
                  ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-md hover:shadow-lg' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Changing Password...</span>
                </div>
              ) : (
                'Change Password'
              )}
            </button>
          </form>

          {/* Additional Security Info */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Security Tips</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Use a unique password that you don't use elsewhere</li>
                  <li>• Consider using a password manager</li>
                  <li>• Change your password if you suspect it's been compromised</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return <ChangePassword />;
}

export default App;