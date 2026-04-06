import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./Photos.css";

export default function Photos() {
  const [activeTab, setActiveTab] = useState("collage");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [photos, setPhotos] = useState([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);

  const UPLOAD_PASSWORD = import.meta.env.VITE_UPLOAD_PASSWORD;
  const FOLDER_PATH = "/photo_submissions";

  useEffect(() => {
    if (activeTab === "collage") {
      fetchPhotos();
    }
  }, [activeTab]);

  const fetchPhotos = async () => {
    setLoadingPhotos(true);
    try {
      // 1. Get file list from your API
      const res = await fetch(
        `/api/photos/list?path=${encodeURIComponent(FOLDER_PATH)}`
      );
      const data = await res.json();

      // 2. Get temporary links for each file
      const photosWithLinks = await Promise.all(
        data.files.map(async (file) => {
          const linkRes = await fetch("/api/photos/download-link", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ path: file.path_display }),
          });

          const linkData = await linkRes.json();

          return {
            name: file.name,
            url: linkData.url,
          };
        })
      );

      setPhotos(photosWithLinks);
    } catch (err) {
      console.error("Error fetching photos:", err);
      setUploadMessage("Error loading photos");
    }
    setLoadingPhotos(false);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === UPLOAD_PASSWORD) {
      setIsAuthenticated(true);
      setPassword("");
      setUploadMessage("");
    } else {
      setUploadMessage("Incorrect password");
      setPassword("");
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadMessage("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setUploadMessage("Please select a file");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("path", FOLDER_PATH);

      const res = await fetch("/api/photos/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      setUploadMessage("✓ Photo uploaded successfully!");
      setFile(null);

      const formElement = document.querySelector(".upload-form");
      if (formElement) formElement.reset();

      // Refresh collage after upload
      fetchPhotos();

      setTimeout(() => setUploadMessage(""), 3000);
    } catch (err) {
      console.error("Upload error:", err);
      setUploadMessage("Error uploading photo");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="photos-container">
      <div className="tabs">
        <button
          className={`tab ${activeTab === "collage" ? "active" : ""}`}
          onClick={() => setActiveTab("collage")}
        >
          Collage
        </button>
        <button
          className={`tab ${activeTab === "submission" ? "active" : ""}`}
          onClick={() => setActiveTab("submission")}
        >
          Submit Photo
        </button>
      </div>

      {activeTab === "collage" && (
        <motion.div
          className="tab-content collage-tab"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2>Photo Collage</h2>

          {loadingPhotos ? (
            <p className="loading">Loading photos...</p>
          ) : photos.length === 0 ? (
            <p className="no-photos">No photos yet. Submit one above!</p>
          ) : (
            <div className="photo-grid">
              {photos.map((photo, idx) => (
                <motion.div
                  key={idx}
                  className="photo-item"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <img src={photo.url} alt={photo.name} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {activeTab === "submission" && (
        <motion.div
          className="tab-content submission-tab"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2>Submit Your Photo</h2>

          {!isAuthenticated ? (
            <form className="password-form" onSubmit={handlePasswordSubmit}>
              <p>Enter password to submit photos</p>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Unlock</button>
              {uploadMessage && <p className="error">{uploadMessage}</p>}
            </form>
          ) : (
            <>
              <form className="upload-form" onSubmit={handleUpload}>
                <div className="file-input-wrapper">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                  />
                  <label>{file ? file.name : "Choose a photo..."}</label>
                </div>

                <button type="submit" disabled={uploading || !file}>
                  {uploading ? "Uploading..." : "Upload Photo"}
                </button>
              </form>

              <button
                className="logout-btn"
                onClick={() => setIsAuthenticated(false)}
              >
                Logout
              </button>

              {uploadMessage && (
                <p
                  className={
                    uploadMessage.includes("✓") ? "success" : "error"
                  }
                >
                  {uploadMessage}
                </p>
              )}
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}