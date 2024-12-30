import React, { useRef, useEffect, useState } from "react";
import { Modal, Button, message } from "antd";
import { BrowserMultiFormatReader } from "@zxing/browser";

const ScanPayQRModal = ({ isModalVisible, handleCancel }) => {
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);
  const [scannedResult, setScannedResult] = useState("");
  const [devices, setDevices] = useState([]);
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0);
  const isScannerActive = useRef(false);
  const hasScanned = useRef(false);

  useEffect(() => {
    if (isModalVisible) {
      initializeScanner();
      requestCameraPermission().then((granted) => {
        if (granted) {
          fetchCameraDevices();
        } else {
          message.error("Camera access is required to scan QR codes.");
          handleCancel();
        }
      });
    } else {
      stopScanner();
    }

    return () => {
      stopScanner();
    };
  }, [isModalVisible]);

  useEffect(() => {
    if (devices.length > 0 && isModalVisible) {
      startScanner();
    }
  }, [devices]);

  const initializeScanner = () => {
    if (!codeReaderRef.current) {
      codeReaderRef.current = new BrowserMultiFormatReader();
    }
  };

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch {
      return false;
    }
  };

  const fetchCameraDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      setDevices(devices.filter((device) => device.kind === "videoinput"));
    } catch {
      message.error("Failed to fetch camera devices.");
    }
  };

  const startScanner = async () => {
    if (isScannerActive.current || !videoRef.current || !codeReaderRef.current) return;

    isScannerActive.current = true;
    hasScanned.current = false;

    try {
      const deviceId = devices[currentDeviceIndex]?.deviceId;
      if (!deviceId) throw new Error("No camera device found.");

      await codeReaderRef.current.decodeFromVideoDevice(
        deviceId,
        videoRef.current,
        (result, error) => {
          if (result && !hasScanned.current) {
            hasScanned.current = true;
            setScannedResult(result.getText());
            message.success(`Scanned Result: ${result.getText()}`);
            stopScanner();
          } else if (error && error.name !== "NotFoundException") {
            console.error("Error during scanning:", error);
          }
        }
      );
    } catch (error) {
      message.error("Failed to initialize the scanner.");
      stopScanner();
    }
  };

  const stopScanner = () => {
    if (!isScannerActive.current) return;

    try {
      codeReaderRef.current?.stopContinuousDecode();
      videoRef.current?.srcObject?.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    } catch (error) {
      console.error("Error while stopping scanner:", error);
    }

    isScannerActive.current = false;
    hasScanned.current = false;
  };

  const switchCamera = () => {
    setCurrentDeviceIndex((prevIndex) => (prevIndex + 1) % devices.length);
    stopScanner();
    setTimeout(startScanner, 100);
  };

  return (
    <Modal
      title="Scan QR Code"
      open={isModalVisible}
      onCancel={handleCancel}
      footer={null}
      width={400}
      style={{ textAlign: "center" }}
    >
      <div style={{ position: "relative", marginBottom: "16px" }}>
        <video
          ref={videoRef}
          style={{
            width: "224px",
            height: "224px",
            border: "8px solid #03045e",
            borderRadius: "10px",
            background: "#f7f7f7",
          }}
          autoPlay
        ></video>
      </div>

      {devices.length > 1 && (
        <Button onClick={switchCamera} type="primary" style={{ marginBottom: "16px" }}>
          Switch Camera
        </Button>
      )}

      <Button onClick={handleCancel} type="default">
        Cancel
      </Button>
    </Modal>
  );
};

export default ScanPayQRModal;
