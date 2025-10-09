
import { useState, useEffect } from "react";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/vd_AuthContext";
import { Mail, ArrowLeft, CheckCircle, XCircle, Loader2 } from "lucide-react";

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
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-md w-96 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Check Your Email</h2>
          <p className="text-gray-600 mb-6">
            If that email exists, we've sent a password reset link to:
          </p>
          <p className="font-semibold text-blue-600 mb-6">{email}</p>
          <p className="text-sm text-gray-500 mb-6">
            The link will expire in 15 minutes. If you don't see the email, check your spam folder.
          </p>
          <button
            onClick={handleBackToLogin}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md w-96">
        <div className="flex items-center mb-6">
          <button
            type="button"
            onClick={handleBackToLogin}
            className="mr-3 p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-2xl font-bold">Forgot Password</h2>
        </div>
        
        {isAuthenticatedRoute ? (
          // Authenticated route - show user info and no email input
          <>
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
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
            <p className="text-gray-600 mb-6">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full p-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
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
          </>
        )}
        
        <button
          type="submit"
          disabled={loading || (!isAuthenticatedRoute && (emailValidation.isValidating || emailValidation.isValid === false))}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}
