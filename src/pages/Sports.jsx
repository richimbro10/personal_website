import React from "react";

const TEAMS = [
  {
    id: "yankees",
    name: "New York Yankees",
    sport: "MLB",
    emoji: "⚾",
    color: "linear-gradient(135deg, #0c2c56 0%, #bd3039 100%)",
  },
  {
    id: "giants",
    name: "New York Giants",
    sport: "NFL",
    emoji: "🏈",
    color: "linear-gradient(135deg, #0b2142 0%, #a71930 100%)",
  },
  {
    id: "knicks",
    name: "New York Knicks",
    sport: "NBA",
    emoji: "🏀",
    color: "linear-gradient(135deg, #1f4788 0%, #f58426 100%)",
  },
  {
    id: "islanders",
    name: "New York Islanders",
    sport: "NHL",
    emoji: "🏒",
    color: "linear-gradient(135deg, #00205b 0%, #f47b20 100%)",
  },
  {
    id: "bayern",
    name: "Bayern Munich",
    sport: "Bundesliga",
    emoji: "⚽",
    color: "linear-gradient(135deg, #dc052d 0%, #ffffff 100%)",
  },
];

export default function Sports() {
  return (
    <section className="sports-page">
      <div className="sports-inner">
        <header className="sports-header">
          <h2>Sports</h2>
          <p>My favorite teams across baseball, football, basketball, hockey, and soccer.</p>
        </header>

        <div className="teams-grid">
          {TEAMS.map((team) => (
            <div key={team.id} className="team-card">
              <div
                className="team-artwork"
                style={{ background: team.color }}
                aria-hidden
              >
                <span className="team-emoji">{team.emoji}</span>
              </div>

              <div className="team-info">
                <div className="team-name">{team.name}</div>
                <div className="team-sport">{team.sport}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
