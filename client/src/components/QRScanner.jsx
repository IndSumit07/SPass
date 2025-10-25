import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { X, Camera, CameraOff } from "lucide-react";

const QRScanner = ({ onScan, onClose, eventId }) => {
  const scannerRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (!scannerRef.current) return;

    const scanner = new Html5QrcodeScanner(
      "qr-scanner",
      {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 5,
      },
      false
    );

    const onScanSuccess = (decodedText, decodedResult) => {
      console.log("QR Code scanned:", decodedText);

      // Parse the scanned data - assuming it contains passId and eventId
      try {
        const scanData = JSON.parse(decodedText);
        if (scanData.passId && scanData.eventId) {
          onScan(scanData.passId, scanData.eventId);
          scanner.clear();
          setIsScanning(false);
        } else {
          toast.error("Invalid QR code format");
        }
      } catch (error) {
        // If it's not JSON, try to extract passId from the text
        const passId = decodedText;
        if (passId && eventId) {
          onScan(passId, eventId);
          scanner.clear();
          setIsScanning(false);
        } else {
          toast.error("Invalid QR code format");
        }
      }
    };

    const onScanFailure = (error) => {
      // Scan failures are normal, don't show errors
    };

    scanner.render(onScanSuccess, onScanFailure);
    setIsScanning(true);

    return () => {
      scanner.clear().catch((error) => {
        console.log("Scanner cleanup error:", error);
      });
    };
  }, [onScan, eventId]);

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Scan QR Code</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="text-center mb-4">
          <p className="text-gray-600 text-sm">
            Point your camera at the attendee's QR code to scan their pass
          </p>
        </div>

        <div
          id="qr-scanner"
          ref={scannerRef}
          className="w-full rounded-lg overflow-hidden"
        />

        <div className="flex items-center justify-center gap-2 mt-4 p-3 bg-blue-50 rounded-lg">
          {isScanning ? (
            <Camera size={20} className="text-blue-600" />
          ) : (
            <CameraOff size={20} className="text-gray-400" />
          )}
          <span className="text-sm text-blue-700">
            {isScanning ? "Camera active - Scanning..." : "Camera starting..."}
          </span>
        </div>

        <div className="mt-4 flex justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
