import { motion } from "framer-motion";
import { FaBars, FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Navbar({ showHeader, onMenuToggle }) {
  return (
    <>
      {!showHeader ? (
        <div className="absolute-nav">
          <div className="absolute-icons-left">
            <FaBars onClick={onMenuToggle} />
          </div>
          <div className="absolute-icons-right">
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <FaInstagram />
            </a>
            <a href="https://x.com" target="_blank" rel="noreferrer">
              <FaTwitter />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              <FaLinkedin />
            </a>
          </div>
        </div>
      ) : (
        <motion.div
          className="top-header navbar"
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="left">
            <FaBars onClick={onMenuToggle} />
          </div>

          <div className="right">
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <FaInstagram />
            </a>
            <a href="https://x.com" target="_blank" rel="noreferrer">
              <FaTwitter />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              <FaLinkedin />
            </a>
          </div>
        </motion.div>
      )}
    </>
  );
}
