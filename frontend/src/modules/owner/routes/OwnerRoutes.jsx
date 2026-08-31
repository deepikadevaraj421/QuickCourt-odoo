import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import OwnerSidebar from '../components/OwnerSidebar';
import OwnerTopbar from '../components/OwnerTopbar';
import OwnerDashboard from '../dashboard/OwnerDashboard';
import OwnerFacilitiesPage from '../facilities/OwnerFacilitiesPage';
import OwnerBookingsPage from '../bookings/OwnerBookingsPage';
import OwnerReviewsPage from '../reviews/OwnerReviewsPage';
import OwnerNotificationsPage from '../notifications/OwnerNotificationsPage';
import OwnerAnalyticsPage from '../analytics/OwnerAnalyticsPage';
import OwnerProfilePage from '../profile/OwnerProfilePage';
import ownerService from '../services/ownerService';

export default function OwnerRoutes() {
  const [profile, setProfile] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const userProfile = await ownerService.getProfile();
        setProfile(userProfile);
      } catch (err) {
        setProfile({ name: 'Lina' });
      }

      try {
        const notifications = await ownerService.getNotifications();
        setUnreadCount((notifications || []).filter(item => !item.isRead).length);
      } catch (err) {
        setUnreadCount(0);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      <OwnerSidebar profile={profile} unreadCount={unreadCount} />
      <div className="flex-1 flex flex-col min-w-0">
        <OwnerTopbar title="Owner Dashboard" profile={profile} unreadCount={unreadCount} />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route index element={<OwnerDashboard />} />
            <Route path="dashboard" element={<OwnerDashboard />} />
            <Route path="facilities" element={<OwnerFacilitiesPage />} />
            <Route path="courts" element={<div className="p-6 text-slate-500">Courts management is ready for real integration.</div>} />
            <Route path="availability" element={<div className="p-6 text-slate-500">Availability calendar is ready for real integration.</div>} />
            <Route path="bookings" element={<OwnerBookingsPage />} />
            <Route path="earnings" element={<div className="p-6 text-slate-500">Earnings dashboard is ready for real integration.</div>} />
            <Route path="reviews" element={<OwnerReviewsPage />} />
            <Route path="notifications" element={<OwnerNotificationsPage />} />
            <Route path="analytics" element={<OwnerAnalyticsPage />} />
            <Route path="profile" element={<OwnerProfilePage />} />
            <Route path="*" element={<Navigate to="/owner/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

