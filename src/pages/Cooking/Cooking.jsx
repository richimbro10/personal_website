import { useState } from "react";
import recipes from "./recipes";
import "./Cooking.css";
import "../../App.css";

export default function Cooking() {
  const [sortOrder, setSortOrder] = useState("desc");
const [search, setSearch] = useState("");

  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.title.toLowerCase().includes(search.toLowerCase()) ||
      (recipe.subtitle && recipe.subtitle.toLowerCase().includes(search.toLowerCase()))
  );
  const sortedRecipes = [...filteredRecipes].sort((a, b) =>
    sortOrder === "desc" ? b.rating - a.rating : a.rating - b.rating
  );

  const getRatingColor = (rating) => {
    const numericRating = parseFloat(rating);
    let ratingColor = '#3a4660';  
    if (!isNaN(numericRating)) {
      if (numericRating > 9.5) ratingColor = '#17633a'; 
      else if (numericRating > 8.5) ratingColor = '#219653';
      else if (numericRating > 8) ratingColor = '#6fcf97'; 
      else if (numericRating > 7) ratingColor = '#f2994a'; 
      else if (numericRating > 6) ratingColor = '#d7263d'; 
      else ratingColor = '#68111c';
    }
    return ratingColor;
  }

  return (
    <div className="cooking-page">
      <h1 className="cooking-title">Cooking</h1>
      <p className="cooking-intro">
        I love spending time in the kitchen, experimenting with new flavors and perfecting my favorite dishes. Here are some of my top recipes!
      </p>
      <input
        type="text"
        placeholder="Search recipes..."
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
      <div className="cooking-sort-bar">
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
      <div className="recipe-list">
        {sortedRecipes.map((recipe) => (
          <a
            className="recipe-card"
            href={recipe.url}
            target="_blank"
            rel="noopener noreferrer"
            key={recipe.title}
          >
            <div className="recipe-card-content">
              <div
                className="recipe-card-header responsive-recipe-header"
              >
                <span className="recipe-rating" style={{ backgroundColor: getRatingColor(recipe.rating) }}>{recipe.rating.toFixed(1)}/10</span>
                <div className="recipe-title-subtitle">
                  <h2 className="recipe-title">{recipe.title}</h2>
                  <div className="recipe-subtitle">{recipe.subtitle}</div>
                </div>
              </div>
              <div className="recipe-card-footer">
                <span className="view-recipe">View Recipe &rarr;</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
