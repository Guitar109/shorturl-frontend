import React from "react";
import { Modal, Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { apiEndPoint, devEndPoint, apiQrcodeEndPoint } from "../Const/api";

const QRCodeModal = ({ isOpen, onClose, url, onDownload }) => {
  if (!url) return null;

  const fullUrl = `${apiEndPoint}/${url.shortUrl.trim()}`;
  const qrImageUrl = `${apiQrcodeEndPoint}/?data=${encodeURIComponent(
    fullUrl
  )}&size=128x128`;

  const downloadQR = () => {
    const link = document.createElement("a");
    link.href = qrImageUrl;
    link.download = `${url.shortUrl}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal open={isOpen} onCancel={onClose} footer={null} centered>
      <div className="flex flex-col items-center p-4">
        <h2 className="text-xl font-semibold mb-4">
          QR Code for {url.shortUrl}
        </h2>

        <div className="bg-white p-4 rounded-lg mb-4">
          <img
            src={qrImageUrl}
            alt={`QR code for ${url.shortUrl}`}
            width={256}
            height={256}
          />
        </div>

        <Button type="primary" icon={<DownloadOutlined />} onClick={downloadQR}>
          Save QR Code
        </Button>
      </div>
    </Modal>
  );
};

export default QRCodeModal;
