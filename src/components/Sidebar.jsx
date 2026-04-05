import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";

export default function Sidebar({ menuOpen, setMenuOpen }) {
  const [photosOpen, setPhotosOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <motion.div
      className="side-menu"
      initial={{ x: -300 }}
      animate={{ x: menuOpen ? 0 : -300 }}
      transition={{ duration: 0.4 }}
    >
      <div className="side-inner">
        <h3>Navigation</h3>

        <div className="nav-item">
          <button
            className={`nav-sublink ${isActive("/") ? "nav-active" : ""}`}
            onClick={() => handleNavigate("/")}
          >
            Home
          </button>
        </div>
        <div className="nav-item">
            <button
            className={`nav-sublink ${isActive("/cooking") ? "nav-active" : ""}`}
            onClick={() => handleNavigate("/cooking")}
            >
            Cooking
            </button>
        </div>
        <div className="nav-item">
            <button
            className={`nav-sublink ${isActive("/tv") ? "nav-active" : ""}`}
            onClick={() => handleNavigate("/tv")}
            >
            TV Shows
            </button>
        </div>
        <div className="nav-item">
            <button
            className={`nav-sublink ${isActive("/quiz") ? "nav-active" : ""}`}
            onClick={() => handleNavigate("/quiz")}
            >
            Quiz
            </button>
        </div>
        <div className="nav-item">
            <button
            className={`nav-sublink ${isActive("/travel") ? "nav-active" : ""}`}
            onClick={() => handleNavigate("/travel")}
            >
            Travel
            </button>
        </div>
         <div className="nav-item">
            <button
            className={`nav-sublink ${isActive("/athletes") ? "nav-active" : ""}`}
            onClick={() => handleNavigate("/athletes")}
            >
            Athletes Ranking
            </button>
        </div>
        <div className="nav-item">
            <button
            className={`nav-sublink ${isActive("/coding") ? "nav-active" : ""}`}
            onClick={() => handleNavigate("/coding")}
            >
            Coding
            </button>
        </div>

        <div className="nav-item">
          <button
            className="interests-toggle"
            onClick={() => setPhotosOpen(!photosOpen)}
          >
            <span>Photos</span>
            <motion.div
              animate={{ rotate: photosOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <FaChevronDown size={12} />
            </motion.div>
          </button>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: photosOpen ? 1 : 0,
              height: photosOpen ? "auto" : 0
            }}
            transition={{ duration: 0.3 }}
            className="submenu"
          >
            <button
              className={`nav-sublink submenu-item ${isActive("/photos") ? "nav-active" : ""}`}
              onClick={() => handleNavigate("/photos")}
            >
              Collage
            </button>
            <button
              className={`nav-sublink submenu-item ${isActive("/photos/upload") ? "nav-active" : ""}`}
              onClick={() => handleNavigate("/photos/upload")}
            >
              Upload
            </button>
          </motion.div>
        </div>

        <div style={{ marginTop: 24 }}>
          <p style={{ opacity: 0.9 }}>More pages coming soon.</p>
        </div>
      </div>
    </motion.div>
  );
}
