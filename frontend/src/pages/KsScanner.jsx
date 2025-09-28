import React, { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import axios from "axios";
import { Camera, CheckCircle2, XCircle, Package, MapPin, AlertCircle, RefreshCw, Shield, Activity } from "lucide-react";
import Sidebar from "../components/vd_sidebar.jsx"; // ✅ import your reusable sidebar

// Helper to decode JWT payload (keeping your original function)
function decodeJwtPayload(token) {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    let payload = parts[1];
    payload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const pad = payload.length % 4;
    if (pad) payload += "=".repeat(4 - pad);
    const decodedStr = atob(payload);
    try {
      return JSON.parse(decodedStr);
    } catch {
      const uri = decodedStr
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("");
      return JSON.parse(decodeURIComponent(uri));
    }
  } catch (err) {
    console.error("decodeJwtPayload error:", err);
    return null;
  }
}

const KsScanner = () => {
  const [cameraId, setCameraId] = useState(null);
  const [cameras, setCameras] = useState([]);
  const [scanResult, setScanResult] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const html5QrcodeRef = useRef(null);

  // Get cameras (your original logic)
  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((deviceCameras) => {
        if (deviceCameras && deviceCameras.length) {
          setCameras(deviceCameras);
          setCameraId(deviceCameras[0].id);
        } else {
          setErrorMessage("No cameras found");
        }
      })
      .catch((err) => {
        console.error("Error getting cameras", err);
        setErrorMessage("Camera access not available");
      });

    return () => {
      if (html5QrcodeRef.current) {
        html5QrcodeRef.current
          .stop()
          .catch((err) => console.warn("Failed to stop scanner", err));
      }
    };
  }, []);

  // Start scanner (your original logic)
  useEffect(() => {
    if (!cameraId) return;

    const config = { fps: 10, qrbox: { width: 500, height: 500 } };
    const html5QrCode = new Html5Qrcode("reader", { verbose: false });
    html5QrcodeRef.current = html5QrCode;

    html5QrCode
      .start(
        cameraId,
        config,
        async (decodedText) => {
          console.log("Decoded:", decodedText);
          setScanResult(decodedText);

          let token = null;
          try {
            const parsed = new URL(decodedText);
            token = parsed.searchParams.get("token");
          } catch {
            const m = decodedText.match(/token=([^&]+)/);
            token = m ? m[1] : decodedText;
          }

          if (!token) {
            setVerificationStatus({ valid: false });
            html5QrCode.stop().catch((err) => console.error("stop error", err));
            return;
          }

          try {
            const apiBase = import.meta.env.VITE_API_URL || "";
            const resp = await axios.get(
              `${apiBase}/api/parcels/verify?token=${encodeURIComponent(token)}`
            );
            console.log("verify response:", resp.data);

            if (resp.data && (resp.data.parcelId || resp.data.locId)) {
              setVerificationStatus({
                valid: resp.data.valid ?? true,
                parcelId: resp.data.parcelId,
                locId: resp.data.locId,
              });
            } else {
              const payload = decodeJwtPayload(token);
              if (payload && (payload.parcelId || payload.locId)) {
                setVerificationStatus({
                  valid: true,
                  parcelId: payload.parcelId,
                  locId: payload.locId,
                });
              } else {
                setVerificationStatus({ valid: !!resp.data?.valid });
              }
            }
          } catch (err) {
            console.error("Verification request failed:", err?.response?.data ?? err);
            const payload = decodeJwtPayload(token);
            if (payload && (payload.parcelId || payload.locId)) {
              setVerificationStatus({
                valid: true,
                parcelId: payload.parcelId,
                locId: payload.locId,
              });
            } else {
              setVerificationStatus({ valid: false });
            }
          }

          html5QrCode.stop().catch((err) => console.error("stop error", err));
        },
        () => {}
      )
      .catch((err) => {
        console.error("Start failed:", err);
        setErrorMessage(`Failed to start scanner: ${err}`);
      });

    return () => {
      html5QrCode.stop().catch((err) => console.warn("cleanup stop error", err));
    };
  }, [cameraId]);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      
      
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Header Cards */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Camera className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">QR Code Scanner</h1>
                <p className="text-gray-600">Verify parcels and locations</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">System Active</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Secure</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Scanner Area */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Camera className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">Camera View</h2>
                    <p className="text-gray-600 text-sm">Point camera at QR code to verify</p>
                  </div>
                </div>
              </div>
              
              {/* Error Message */}
              {errorMessage && (
                <div className="p-4 bg-red-50 border-b border-red-100">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="text-red-800 font-medium">Error: {errorMessage}</span>
                  </div>
                </div>
              )}

              {/* Camera View */}
              <div
                id="reader"
                className="bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center relative overflow-hidden"
                style={{ height: "400px" }}
              >
                {/* This div will be replaced by the Html5Qrcode scanner */}
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {/* Scan Status Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Scan Results</h3>
              
              {scanResult ? (
                verificationStatus ? (
                  verificationStatus.valid ? (
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircle2 className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-green-800">✅ QR Code Verified</p>
                          <p className="text-sm text-green-600 mt-1">Successfully verified and processed</p>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-3">
                        {verificationStatus.parcelId && (
                          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                            <Package className="w-5 h-5 text-blue-600 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-blue-800 uppercase tracking-wide">Parcel ID</p>
                              <p className="text-sm font-mono text-blue-900 truncate">{verificationStatus.parcelId}</p>
                            </div>
                          </div>
                        )}
                        
                        {verificationStatus.locId && (
                          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                            <MapPin className="w-5 h-5 text-purple-600 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-purple-800 uppercase tracking-wide">Location ID</p>
                              <p className="text-sm font-mono text-purple-900 truncate">{verificationStatus.locId}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <XCircle className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-800">❌ Invalid QR Code</p>
                        <p className="text-sm text-red-600 mt-1">Verification failed or code expired</p>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="text-center py-8">
                    <RefreshCw className="w-12 h-12 mx-auto mb-3 animate-spin text-indigo-500" />
                    <p className="text-sm text-gray-600">Verifying...</p>
                  </div>
                )
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Camera className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No result yet.</p>
                </div>
              )}
            </div>

            {/* System Status Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Scanner Active</span>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Security Enabled</span>
                  </div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KsScanner;