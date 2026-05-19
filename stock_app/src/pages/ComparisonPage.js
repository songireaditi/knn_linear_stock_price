import React, { useState } from "react";
import axios from "axios";
import "./ComparisonPage.css";

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

function ComparisonPage() {
  const [stock, setStock] = useState("AAPL");
  const [range, setRange] = useState("1y");
  const [data, setData] = useState([]);
  const [linear, setLinear] = useState(null);
  const [knn, setKnn] = useState(null);
  const [result, setResult] = useState("");

  const handleCompare = async () => {
    try {
      const res = await axios.post("http://localhost:5000/compare", {
        stock,
        k: 5,
        period: range
      });

      setData(res.data?.data || []);
      setLinear(res.data?.linear || null);
      setKnn(res.data?.knn || null);
      setResult(res.data?.result || "");

    } catch (err) {
      console.log(err);
      alert("Error fetching comparison");
      setData([]);
    }
  };

  return (
    <div className="compare-container">
      <h2>⚖️ Model Comparison</h2>

      {/* Controls */}
      <div className="controls">
        <select onChange={(e) => setStock(e.target.value)}>
          {stocks.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <select onChange={(e) => setRange(e.target.value)}>
          <option value="1mo">1 Month</option>
          <option value="3mo">3 Months</option>
          <option value="6mo">6 Months</option>
          <option value="1y">1 Year</option>
        </select>

        <button onClick={handleCompare}>Compare</button>
      </div>

      {/* Chart */}
      {Array.isArray(data) && data.length > 0 && (
        <div className="chart">
          <LineChart width={900} height={400} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              angle={-30}
              textAnchor="end"
              height={60}
              interval={4}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line dataKey="actual" stroke="#000000" name="Actual" />
            <Line dataKey="linear" stroke="#8884d8" name="Linear" />
            <Line dataKey="knn" stroke="#ff7300" name="KNN" />
          </LineChart>
        </div>
      )}

      {/* 🔥 NEW METRICS UI */}
      {linear && knn && (
        <div className="compare-metrics">

          {/* Linear */}
          <div className="model-box">
            <h3>Linear Regression</h3>

            <div className="metrics">
              <div className="metric-box">
                <h4>R²</h4>
                <p className={linear.r2 < 0 ? "bad" : "good"}>
                  {linear.r2}
                </p>
              </div>

              <div className="metric-box">
                <h4>MAE</h4>
                <p>{linear.mae}</p>
              </div>

              <div className="metric-box">
                <h4>MSE</h4>
                <p>{linear.mse}</p>
              </div>
            </div>
          </div>

          {/* KNN */}
          <div className="model-box">
            <h3>KNN</h3>

            <div className="metrics">
              <div className="metric-box">
                <h4>R²</h4>
                <p className={knn.r2 < 0 ? "bad" : "good"}>
                  {knn.r2}
                </p>
              </div>

              <div className="metric-box">
                <h4>MAE</h4>
                <p>{knn.mae}</p>
              </div>

              <div className="metric-box">
                <h4>MSE</h4>
                <p>{knn.mse}</p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Result */}
      {result && (
        <div className="result-box">
          🏆 Best Model: {result}
        </div>
      )}
    </div>
  );
}

export default ComparisonPage;