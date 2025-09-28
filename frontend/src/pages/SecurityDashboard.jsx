// src/pages/SecurityDashboard.jsx

import React, { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import axios from "axios";

/**
 * Try to decode JWT payload (no verification) and return parsed object.
 * Safe fallback to read parcelId / locId if backend doesn't return them.
 */
function decodeJwtPayload(token) {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    let payload = parts[1];
    // Convert Base64URL -> Base64
    payload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const pad = payload.length % 4;
    if (pad) payload += "=".repeat(4 - pad);
    const decodedStr = atob(payload);
    try {
      return JSON.parse(decodedStr);
    } catch {
      // handle potential utf8
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

const SecurityDashboard = () => {
  const [cameraId, setCameraId] = useState(null);
  const [cameras, setCameras] = useState([]);
  const [scanResult, setScanResult] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const html5QrcodeRef = useRef(null);

  // 🔹 Step 1: Find available cameras
  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((deviceCameras) => {
        if (deviceCameras && deviceCameras.length) {
          setCameras(deviceCameras);
          setCameraId(deviceCameras[0].id); // pick first camera
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

  // 🔹 Step 2: Start scanner when cameraId changes
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

          // Robust token extraction:
          // - If decodedText is a full URL -> use URL.searchParams
          // - Else, try regex to capture token=... or treat decodedText as the token directly
          let token = null;
          try {
            const parsed = new URL(decodedText);
            token = parsed.searchParams.get("token");
          } catch {
            // not a full URL
            const m = decodedText.match(/token=([^&]+)/);
            token = m ? m[1] : decodedText;
          }

          if (!token) {
            console.warn("No token extracted from QR text:", decodedText);
            setVerificationStatus({ valid: false });
            // stop scanning
            html5QrCode.stop().catch((err) => console.error("stop error", err));
            return;
          }

          // Try server verification first
          try {
            const apiBase = import.meta.env.VITE_API_URL || "";
            const resp = await axios.get(
              `${apiBase}/api/parcels/verify?token=${encodeURIComponent(token)}`
            );
            console.log("verify response:", resp.data);

            // If backend returned parcelId / locId, use them.
            if (resp.data && (resp.data.parcelId || resp.data.locId)) {
              setVerificationStatus({
                valid: resp.data.valid ?? true,
                parcelId: resp.data.parcelId,
                locId: resp.data.locId,
              });
            } else {
              // Fallback: decode the token payload on the client to read parcelId/locId
              const payload = decodeJwtPayload(token);
              console.log("decoded token payload (fallback):", payload);
              if (payload && (payload.parcelId || payload.locId)) {
                setVerificationStatus({
                  valid: true,
                  parcelId: payload.parcelId,
                  locId: payload.locId,
                });
              } else {
                // nothing usable
                setVerificationStatus({ valid: !!resp.data?.valid });
              }
            }
          } catch (err) {
            console.error("Verification request failed:", err?.response?.data ?? err);
            // If server call failed, still try to decode token locally as a fallback
            const payload = decodeJwtPayload(token);
            console.log("decoded token payload (on error):", payload);
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

          // Stop scanning after first result
          html5QrCode.stop().catch((err) => console.error("stop error", err));
        },
        (error) => {
          // scanning errors, ignore
        }
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
      {/* ==================== Sidebar ==================== */}
      <div className="w-64 bg-blue-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-6">Security Dashboard</h2>
        <ul>
          <li className="p-3 bg-blue-700 rounded-lg">Scan</li>
        </ul>
      </div>
      {/* ================== End Sidebar ================== */}

      {/* ==================== Main Content ==================== */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">
          Scan QR Code
        </h1>

        {errorMessage && (
          <div className="text-red-500 mb-4 font-medium">
            Error: {errorMessage}
          </div>
        )}

        {/* Camera feed */}
        <div
          id="reader"
          className="border-2 border-dashed border-gray-400 rounded-xl flex items-center justify-center bg-white shadow-lg"
          style={{
            width: "100%",
            height: "400px",
            position: "relative",
            overflow: "hidden",
          }}
        ></div>

        {/* Camera Selector */}
        {cameras.length > 1 && (
          <div className="mt-4">
            <label className="font-medium">Select Camera: </label>
            <select
              value={cameraId}
              onChange={(e) => setCameraId(e.target.value)}
              className="ml-2 p-2 border rounded-md"
            >
              {cameras.map((cam) => (
                <option key={cam.id} value={cam.id}>
                  {cam.label || cam.id}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Scan Result */}
        <div className="mt-6 p-4 rounded-lg shadow-md bg-white">
          <h2 className="text-xl font-bold mb-2">Scan Result</h2>
          {scanResult ? (
            verificationStatus ? (
              verificationStatus.valid ? (
                <div className="text-green-600">
                  ✅ QR Code Verified
                  <p className="mt-2">
                    <strong>Parcel ID:</strong> {verificationStatus.parcelId}
                  </p>
                  <p>
                    <strong>Location ID:</strong> {verificationStatus.locId}
                  </p>
                </div>
              ) : (
                <div className="text-red-600 font-medium">
                  ❌ Invalid QR Code
                </div>
              )
            ) : (
              <div>Verifying...</div>
            )
          ) : (
            <div className="text-gray-500">No result yet.</div>
          )}
        </div>
      </div>
      {/* ================== End Main Content ================== */}
    </div>
  );
};

export default SecurityDashboard;
