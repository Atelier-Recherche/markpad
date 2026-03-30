import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { App } from "./app/App";
import { AdminPanel } from "./pages/AdminPanel";
import { AuthVerify } from "./pages/AuthVerify";
import { Dashboard } from "./pages/Dashboard";
import { Home } from "./pages/Home";
import "./i18n/index";
import "./style.css";

ReactDOM.createRoot(document.getElementById("app")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/share/:roomId" element={<App />} />
        <Route path="/auth/verify" element={<AuthVerify />} />
        <Route path="/me" element={<Dashboard />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
