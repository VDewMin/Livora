import { useState, useEffect } from "react";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/vd_AuthContext";
import { Mail, ArrowLeft, CheckCircle, XCircle, Loader2 } from "lucide-react";
import loginBg from "../assets/LoginPage.jpg";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailValidation, setEmailValidation] = useState({
    isValidating: false,
    isValid: null,
    message: ""
  });
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  // Determine if this is the authenticated route
  const isAuthenticatedRoute = location.pathname === "/account/forgot-password";

  // Debounced email validation
  useEffect(() => {
    if (!email || !email.includes("@")) {
      setEmailValidation({ isValidating: false, isValid: null, message: "" });
      return;
    }

    const timeoutId = setTimeout(async () => {
      setEmailValidation({ isValidating: true, isValid: null, message: "Checking email..." });
      
      try {
        const response = await axiosInstance.post("/users/check-email", { email });
        setEmailValidation({
          isValidating: false,
          isValid: response.data.exists,
          message: response.data.exists ? "Email found" : "Email not found in our system"
        });
      } catch (err) {
        setEmailValidation({
          isValidating: false,
          isValid: false,
          message: "Error checking email"
        });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // For unauthenticated route, validate email first
    if (!isAuthenticatedRoute) {
      if (emailValidation.isValid === false) {
        toast.error("Please enter a valid email address that exists in our system");
        return;
      }

      if (emailValidation.isValidating) {
        toast.error("Please wait while we verify your email");
        return;
      }
    }

    setLoading(true);
    try {
      // Use appropriate endpoint based on route
      const endpoint = isAuthenticatedRoute ? "/users/forgot-password" : "/users/forgot-password-unauthenticated";
      const payload = isAuthenticatedRoute ? {} : { email };
      
      const response = await axiosInstance.post(endpoint, payload);
      
      // Only proceed if request was actually successful
      if (response && response.status === 200) {
        toast.success("Password reset link has been sent to your email");
        
        // Automatically logout user if they are logged in (for both routes)
        if (user) {
          toast("You have been logged out for security reasons", { icon: "ℹ️" });
          
          // Force complete logout and redirect
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          window.location.href = "/login";
          return; // Exit early to prevent showing confirmation page
        } else {
          // For non-logged-in users, show confirmation page
          setEmailSent(true);
        }
      } else {
        // If response is not successful, throw an error
        throw new Error("Request was not successful");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      
      // Show more specific error messages
      if (err.response?.status === 404) {
        toast.error("Email not found in our system");
      } else if (err.response?.status === 400) {
        toast.error("Email is required");
      } else if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else if (err.code === 'NETWORK_ERROR' || !err.response || err.message === 'Network Error') {
        toast.error("Network error - please check your connection and try again");
      } else if (err.message === 'Request was not successful') {
        toast.error("Request failed - please try again");
      } else {
        toast.error("Request failed - please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  if (emailSent) {
    return (
      <div
        className="h-screen w-screen flex items-center justify-center fixed inset-0 overflow-hidden"
        style={{
          backgroundImage: `url(${loginBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="w-full max-w-md px-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Check Your Email</h2>
            <p className="text-gray-600 mb-4">
              If that email exists, we've sent a password reset link to:
            </p>
            <p className="font-semibold text-blue-600 mb-6">{email}</p>
            <p className="text-sm text-gray-500 mb-6">
              The link will expire in 15 minutes. If you don't see the email, check your spam folder.
            </p>
            <button
              onClick={handleBackToLogin}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`h-screen w-screen flex items-center justify-center fixed inset-0 overflow-hidden ${
        isAuthenticatedRoute ? "bg-gray-50" : ""
      }`}
      style={!isAuthenticatedRoute ? {
        backgroundImage: `url(${loginBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      } : {}}
    >
      <div className="w-full max-w-md px-4">
        {/* Welcome Message - only show for unauthenticated route */}
        {!isAuthenticatedRoute && (
          <div className="text-center mb-4">
            <h1 className="text-3xl font-semibold text-white mb-2 drop-shadow-lg">Reset Password</h1>
            <p className="text-white drop-shadow">We'll help you reset your password</p>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit}>
            {/* Back Button and Title */}
            <div className="flex items-center gap-4 mb-4">
              <button
                type="button"
                onClick={handleBackToLogin}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Forgot Password</h2>
            </div>
            
            {isAuthenticatedRoute ? (
              // Authenticated route - show user info and no email input
              <>
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Account:</p>
                  <p className="font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
                <p className="text-gray-600 mb-6">
                  We'll send a password reset link to your registered email address.
                </p>
              </>
            ) : (
              // Unauthenticated route - show email input with validation
              <>
                <p className="text-gray-600 mb-4">
                  Enter your email address and we'll send you a link to reset your password.
                </p>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full pl-10 pr-12 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        emailValidation.isValid === true 
                          ? "border-green-500 bg-green-50" 
                          : emailValidation.isValid === false 
                          ? "border-red-500 bg-red-50" 
                          : "border-gray-300"
                      }`}
                      required
                    />
                    
                    {/* Validation Icon */}
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {emailValidation.isValidating && (
                        <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                      )}
                      {emailValidation.isValid === true && !emailValidation.isValidating && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                      {emailValidation.isValid === false && !emailValidation.isValidating && (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  </div>

                  {/* Validation Message */}
                  {emailValidation.message && (
                    <div className={`mt-2 text-sm ${
                      emailValidation.isValid === true 
                        ? "text-green-600" 
                        : emailValidation.isValid === false 
                        ? "text-red-600" 
                        : "text-blue-600"
                    }`}>
                      {emailValidation.message}
                    </div>
                  )}
                </div>
              </>
            )}
            
            <button
              type="submit"
              disabled={loading || (!isAuthenticatedRoute && (emailValidation.isValidating || emailValidation.isValid === false))}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}