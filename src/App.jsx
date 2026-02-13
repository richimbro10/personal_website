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
import Navbar from "./components/Navbar";
import Sports from "./pages/Sports";
import Cooking from "./pages/Cooking/Cooking";
import Sidebar from "./components/Sidebar";

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
  const [page, setPage] = useState("home");
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
      <motion.div className="progress-bar" style={{ width: progressWidth }} />

      <Navbar
        showHeader={showHeader}
        onMenuToggle={() => setMenuOpen(true)}
        page={page}
        setPage={setPage}
      />

      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)} />}

      <Sidebar
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        page={page}
        setPage={setPage}
      />

      {page === "home" ? (
        <>
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
                    1500,
                  ]}
                  speed={50}
                  repeat={Infinity}
                  cursor={true}
                />
              </div>
            </motion.div>
          </section>

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
            text="Huge Yankees fan. Love golfing, bowling, and spending quality time with friends. Also a huge passion for cooking and music."
            align="right"
            dark
          />
        </>
      ) : page === "sports" ? (
        <Sports />
      ) : page === "cooking" ? (
        <Cooking />
      ) : null}

      <section className="social-section">
        <a href="https://www.linkedin.com/in/richardimbro?utm_source=share_via&utm_content=profile&utm_medium=member_ios" target="_blank" rel="noreferrer">
          <FaLinkedin className="icon" /> LinkedIn
        </a>
        <a href="https://twitter.com" target="_blank" rel="noreferrer">
          <FaTwitter className="icon" /> Twitter
        </a>
      </section>

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
