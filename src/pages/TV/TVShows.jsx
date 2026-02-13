import { useState } from "react";
import tvshows from "./tvshows";
import "../TV/TVShows.css";

export default function TVShows() {
  const [sortOrder, setSortOrder] = useState("desc");
  const [search, setSearch] = useState("");

  const filteredShows = tvshows.filter(
    (show) =>
      show.title.toLowerCase().includes(search.toLowerCase()) ||
      (show.subtitle && show.subtitle.toLowerCase().includes(search.toLowerCase()))
  );
  // Parse subtitle as numeric rating for sorting
  const sortedShows = [...filteredShows].sort((a, b) => {
    const aNum = parseFloat(a.subtitle);
    const bNum = parseFloat(b.subtitle);
    if (isNaN(aNum) || isNaN(bNum)) return 0;
    return sortOrder === "desc" ? bNum - aNum : aNum - bNum;
  });

  return (
    <div className="tvshows-page">
      <h1 className="tvshows-title">TV Shows</h1>
      <p className="tvshows-intro">
        My favorite TV shows, the undisputed correct order. No, I will not watch Game of Thrones.
      </p>
      <input
        type="text"
        placeholder="Search shows..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          width: "100%",
          maxWidth: 340,
          marginBottom: 18,
          padding: "8px 14px",
          borderRadius: 8,
          border: "1.5px solid #e9e1d6",
          fontSize: "1.05rem",
          outline: "none",
          boxShadow: "0 1px 4px rgba(62,44,28,0.04)",
          color: "#3e2c1c"
        }}
      />
      <div className="tvshows-sort-bar">
        <span>Sort by rating:</span>
        <button
          className={`sort-btn ${sortOrder === "desc" ? "active" : ""}`}
          onClick={() => setSortOrder("desc")}
        >
          High to Low
        </button>
        <button
          className={`sort-btn ${sortOrder === "asc" ? "active" : ""}`}
          onClick={() => setSortOrder("asc")}
        >
          Low to High
        </button>
      </div>
      <div className="tvshow-list">
        {sortedShows.map((show) => {
          const numericRating = parseFloat(show.subtitle);
          // Determine color for rating box
          let ratingColor = '#3a4660';
          if (!isNaN(numericRating)) {
            if (numericRating > 9.5) ratingColor = '#17633a'; 
            else if (numericRating > 9) ratingColor = '#219653';
            else if (numericRating > 8.5) ratingColor = '#6fcf97'; 
            else if (numericRating > 8) ratingColor = '#f2994a'; 
            else if (numericRating > 7) ratingColor = '#d7263d'; 
            else ratingColor = '#68111c';
          }
          return (
            <div className="tvshow-card" key={show.title}>
              <div className="tvshow-card-content">
                <div className="tvshow-card-header responsive-tvshow-header">
                  {!isNaN(numericRating) && (
                    <span className="tvshow-rating" style={{background: ratingColor}}>{numericRating.toFixed(1)}/10</span>
                  )}
                  <div className="tvshow-title-subtitle">
                    <h2 className="tvshow-title">{show.title}</h2>
                    <div className="tvshow-subtitle">{!isNaN(numericRating) ? null : show.subtitle}</div>
                  </div>
                </div>
                {show.rating && (
                  <div className="tvshow-review" style={{marginTop: 8, color: '#3a4660', fontSize: '1.01rem', opacity: 0.92}}>
                    {show.rating}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {/* Suggest a Show Form */}
      <form
        action="https://formspree.io/f/mdaledyg"
        method="POST"
        style={{
          background: '#fffdfa',
          borderRadius: 16,
          boxShadow: '0 2px 16px rgba(62,44,28,0.08)',
          border: '1.5px solid #e9e1d6',
          padding: '24px 18px 18px 18px',
          marginTop: 40,
          maxWidth: 420,
          marginLeft: 'auto',
          marginRight: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 14
        }}
      >
        <h3 style={{margin: '0 0 10px 0', color: 'var(--brown)'}}>Suggest Me a Show</h3>
        <input
          type="text"
          name="show"
          required
          placeholder="Show Title"
          style={{
            padding: '8px 12px',
            borderRadius: 8,
            border: '1.5px solid #e9e1d6',
            fontSize: '1.05rem',
            marginBottom: 8
          }}
        />
        <textarea
          name="comments"
          placeholder="Comments (optional)"
          rows={3}
          style={{
            padding: '8px 12px',
            borderRadius: 8,
            border: '1.5px solid #e9e1d6',
            fontSize: '1.05rem',
            marginBottom: 8,
            resize: 'vertical'
          }}
        />
        <input
          type="text"
          name="name"
          required
          placeholder="Your Name"
          style={{
            padding: '8px 12px',
            borderRadius: 8,
            border: '1.5px solid #e9e1d6',
            fontSize: '1.05rem',
            marginBottom: 12
          }}
        />
        <button
          type="submit"
          style={{
            background: 'var(--gold)',
            color: 'var(--brown)',
            fontWeight: 600,
            border: 'none',
            borderRadius: 8,
            padding: '10px 0',
            fontSize: '1.08rem',
            cursor: 'pointer',
            boxShadow: '0 1px 4px rgba(62,44,28,0.06)'
          }}
        >
          Send Suggestion
        </button>
      </form>
    </div>
  );
}
