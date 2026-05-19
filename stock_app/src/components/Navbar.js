import React from "react";
import "./Navbar.css";

function Navbar({ setPage }) {
  return (
    <nav className="navbar">
      <h2>📊 Stock Price Prediction</h2>

      <div className="nav-links">
        <button onClick={() => setPage("home")}>Home</button>
        <button onClick={() => setPage("linear")}>Linear</button>
        <button onClick={() => setPage("knn")}>KNN</button>
        <button onClick={() => setPage("compare")}>Comparison</button>
      </div>
    </nav>
  );
}

export default Navbar;