import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { App } from "./app/App";
import "@milkdown/crepe/theme/common/style.css";
import "./style.css";

ReactDOM.createRoot(document.getElementById("app")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/share/demo" replace />} />
        <Route path="/share/:roomId" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
