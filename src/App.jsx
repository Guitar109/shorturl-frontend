import React, { useState, useEffect } from "react";
import { Layout, Input, Button, message, Modal } from "antd";
import { LinkOutlined } from "@ant-design/icons";
import { RiLinkUnlink } from "react-icons/ri";
import URLTable from "./Components/URLtable";
import QRCodeModal from "./Components/QRcodeModal";
import { urlService } from "./Services/urlService";
import { apiEndPoint,devEndPoint} from "./Const/api";
import "./App.css";

const { Header, Content } = Layout;
const API_BASE_URL = `${apiEndPoint}`;

const App = () => {
  const [urls, setUrls] = useState([]);
  const [fullUrl, setFullUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const urlsData = await urlService.fetchUrls();
      setUrls(urlsData);
    } catch (error) {
      console.error("Fetch error:", error);
      message.error("Error loading URLs");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullUrl.trim()) {
      message.error("Please enter a URL");
      return;
    }

    let processedUrl = fullUrl;
    if (!fullUrl.startsWith("http://") && !fullUrl.startsWith("https://")) {
      processedUrl = `https://${fullUrl}`;
    }

    setIsLoading(true);
    try {
      const success = await urlService.shortenUrl(processedUrl);
      if (success) {
        await fetchData();
        setFullUrl("");
      } else {
        message.error("Failed to shorten URL");
      }
    } catch (error) {
      console.error("Shorten URL error:", error);
      message.error(error.message || "Error shortening URL");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (shortUrl) => {
    try {
      const success = await urlService.deleteUrl(shortUrl);
      if (success) {
        await fetchData();
      } else {
        message.error("Failed to delete URL");
      }
    } catch (error) {
      console.error("Delete error:", error);
      message.error("Error deleting URL");
    }
  };

  const handleDeleteAll = async () => {
    Modal.confirm({
      title: "คุณต้องการลบประวัติของคุณทั้งหมดหรือไม่ ?",
      onOk: async () => {
        try {
          const success = await urlService.deleteAllUrls();
          if (success) {
            await fetchData();
          } else {
          }
        } catch (error) {
          console.error("Delete all error:", error);
        }
      },
    });
  };

  const copyToClipboard = async (shortUrl) => {
    try {
      await navigator.clipboard.writeText(`${API_BASE_URL}/${shortUrl}`);
      message.success("Copied to clipboard! 📋");
    } catch (error) {
      console.error("Copy error:", error);
      message.error("Error copying to clipboard");
    }
  };

  const handleOpenUrl = (shortUrl) => {
    window.open(`${API_BASE_URL}/${shortUrl}`, "_blank");
  };

  const downloadQRCode = (shortUrl) => {
    const canvas = document.getElementById(`qr-${shortUrl}`);
    if (canvas) {
      try {
        const pngUrl = canvas
          .toDataURL("image/png")
          .replace("image/png", "image/octet-stream");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `qr-${shortUrl}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        message.success("QR Code downloaded successfully! 📲");
      } catch (error) {
        console.error("QR Code download error:", error);
        message.error("Error downloading QR Code");
      }
    }
  };

  return (
    <Layout className="min-vh-100 bg-light">
      <Header className="bg-danger py-3 text-white">
        <div className="d-flex align-items-center justify-content-center">
          <RiLinkUnlink className="text-white me-2" size={35}/>
          <h1 className="display-6 mb-0 text-center adjust-heading">
            URL Shortener
          </h1>
        </div>
      </Header>

      <Content className="container py-5">
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="input-group">
              <Input
                size="large"
                value={fullUrl}
                onChange={(e) => setFullUrl(e.target.value)}
                placeholder="Paste the URL to be shortened"
                required
                className="form-control"
              />
              <Button
                type="primary"
                size="large"
                loading={isLoading}
                onClick={handleSubmit}
                className="btn btn-primary"
              >
                Shorten URL
              </Button>
            </div>
          </form>

          <URLTable
            urls={urls}
            onDelete={handleDelete}
            onCopy={copyToClipboard}
            onOpen={handleOpenUrl}
            onShowQrCode={(url) => {
              setSelectedUrl(url);
              setIsModalOpen(true);
            }}
          />
          {urls.length > 0 && (
            <div className="text-end mt-4">
              <button className="btn btn-danger" onClick={handleDeleteAll}>
                ลบประวัติทั้งหมด
              </button>
            </div>
          )}
        </div>
        <QRCodeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          url={selectedUrl}
          onDownload={downloadQRCode}
        />
      </Content>
    </Layout>
  );
};

export default App;
