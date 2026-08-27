import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import UserRoutes from './modules/user/routes/UserRoutes';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Member 1 User Module Entry Route */}
        <Route path="/user/*" element={<UserRoutes />} />

        {/* Redirect root to /user */}
        <Route path="/" element={<Navigate to="/user" replace />} />
        <Route path="*" element={<Navigate to="/user" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
