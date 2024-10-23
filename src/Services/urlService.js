import { apiEndPoint } from "../Const/api";
const API_BASE_URL = `${apiEndPoint}`;

export const urlService = {
  fetchUrls: async () => {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, 'text/html');
      const urlElements = doc.querySelectorAll('tr');
      
      return Array.from(urlElements)
        .slice(1) 
        .map((row) => ({
          fullUrl: row.cells[0]?.textContent || '',
          shortUrl: (row.cells[1]?.textContent || '').trim(),
          clicks: parseInt(row.cells[2]?.textContent || '0', 10),
        }))
        .filter((url) => url.fullUrl && url.shortUrl);
    } catch (error) {
      console.error('Fetch URLs error:', error);
      throw error;
    }
  },

  getUserIp: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/userIp`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    } catch (error) {
      console.error('Get User IP error:', error);
      throw error;
    }
  },

  shortenUrl: async (fullUrl) => {
    try {
      const response = await fetch(`${API_BASE_URL}/shortUrls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `fullUrl=${encodeURIComponent(fullUrl)}`,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return true;
    } catch (error) {
      console.error('Shorten URL error:', error);
      throw error;
    }
  },

  deleteUrl: async (shortUrl) => {
    try {
      const response = await fetch(`${API_BASE_URL}/delete/${shortUrl.trim()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return true;
    } catch (error) {
      console.error('Delete URL error:', error);
      throw error;
    }
  },

  deleteAllUrls: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/delete-all`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return true;
    } catch (error) {
      console.error('Delete all URLs error:', error);
      throw error;
    }
  },
};