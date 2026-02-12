import React from "react";

const PLAYLISTS = [
  {
    id: "shuffle",
    name: "Just Hit Shuffle",
    genre: "Rap",
    href: "https://open.spotify.com/playlist/34ppDXlhhN4LcI0idH9Mwr?si=7cae0eea6d4c47da",
    emoji: "🎧",
    color: "linear-gradient(135deg,#ff8a00 0%,#e52e71 100%)",
  },
  {
    id: "throwbacks",
    name: "Best Throwbacks",
    genre: "Throwback Pop",
    href: "https://open.spotify.com/search/Back%20Throwbacks",
    emoji: "📼",
    color: "linear-gradient(135deg,#6a11cb 0%,#2575fc 100%)",
  },
  {
    id: "ball",
    name: "Ball Knowers",
    genre: "Rap",
    href: "https://open.spotify.com/search/Ball%20Knowers",
    emoji: "🔥",
    color: "linear-gradient(135deg,#f953c6 0%,#b91d73 100%)",
  },
  {
    id: "ricks",
    name: "This Ricks",
    genre: "Old Pop",
    href: "https://open.spotify.com/search/This%20Ricks",
    emoji: "🎷",
    color: "linear-gradient(135deg,#56ab2f 0%,#a8e063 100%)",
  },
];

export default function Music() {
  return (
    <section className="music-page">
      <div className="music-inner">
        <header className="music-header">
          <h2>Music</h2>
          <p>Here are a few of my favorite playlists and music types. Give me a follow on Spotify!</p>
        </header>

        <div className="playlist-grid">
          {PLAYLISTS.map((p) => (
            <a
              key={p.id}
              className="playlist-card"
              href={p.href}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className="artwork"
                style={{ background: p.color }}
                aria-hidden
              >
                <span className="art-emoji">{p.emoji}</span>
              </div>

              <div className="playlist-info">
                <div className="playlist-name">{p.name}</div>
                <div className="playlist-genre">{p.genre}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

