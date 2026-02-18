import { motion } from "framer-motion";
import { FaReact } from "react-icons/fa";
import { SiVite, SiVercel } from "react-icons/si";
import { MdEmail } from "react-icons/md";
import "./Coding.css";
import "../../App.css";

export default function Coding() {
  return (
    <div className="coding-page">
      <div className="coding-header">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="coding-title">How I Built This Website</h1>
          <p className="coding-subtitle">
            Besides the blood, sweat, and tears.
          </p>
        </motion.div>
      </div>

      <div className="coding-intro">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          This entire website is built with React, Vite, and Vercel. Against better judgment, I didn't use MUI and instead did bare-bone custom CSS for practice.
        </motion.p>
      </div>

      <motion.div
        className="tech-stack-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <h2>The Tech Stack</h2>
        <div className="build-stack-grid">
          <div className="build-card">
            <div className="build-card-header">
              <span className="build-emoji"><FaReact /></span>
              <h3>React.js + TypeAnimation</h3>
            </div>
            <p className="build-description">
              Built the frontend with React and Framer Motion for smooth animations. No MUI packages here!
            </p>
          </div>

          <div className="build-card">
            <div className="build-card-header">
              <span className="build-emoji"><SiVite /></span>
              <h3>Node.js & Vite</h3>
            </div>
            <p className="build-description">
              Used Node.js for the development environment and Vite for building, WAYYY better than react-scripts.
            </p>
          </div>

          <div className="build-card">
            <div className="build-card-header">
              <span className="build-emoji"><SiVercel /></span>
              <h3>Vercel Deployment</h3>
            </div>
            <p className="build-description">
              Deployed on Vercel for automatic deployments from GitHub on MRs to master, zero-config serverless functions, and built-in caching. Life saver as someone who used to deploy with Tomcat lol.
            </p>
          </div>

          <div className="build-card">
            <div className="build-card-header">
              <span className="build-emoji"><MdEmail /></span>
              <h3>Formspree.io</h3>
            </div>
            <p className="build-description">
              Used Formspree for forms. Emails go straight to my inbox with no backend.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}