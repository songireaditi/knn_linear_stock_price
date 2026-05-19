import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import LinearPage from "./pages/LinearPage";
import KNNPage from "./pages/KNNPage";
import ComparisonPage from "./pages/ComparisonPage";

function App() {
  const [page, setPage] = useState("home");

  return (
    <div>
      <Navbar setPage={setPage} />

      {page === "home" && <Home />}

      {page === "linear" && <LinearPage />}
     {page === "knn" && <KNNPage />}
      {page === "compare" && <ComparisonPage />}
    </div>
  );
}

export default App;