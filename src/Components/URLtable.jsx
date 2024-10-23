import React, { useState } from "react";
import { Table, Button, Space, Modal } from "antd";
import {
  CopyOutlined,
  GlobalOutlined,
  DownloadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const URLTable = ({ urls, onDelete, onCopy, onOpen }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedQR, setSelectedQR] = useState({ url: '', shortUrl: '' });

  const downloadQR = async (qrUrl, shortUrl) => {
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `qr-${shortUrl}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading QR code:', error);
    }
  };

  const showQRModal = (shortUrl) => {
    const modalQrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
      `http://localhost:5000/${shortUrl}`
    )}&size=512x512`;
    setSelectedQR({ url: modalQrUrl, shortUrl });
    setModalVisible(true);
  };

  const columns = [
    {
      title: "URLs",
      key: "urls",
      width: "50%",
      render: (_, record) => (
        <div className="flex flex-col space-y-2">
          <div>
            <span className="font-semibold text-gray-600">Full URL: </span>
            <a
              href={record.fullUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {record.fullUrl}
            </a>
          </div>
          <div>
            <span className="font-semibold text-gray-600">Short URL: </span>
            <span className="text-blue-500">
              {`http://localhost:5000/${record.shortUrl}`}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "QR Code",
      key: "qr",
      width: "20%",
      align: "center",
      render: (_, record) => {
        const thumbnailQrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
          `http://localhost:5000/${record.shortUrl}`
        )}&size=128x128`;
        return (
          <div className="flex flex-col items-center gap-2">
            <img
              src={thumbnailQrUrl}
              alt={`QR code for ${record.shortUrl}`}
              className="w-16 h-16 border border-gray-200 rounded cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => showQRModal(record.shortUrl)}
            />
          </div>
        );
      },
    },
    {
      title: "Clicks",
      dataIndex: "clicks",
      key: "clicks",
      width: "10%",
      align: "center",
      render: (clicks) => (
        <span className="px-3 py-1 bg-blue-500  rounded-full">
          {clicks}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: "20%",
      align: "center",
      render: (_, record) => {
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
          `http://localhost:5000/${record.shortUrl}`
        )}&size=512x512`;

        return (
          <Space>
            <Button
              icon={<CopyOutlined />}
              onClick={() => onCopy(record.shortUrl)}
              title="Copy short URL"
            />
            <Button
              icon={<GlobalOutlined />}
              onClick={() => onOpen(record.shortUrl)}
              title="Open URL"
            />
            <Button
              icon={<DownloadOutlined />}
              onClick={() => downloadQR(qrUrl, record.shortUrl)}
              title="Download QR Code"
            />
            <Button
              icon={<DeleteOutlined />}
              danger
              onClick={() => onDelete(record.shortUrl)}
              title="Delete URL"
            />
          </Space>
        );
      },
    },
  ];

  return (
    <div className="overflow-x-auto">
      <Table
        dataSource={urls.map((url, index) => ({ ...url, key: index }))}
        columns={columns}
        pagination={false}
        className="min-w-full"
        locale={{
          emptyText: "No URLs shortened yet. Try shortening one above!",
        }}
      />

      <Modal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button
            key="download"
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => downloadQR(selectedQR.url, selectedQR.shortUrl)}
          >
            Download QR Code
          </Button>,
          <Button key="close" onClick={() => setModalVisible(false)}>
            Close
          </Button>
        ]}
        title={`QR Code for ${selectedQR.shortUrl}`}
        centered
        width={700}
      >
        <div className="flex flex-col items-center justify-center p-4">
          <img
            src={selectedQR.url}
            alt={`QR code for ${selectedQR.shortUrl}`}
            className="w-96 h-96 border border-gray-200 rounded"
          />
        </div>
      </Modal>
    </div>
  );
};

export default URLTable;