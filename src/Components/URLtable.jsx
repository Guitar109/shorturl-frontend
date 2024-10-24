import React, { useState } from "react";
import { Table, Button, Space, Modal } from "antd";
import {
  CopyOutlined,
  DownloadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { FaLink } from "react-icons/fa6";
import { apiEndPoint, apiQrcodeEndPoint, devEndPoint } from "../Const/api";

const URLTable = ({ urls, onDelete, onCopy, onOpen, loading }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedQR, setSelectedQR] = useState({ url: "", shortUrl: "" });

  const downloadQR = async (qrUrl, shortUrl) => {
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `qr-${shortUrl}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading QR code:", error);
    }
  };

  const showQRModal = (shortUrl) => {
    const modalQrUrl = `${apiQrcodeEndPoint}/?data=${encodeURIComponent(
      `${apiEndPoint}/${shortUrl}`
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
            <b className="font-extrabold text-gray-600">Full URL : </b>
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
            <b className="font-extrabold text-gray-600">Short URL : </b>
            <a
              href={`${apiEndPoint}/${record.shortUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {`shorturl/${record.shortUrl}`}
              {/* {`${apiEndPoint}/${record.shortUrl}`} */}
            </a>
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
        const thumbnailQrUrl = `${apiQrcodeEndPoint}/?data=${encodeURIComponent(
          `${apiEndPoint}/${record.shortUrl}`
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
        <span className="px-3 py-1 bg-blue-500  rounded-full">{clicks}</span>
      ),
    },
    {
      title: "ip",
      dataIndex: "userIp",
      key: "userIp",
      width: "10%",
      align: "center",
      render: (userIp) => (
        <span className="px-3 py-1 bg-blue-500  rounded-full">{userIp}</span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: "20%",
      align: "center",
      render: (_, record) => {
        const qrUrl = `${apiQrcodeEndPoint}/?data=${encodeURIComponent(
          `${apiEndPoint}/${record.shortUrl}`
        )}&size=512x512`;

        return (
          <Space>
            <Button
              icon={<CopyOutlined />}
              onClick={() => onCopy(record.shortUrl)}
              title="Copy short URL"
            />
            <Button
              icon={<FaLink size={18} />}
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
        loading={loading}
        dataSource={urls.map((url, index) => ({ ...url, key: index }))}
        columns={columns}
        pagination={false}
        className="min-w-full"
        locale={{
          emptyText: `${
            !loading ? "No URLs shortened yet. Try shortening one above!" : ""
          }`,
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
          </Button>,
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
