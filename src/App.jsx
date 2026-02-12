import { motion, useScroll, useTransform } from "framer-motion";
import {
  FaBars,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaGraduationCap,
  FaBriefcase,
  FaCode,
  FaBaseballBall,
  FaArrowUp
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { TypeAnimation } from "react-type-animation";
import "./App.css";

function SectionCard({ icon, title, text, align = "left", dark }) {
  return (
    <section className={`section ${dark ? "dark" : ""}`}>
      <div className={`section-inner ${align}`}>
        <motion.div
          className="card"
          initial={{ opacity: 0, x: align === "left" ? -100 : 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: true }}
        >
          <div className="card-header">
            {icon}
            <h2>{title}</h2>
          </div>
          <p>{text}</p>
        </motion.div>
      </div>
    </section>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [showHeader, setShowHeader] = useState(false);

  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 600);
      setShowHeader(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="app">
      {/* Scroll progress bar */}
      <motion.div className="progress-bar" style={{ width: progressWidth }} />

      {/* Icons on load (absolute over hero) */}
      {!showHeader && (
        <>
          <div className="absolute-icons-left">
            <FaBars onClick={() => setMenuOpen(true)} />
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
        </>
      )}

      {/* Sticky brown header after scroll */}
      {showHeader && (
        <motion.div
          className="top-header"
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="left">
            <FaBars onClick={() => setMenuOpen(true)} />
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

      {/* Hamburger overlay */}
      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)} />}

      {/* Side menu */}
      <motion.div
        className="side-menu"
        initial={{ x: -300 }}
        animate={{ x: menuOpen ? 0 : -300 }}
        transition={{ duration: 0.6 }}
      >
        <h3>Navigation</h3>
        <ul>
          <li>Home</li>
          <li>Projects</li>
          <li>Blog</li>
          <li>Contact</li>
        </ul>
      </motion.div>

      {/* HERO */}
      <section className="hero">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          <h1>Hi, I’m Rich Imbro</h1>
          <div className="typewriter">
            <TypeAnimation
              sequence={[
                "Software Engineer.",
                1500,
                "Full-Stack Developer.",
                1500,
                "Huge Yankee Fan.",
                1500
              ]}
              speed={50}
              repeat={Infinity}
              cursor={true}
            />
          </div>
        </motion.div>
      </section>

      {/* Sections */}
      <SectionCard
        icon={<FaGraduationCap className="icon" />}
        title="Binghamton University"
        text="Graduated in 2023. Built my foundation in computer science, systems design, and scalable architecture."
        align="left"
      />

      <SectionCard
        icon={<FaBriefcase className="icon" />}
        title="Software Engineer @ Broadridge"
        text="Designing and building production-grade systems in Platform Engineering."
        align="right"
        dark
      />

      <SectionCard
        icon={<FaCode className="icon" />}
        title="Full-Stack Engineer"
        text="Python, JavaScript, Java, C, C++. From backend systems to modern responsive frontends."
        align="left"
      />

      <SectionCard
        icon={<FaBaseballBall className="icon" />}
        title="Beyond Code"
        text="Huge Yankees fan. Love golfing, bowling, and spending quality time with friends."
        align="right"
        dark
      />

      {/* Social section at bottom */}
      <section className="social-section">
        <a href="https://linkedin.com" target="_blank" rel="noreferrer">
          <FaLinkedin className="icon" /> LinkedIn
        </a>
        <a href="https://twitter.com" target="_blank" rel="noreferrer">
          <FaTwitter className="icon" /> Twitter
        </a>
      </section>

      {/* Back to top */}
      {showTop && (
        <motion.div
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <FaArrowUp />
        </motion.div>
      )}
    </div>
  );
}
