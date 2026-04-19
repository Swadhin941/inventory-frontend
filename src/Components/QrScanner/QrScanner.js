import React, { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

const QrScanner = ({ onScan }) => {
  const scannerRef = useRef(null);
  const scannerId = "reader";

  useEffect(() => {
    const scanner = new Html5Qrcode(scannerId);
    scannerRef.current = scanner;

    const startScanner = async () => {
      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 250 },
          (decodedText) => {
            onScan(decodedText);

            // ✅ STOP after scan
            scanner.stop().then(() => {
              console.log("Camera stopped after scan");
            });
          }
        );
      } catch (err) {
        console.error("Camera error:", err);
      }
    };

    startScanner();

    // ✅ CLEANUP when component unmounts
    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .then(() => console.log("Camera stopped on cleanup"))
          .catch(() => {});
      }
    };
  }, [onScan]);

  return <div id={scannerId} style={{ width: "100%" }} />;
};

export default QrScanner;