import { motion } from "framer-motion";
import { FaBars, FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";

const LINKEDIN_URL = "https://www.linkedin.com/in/richardimbro?utm_source=share_via&utm_content=profile&utm_medium=member_ios";
const TWITTER_URL = "https://x.com/richimbro?s=21&t=dLCSzhTOqXkZGdZGfREntA";
const INSTAGRAM_URL = "https://www.instagram.com/richimbro?igsh=ZnpuOWFhanY0OG8x&utm_source=qr";

export default function Navbar({ showHeader, onMenuToggle }) {
  return (
    <>
      {!showHeader ? (
        <div className="absolute-nav">
          <div className="absolute-icons-left">
            <FaBars onClick={onMenuToggle} />
          </div>
          <div className="absolute-icons-right">
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
              <FaInstagram />
            </a>
            <a href={TWITTER_URL} target="_blank" rel="noreferrer">
              <FaTwitter />
            </a>
            <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">
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
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
              <FaInstagram />
            </a>
            <a href={TWITTER_URL} target="_blank" rel="noreferrer">
              <FaTwitter />
            </a>
            <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">
              <FaLinkedin />
            </a>
          </div>
        </motion.div>
      )}
    </>
  );
}
