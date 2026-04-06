import { useState } from "react";
import { motion } from "framer-motion";
import "./Photos.css";

export default function Upload() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const UPLOAD_PASSWORD = import.meta.env.VITE_UPLOAD_PASSWORD;
  const FOLDER_PATH = "/photo_submissions"; // match your API folder

  // Password unlock
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

  // File input
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadMessage("");
  };

  // Upload via your API
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
        const errorData = await res.json();
        console.log("Upload error response:", errorData);
        throw new Error(errorData.error || "Upload failed");
      }

      setUploadMessage("✓ Photo uploaded successfully!");
      setFile(null);

      const formElement = document.querySelector(".upload-form");
      if (formElement) formElement.reset();

      setTimeout(() => setUploadMessage(""), 3000);
    } catch (err) {
      console.error("Upload error:", err);
      setUploadMessage(err.message || "Error uploading photo");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="photos-page">
      <div className="photos-container upload-container">
        <h1 className="photos-title">Submit Your Photo</h1>

        {!isAuthenticated ? (
          <motion.form
            className="password-form"
            onSubmit={handlePasswordSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="form-label">Enter password to submit photos</p>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Unlock</button>
            {uploadMessage && <p className="error-message">{uploadMessage}</p>}
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <form className="upload-form" onSubmit={handleUpload}>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  id="file-input"
                  required
                />
                <label htmlFor="file-input">
                  {file ? file.name : "Click to choose a photo..."}
                </label>
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
                  uploadMessage.includes("✓") ? "success-message" : "error-message"
                }
              >
                {uploadMessage}
              </p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}