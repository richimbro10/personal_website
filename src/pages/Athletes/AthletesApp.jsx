import { useState } from "react";
import AthletesRanking from "./AthletesRanking";
import { athletes } from "./Athletes";
import { allSportsAthletes } from "./AthletesAllSports";
import "./songbattle.css";

export default function AthletesApp() {
  const [activeTab, setActiveTab] = useState("ny");

  const tabConfigs = {
    ny: {
      athletes: athletes,
      title: "Which NY athlete is better?",
      description:
        "Pick between two NY athletes to build your personal top ranking. Base it off of not 'who is more athletic', but who is the better athlete in their sport. Let me know any athletes I forgot!",
      resultTitle: "Your Ranked NY Athletes",
      resultDescription:
        "Congratulations! Here's your personal ranking of the best NY athletes.",
    },
    allSports: {
      athletes: allSportsAthletes,
      title: "Which athlete is better?",
      description:
        "Pick between top athletes across all sports to build your personal ranking. Compare athletes from different sports and decide who is the better overall athlete!",
      resultTitle: "Your Ranked All-Sport Athletes",
      resultDescription:
        "Congratulations! Here's your personal ranking of the best athletes across all sports.",
    },
  };

  const config = tabConfigs[activeTab];

  return (
    <div className="athletes-app-container">
      <div className="athletes-tabs">
        <button
          className={`athletes-tab ${activeTab === "ny" ? "active" : ""}`}
          onClick={() => setActiveTab("ny")}
        >
          NY Athletes
        </button>
        <button
          className={`athletes-tab ${activeTab === "allSports" ? "active" : ""}`}
          onClick={() => setActiveTab("allSports")}
        >
          All Sports Athletes
        </button>
      </div>

      <AthletesRanking key={activeTab} {...config} />
    </div>
  );
}
