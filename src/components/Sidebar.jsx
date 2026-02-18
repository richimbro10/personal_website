import { useState } from "react";
import { motion } from "framer-motion";

export default function Sidebar({ menuOpen, setMenuOpen, page, setPage }) {
  const [interestsOpen, setInterestsOpen] = useState(false);

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
            className={`nav-sublink ${page === "home" ? "nav-active" : ""}`}
            onClick={() => {
              setPage("home");
              setMenuOpen(false);
            }}
          >
            Home
          </button>
        </div>
        <div className="nav-item">
            <button
            className={`nav-sublink ${page === "cooking" ? "nav-active" : ""}`}
            onClick={() => {
                setPage("cooking");
                setMenuOpen(false);
            }}
            >
            Cooking
            </button>
        </div>
        <div className="nav-item">
            <button
            className={`nav-sublink ${page === "tv" ? "nav-active" : ""}`}
            onClick={() => {
                setPage("tv");
                setMenuOpen(false);
            }}
            >
            TV Shows
            </button>
        </div>
        <div className="nav-item">
            <button
            className={`nav-sublink ${page === "quiz" ? "nav-active" : ""}`}
            onClick={() => {
                setPage("quiz");
                setMenuOpen(false);
            }}
            >
            Quiz
            </button>
        </div>
        <div className="nav-item">
            <button
            className={`nav-sublink ${page === "coding" ? "nav-active" : ""}`}
            onClick={() => {
                setPage("coding");
                setMenuOpen(false);
            }}
            >
            Coding
            </button>
        </div>
        <div style={{ marginTop: 24 }}>
          <p style={{ opacity: 0.9 }}>More pages coming soon.</p>
        </div>
      </div>
    </motion.div>
  );
}
