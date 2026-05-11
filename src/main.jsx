import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import App from './App';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/report-preview/alchemy-v1/all" replace />} />
        <Route path="/report-preview" element={<Navigate to="/report-preview/2" replace />} />
        <Route path="/report-preview/all" element={<App mode="all" />} />
        <Route path="/report-preview/alchemy-v1" element={<Navigate to="/report-preview/alchemy-v1/all" replace />} />
        <Route path="/report-preview/alchemy-v1/all" element={<App mode="all" template="alchemy" />} />
        <Route path="/report-preview/alchemy-v1/:pageId" element={<App mode="single" template="alchemy" />} />
        <Route path="/report-preview/:pageId" element={<App mode="single" />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>,
);
