import React, { useState } from "react";
import axios from "axios";
import "./LinearPage.css";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";

const stocks = [
  "RELIANCE.NS","TCS.NS","INFY.NS","HDFCBANK.NS","ICICIBANK.NS",
  "AAPL","MSFT","GOOGL","AMZN","TSLA"
];

function LinearPage() {
  const [stock, setStock] = useState("AAPL");
  const [range, setRange] = useState("1y");
  const [data, setData] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [showInfo, setShowInfo] = useState(false); // ⭐ NEW

  const handlePredict = async () => {
    console.log("Button clicked ✅");

    try {
      const res = await axios.post("http://localhost:5000/predict", {
        stock,
        model: "linear",
        period: range
      });

      console.log("Response:", res.data);

      setData(res.data?.data || []);
      setMetrics(res.data?.metrics || null);

    } catch (err) {
      console.log("Error:", err);
      alert("Error fetching data");
      setData([]);
    }
  };

  return (
    <div className="linear-container">
      <h2>📊 Linear Regression</h2>

      {/* Controls */}
      <div className="controls">
        {/* Stock */}
        <select onChange={(e) => setStock(e.target.value)}>
          {stocks.map(s => <option key={s}>{s}</option>)}
        </select>

        {/* Range */}
        <select onChange={(e) => setRange(e.target.value)}>
          <option value="1mo">1 Month</option>
          <option value="3mo">3 Months</option>
          <option value="6mo">6 Months</option>
          <option value="1y">1 Year</option>
        </select>

        {/* Info Button ⭐ */}
        <button onClick={() => setShowInfo(true)}>
          What is Linear Regression?
        </button>

        {/* Predict */}
        <button onClick={handlePredict}>Predict</button>
      </div>

      {/* Chart */}
      {Array.isArray(data) && data.length > 0 && (
        <LineChart width={900} height={400} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            angle={-30}
            textAnchor="end"
            height={60}
            interval={2}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line dataKey="actual" stroke="#8884d8" />
          <Line dataKey="predicted" stroke="#82ca9d" />
        </LineChart>
      )}

      {/* Metrics */}
     {metrics && (
  <div className="metrics-wrapper">   {/* 👈 NEW */}
    
    <div className="metrics">
      <div className="metric-box">
        <h4>R²</h4>
        <p className={metrics.r2 < 0 ? "bad" : "good"}>
          {metrics.r2}
        </p>
      </div>

      <div className="metric-box">
        <h4>MAE</h4>
        <p>{metrics.mae}</p>
      </div>

      <div className="metric-box">
        <h4>MSE</h4>
        <p>{metrics.mse}</p>
      </div>
    </div>

  </div>
      )}

      {/* ⭐ POPUP */}
      {showInfo && (
        <div className="modal">
          <div className="modal-content">
            <h2>Linear Regression</h2>

            <p>
              Linear Regression is a supervised machine learning algorithm used
              to predict continuous values by fitting a straight line.
            </p>

            <ul>
              <li>Assumes linear relationship</li>
              <li> Fast and simple</li>
              <li> Works well for trends</li>
              <li> Not suitable for complex patterns</li>
            </ul>

            <button onClick={() => setShowInfo(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LinearPage;