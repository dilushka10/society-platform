import React, { useState, useEffect } from 'react';
import { QrReader } from 'react-qr-reader';

const QRCodeScanner = () => {
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [scanResult, setScanResult] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect if the device is mobile
    const checkMobileDevice = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      setIsMobile(/android|iPad|iPhone|iPod/i.test(userAgent));
    };

    checkMobileDevice();

    return () => {
      // Cleanup camera when component unmounts
      handleStopScanner();
    };
  }, []);

  const handleStartScanner = () => {
    setIsScannerActive(true);
  };

  const handleStopScanner = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.warn('getUserMedia is not supported on this browser.');
      return;
    }

    // Stop all media tracks to ensure the camera stops
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        stream.getTracks().forEach((track) => track.stop());
      })
      .catch((error) => console.error('Error stopping camera:', error));
  };

  return (
    <div>
      <h1>QR Code Scanner</h1>

      {/* Start/Stop buttons */}
      {!isScannerActive ? (
        <button onClick={handleStartScanner}>Start Scanner</button>
      ) : (
        <button onClick={handleStopScanner}>Stop Scanner</button>
      )}

      {/* QR Reader */}
      {isScannerActive && (
        <QrReader
          constraints={{
            facingMode: isMobile ? 'environment' : 'user', // Use the back camera for mobile, front camera for laptops
          }}
          videoContainerStyle={{ width: '100%' }}
          onResult={(result, error) => {
            if (result) {
              setScanResult(result.text);
              handleStopScanner(); // Stop scanner on successful scan
            }
            if (error) {
              console.error('QR scan error:', error);
            }
          }}
        />
      )}

      {/* Display scanned result */}
      {scanResult && <p>Scanned Result: {scanResult}</p>}
    </div>
  );
};

export default QRCodeScanner;
