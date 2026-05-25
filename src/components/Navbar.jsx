import { motion } from "framer-motion";
import { FaBars, FaLinkedin, FaTwitter, FaInstagram, FaMoon, FaSun, FaChevronDown, FaCircle, FaFlask, FaHockeyPuck, FaFootballBall } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";

const LINKEDIN_URL = "https://www.linkedin.com/in/richardimbro?utm_source=share_via&utm_content=profile&utm_medium=member_ios";
const TWITTER_URL = "https://x.com/richimbro?s=21&t=dLCSzhTOqXkZGdZGfREntA";
const INSTAGRAM_URL = "https://www.instagram.com/richimbro?igsh=ZnpuOWFhanY0OG8x&utm_source=qr";

const THEMES = [
  { id: 'original', name: 'Original (Coffee)', icon: FaMoon },
  { id: 'aquad', name: 'Aqua', icon: FaSun },
  { id: 'dark', name: 'Dark Mode', icon: FaCircle },
  { id: 'retro', name: 'Breaking Bad', icon: FaFlask },
  { id: 'islanders', name: 'Islanders', icon: FaHockeyPuck },
  { id: 'giants', name: 'Giants', icon: FaFootballBall },
];

export default function Navbar({ showHeader, onMenuToggle, theme, onThemeToggle }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleThemeSelect = (themeId) => {
    if (themeId !== theme) {
      onThemeToggle(themeId);
    }
    setDropdownOpen(false);
  };

  const currentTheme = THEMES.find(t => t.id === theme);
  const CurrentIcon = currentTheme?.icon || FaMoon;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [dropdownOpen]);
  return (
    <>
      {!showHeader ? (
        <div className="absolute-nav">
          <div className="absolute-icons-left">
            <FaBars onClick={onMenuToggle} />
          </div>
          <div className="absolute-icons-center">
            <div className="theme-dropdown" ref={dropdownRef}>
              <button 
                className="theme-toggle-btn" 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                title="Switch theme"
              >
                <CurrentIcon />
                <FaChevronDown className="dropdown-chevron" />
              </button>
              {dropdownOpen && (
                <div className="theme-dropdown-menu">
                  {THEMES.map((t) => {
                    const Icon = t.icon;
                    return (
                      <button
                        key={t.id}
                        className={`theme-option ${theme === t.id ? 'active' : ''}`}
                        onClick={() => handleThemeSelect(t.id)}
                      >
                        <Icon />
                        <span>{t.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
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
          <div className="center">
            <div className="theme-dropdown" ref={dropdownRef}>
              <button 
                className="theme-toggle-btn" 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                title="Switch theme"
              >
                <CurrentIcon />
                <FaChevronDown className="dropdown-chevron" />
              </button>
              {dropdownOpen && (
                <div className="theme-dropdown-menu">
                  {THEMES.map((t) => {
                    const Icon = t.icon;
                    return (
                      <button
                        key={t.id}
                        className={`theme-option ${theme === t.id ? 'active' : ''}`}
                        onClick={() => handleThemeSelect(t.id)}
                      >
                        <Icon />
                        <span>{t.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
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
