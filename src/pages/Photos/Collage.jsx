import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaThLarge, FaImage, FaDownload, FaTimes } from "react-icons/fa";
import dropboxService from "../../services/dropboxService";
import "./Photos.css";

export default function Collage() {
  const [photos, setPhotos] = useState([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const FOLDER_PATH = "";

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    setLoadingPhotos(true);
    try {
      const response = await dropboxService.listFolder(FOLDER_PATH);
      const imageFiles = response.files.filter((file) =>
        /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name)
      );

      // Get temporary download links for each image
      const photosWithLinks = await Promise.all(
        imageFiles.map(async (file) => {
          try {
            const linkResponse = await dropboxService.getTemporaryLink(
              file.path_display
            );
            return {
              name: file.name,
              url: linkResponse.url,
            };
          } catch (err) {
            console.error("Error getting temp link for", file.name, err);
            return null;
          }
        })
      );

      setPhotos(photosWithLinks.filter((p) => p !== null));
    } catch (err) {
      console.error("Error fetching photos:", err);
    }
    setLoadingPhotos(false);
  };

  const nextPhoto = () => {
    setCarouselIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCarouselIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const openModal = (photo) => {
    setSelectedPhoto(photo);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedPhoto(null);
  };

  const downloadPhoto = async () => {
    if (!selectedPhoto) return;

    try {
      const response = await fetch(selectedPhoto.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = selectedPhoto.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Error downloading photo:", err);
      alert("Failed to download photo");
    }
  };

  return (
    <div className="photos-page">
      <div className="photos-container">
        <h1 className="photos-title">My Photos</h1>
        <p className="photos-subtitle">These are some of my favorite pictures with all of you guys. It also saves me $2.99 per month to upload pictures here instead of my camera roll.</p>

        {photos.length > 0 && (
          <div className="view-mode-toggle">
            <button
              className={`mode-button ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
            >
              <FaThLarge /> Grid
            </button>
             <button
              className={`mode-button ${viewMode === "compact-grid" ? "active" : ""}`}
              onClick={() => setViewMode("compact-grid")}
            >
              <FaImage /> 4x4 Grid
            </button>
          </div>
        )}

        {loadingPhotos ? (
          <p className="loading">Loading photos...</p>
        ) : photos.length === 0 ? (
          <p className="no-photos">No photos yet. Submit one in the Upload section!</p>
        ) : (
          <>
            <AnimatePresence>
              {viewMode === "grid" && (
                <motion.div
                  className="photo-grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {photos.map((photo, idx) => (
                    <motion.div
                      key={idx}
                      className="photo-item clickable"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => openModal(photo)}
                    >
                      <img src={photo.url} alt={photo.name} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {viewMode === "compact-grid" && (
                <motion.div
                  className="photo-compact-grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {photos.map((photo, idx) => (
                    <motion.div
                      key={idx}
                      className="photo-item-compact clickable"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => openModal(photo)}
                    >
                      <img src={photo.url} alt={photo.name} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {viewMode === "single" && (
                <motion.div
                  className="single-photo-container"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    className="single-photo clickable"
                    key={carouselIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => openModal(photos[carouselIndex])}
                  >
                    <img src={photos[carouselIndex].url} alt={photos[carouselIndex].name} />
                    <p className="photo-name">{photos[carouselIndex].name}</p>
                  </motion.div>
                  <div className="single-controls">
                    <button className="single-btn" onClick={prevPhoto} disabled={photos.length <= 1}>
                      ← Previous
                    </button>
                    <span className="single-counter">{carouselIndex + 1} of {photos.length}</span>
                    <button className="single-btn" onClick={nextPhoto} disabled={photos.length <= 1}>
                      Next →
                    </button>
                  </div>
                  <div className="scroll-bar">
                    <div className="scroll-progress" style={{ width: `${((carouselIndex + 1) / photos.length) * 100}%` }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {/* PHOTO MODAL */}
        <AnimatePresence>
          {modalOpen && selectedPhoto && (
            <motion.div
              className="photo-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            >
              <motion.div
                className="photo-modal"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button className="modal-close" onClick={closeModal}>
                  <FaTimes />
                </button>
                <div className="modal-content">
                  <img src={selectedPhoto.url} alt={selectedPhoto.name} />
                </div>
                <div className="modal-footer">
                  <button className="modal-download-btn" onClick={downloadPhoto}>
                    <FaDownload /> Download
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}