import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UserSidebar from '../components/UserSidebar';
import UserTopbar from '../components/UserTopbar';

import UserDashboard from '../dashboard/UserDashboard';
import FacilitiesPage from '../facilities/FacilitiesPage';
import BookingsPage from '../bookings/BookingsPage';
import MatchHubPage from '../matches/MatchHubPage';
import FavoritesPage from '../favorites/FavoritesPage';
import ReviewsPage from '../reviews/ReviewsPage';
import NotificationsPage from '../notifications/NotificationsPage';
import UserAnalyticsPage from '../analytics/UserAnalyticsPage';
import UserProfilePage from '../profile/UserProfilePage';
import WalletPage from '../wallet/WalletPage';

import userService from '../services/userService';

export const UserRoutes = () => {
  const [globalSearch, setGlobalSearch] = useState('');
  const [profile, setProfile] = useState(null);
  const [unreadCount, setUnreadCount] = useState(1);

  useEffect(() => {
    userService.getProfile().then(setProfile).catch(() => {});
    userService.getNotifications().then(notifs => {
      if (notifs) setUnreadCount(notifs.filter(n => !n.isRead).length);
    }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 font-sans antialiased">
      {/* User Sidebar */}
      <UserSidebar unreadCount={unreadCount} />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* User Topbar */}
        <UserTopbar
          search={globalSearch}
          setSearch={setGlobalSearch}
          profile={profile}
          unreadCount={unreadCount}
        />

        {/* Dynamic Route Pages */}
        <main className="p-8 flex-1 overflow-y-auto">
          <Routes>
            <Route index element={<UserDashboard />} />
            <Route path="facilities" element={<FacilitiesPage />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="matches" element={<MatchHubPage myMatchesOnly={false} />} />
            <Route path="my-matches" element={<MatchHubPage myMatchesOnly={true} />} />
            <Route path="favorites" element={<FavoritesPage />} />
            <Route path="reviews" element={<ReviewsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="analytics" element={<UserAnalyticsPage />} />
            <Route path="profile" element={<UserProfilePage />} />
            <Route path="wallet" element={<WalletPage />} />
            <Route path="*" element={<Navigate to="/user" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default UserRoutes;
