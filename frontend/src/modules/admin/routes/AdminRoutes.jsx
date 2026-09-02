import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminDashboard from '../dashboard/AdminDashboard';
import AdminAccountsPage from '../accounts/AdminAccountsPage';
import AdminFacilitiesPage from '../facilities/AdminFacilitiesPage';

export default function AdminRoutes() {
  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 font-sans antialiased">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto min-w-0">
        <Routes>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="accounts" element={<AdminAccountsPage />} />
          <Route path="facilities" element={<AdminFacilitiesPage />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}
