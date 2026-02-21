import React, { useState } from "react";
import TravelGlobe from "./TravelGlobe";
import "./TravelGlobe.css";

const TravelSection = () => {
  const [popup, setPopup] = useState(null);

  return (
    <section className="travel-section">
      <div className="travel-header">
        <h1>Where I've Been</h1>
        <p>
          A visual map of the places I've been so far. Tap or click a
          country or state to learn more about my experience there.
        </p>
      </div>

      <div className="globe-wrapper">
        <TravelGlobe setPopup={setPopup} />
      </div>

      {popup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <div className="popup-header">
              <h2>{popup.title}</h2>
              <span className="popup-caption">
                Last visited: {popup.lastVisited}
              </span>
              <button
                className="popup-close"
                onClick={() => setPopup(null)}
                aria-label="Close popup"
              >
                &times;
              </button>
            </div>

            <div className="popup-body">
              <p>{popup.content}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TravelSection;