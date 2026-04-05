import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Dropbox } from "dropbox";
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

  // Initialize Dropbox - YOU NEED TO ADD YOUR ACCESS TOKEN HERE
  const DROPBOX_ACCESS_TOKEN = import.meta.env.VITE_DROPBOX_TOKEN;
  const UPLOAD_PASSWORD = import.meta.env.VITE_UPLOAD_PASSWORD;
  const FOLDER_PATH = "/photo_submissions";

  const dbx = DROPBOX_ACCESS_TOKEN ? new Dropbox({ auth: { accessToken: DROPBOX_ACCESS_TOKEN } }) : null;

  // Fetch photos from Dropbox
  useEffect(() => {
    if (activeTab === "collage") {
      fetchPhotos();
    }
  }, [activeTab]);

  const fetchPhotos = async () => {
    if (!dbx) {
      setUploadMessage("Dropbox not configured. Add VITE_DROPBOX_TOKEN to .env");
      return;
    }

    setLoadingPhotos(true);
    try {
      const response = await dbx.filesListFolder({ path: FOLDER_PATH });
      const imageFiles = response.result.entries.filter((file) =>
        /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name)
      );

      // Get shared links for each image
      const photosWithLinks = await Promise.all(
        imageFiles.map(async (file) => {
          try {
            const linkResponse = await dbx.sharingCreateSharedLink({
              path: file.path_display,
              settings: { requested_visibility: "public" },
            });
            return {
              name: file.name,
              url: linkResponse.result.url.replace("?dl=0", "?dl=1"),
            };
          } catch (err) {
            // Link might already exist
            try {
              const existingLinks = await dbx.sharingListSharedLinks({
                path: file.path_display,
              });
              if (existingLinks.result.links.length > 0) {
                return {
                  name: file.name,
                  url: existingLinks.result.links[0].url.replace("?dl=0", "?dl=1"),
                };
              }
            } catch {}
            return null;
          }
        })
      );

      setPhotos(photosWithLinks.filter((p) => p !== null));
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

    if (!dbx) {
      setUploadMessage("Dropbox not configured");
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          await dbx.filesUpload({
            path: `${FOLDER_PATH}/${Date.now()}_${file.name}`,
            contents: event.target.result,
            autorename: true,
          });
          setUploadMessage("✓ Photo uploaded successfully!");
          setFile(null);
          // Reset form
          const formElement = document.querySelector(".upload-form");
          if (formElement) formElement.reset();
          setTimeout(() => setUploadMessage(""), 3000);
        } catch (err) {
          console.error("Upload error:", err);
          setUploadMessage("Error uploading photo");
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      console.error("Error:", err);
      setUploadMessage("Error preparing upload");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="photos-container">
      {/* TABS */}
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

      {/* COLLAGE TAB */}
      {activeTab === "collage" && (
        <motion.div
          className="tab-content collage-tab"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
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
                  transition={{ delay: idx * 0.1 }}
                >
                  <img src={photo.url} alt={photo.name} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* SUBMISSION TAB */}
      {activeTab === "submission" && (
        <motion.div
          className="tab-content submission-tab"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
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
              <button className="logout-btn" onClick={() => setIsAuthenticated(false)}>
                Logout
              </button>
              {uploadMessage && (
                <p className={uploadMessage.includes("✓") ? "success" : "error"}>
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