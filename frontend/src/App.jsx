import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import UserRoutes from './modules/user/routes/UserRoutes';
import OwnerRoutes from './modules/owner/routes/OwnerRoutes';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/user/*" element={<UserRoutes />} />
        <Route path="/owner/*" element={<OwnerRoutes />} />

        <Route path="/" element={<Navigate to="/owner/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/owner/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
