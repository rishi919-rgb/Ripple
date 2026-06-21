import React from "react";
import { Routes, Route } from "react-router-dom";
import UploadPage from "./pages/UploadPage";
import DetectionPage from "./pages/DetectionPage";
import ResultPage from "./pages/ResultPage";

function App() {
  return (
    <div className="min-h-screen bg-white text-black">
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/detection" element={<DetectionPage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </div>
  );
}

export default App;
