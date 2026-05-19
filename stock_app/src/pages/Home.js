import React from "react";
import "./Home.css";

function Home() {
  return (
    <div>

      {/* 🔥 HERO SECTION */}
      <div className="hero">
        <h1>📊 Stock Price Prediction</h1>
        <p>
          Predict stock prices using Machine Learning models
        </p>
      </div>

      {/* 🔽 CONTENT SECTION */}
      <div className="content">

        {/* Linear */}
        <div className="card">
          <h2>📉 Linear Regression</h2>

          <h3>Step 1: Mean</h3>
          <p className="formula">x̄ = Σx / n</p>
          <p className="formula">ȳ = Σy / n</p>

          <h3>Step 2: Slope</h3>
          <p className="formula">
            m = Σ((x - x̄)(y - ȳ)) / Σ((x - x̄)²)
          </p>

          <h3>Step 3: Intercept</h3>
          <p className="formula">c = ȳ - m·x̄</p>

          <h3>Step 4: Prediction</h3>
          <p className="formula">ŷ = mx + c</p>
        </div>

        {/* KNN */}
        <div className="card">
          <h2>📈 KNN</h2>

          <h3>Step 1: Normalize</h3>
          <p className="formula">x' = (x - min)/(max - min)</p>

          <h3>Step 2: Distance</h3>
          <p className="formula">d = √Σ(xᵢ - xⱼ)²</p>

          <h3>Step 3: Sort</h3>
          <p>Arrange distances in ascending order</p>

          <h3>Step 4: Select K</h3>
          <p>Choose top K nearest</p>

          <h3>Step 5: Prediction</h3>
          <p className="formula">ŷ = (y₁ + ... + yₖ)/K</p>
        </div>

      </div>

    </div>
  );
}

export default Home;