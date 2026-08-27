const userService = require('../services/userService');

const userController = {
  // Facilities
  getFacilities: (req, res) => {
    try {
      const facilities = userService.getFacilities(req.query);
      res.json({ success: true, message: 'Facilities retrieved successfully', data: facilities });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  getFacilityById: (req, res) => {
    try {
      const facility = userService.getFacilityById(req.params.id);
      if (!facility) {
        return res.status(404).json({ success: false, message: 'Facility not found' });
      }
      res.json({ success: true, message: 'Facility details retrieved', data: facility });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  getCourtsByFacilityId: (req, res) => {
    try {
      const courts = userService.getCourtsByFacilityId(req.params.id);
      res.json({ success: true, message: 'Courts retrieved', data: courts });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  getCourtAvailability: (req, res) => {
    try {
      const { date } = req.query;
      const slots = userService.getCourtAvailability(req.params.id, date || new Date().toISOString().split('T')[0]);
      res.json({ success: true, message: 'Court availability retrieved', data: slots });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Bookings
  createBooking: (req, res) => {
    try {
      const booking = userService.createBooking(req.body);
      res.status(201).json({ success: true, message: 'Booking created successfully', data: booking });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  getUserBookings: (req, res) => {
    try {
      const bookings = userService.getUserBookings('usr_deepika', req.query.status);
      res.json({ success: true, message: 'User bookings retrieved', data: bookings });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  getBookingById: (req, res) => {
    try {
      const booking = userService.getBookingById(req.params.id);
      if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
      res.json({ success: true, message: 'Booking details retrieved', data: booking });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  cancelBooking: (req, res) => {
    try {
      const cancelled = userService.cancelBooking(req.params.id, 'usr_deepika');
      res.json({ success: true, message: 'Booking cancelled successfully', data: cancelled });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  // Favorites
  getFavorites: (req, res) => {
    try {
      const favorites = userService.getUserFavorites('usr_deepika');
      res.json({ success: true, message: 'Favorites retrieved', data: favorites });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  addFavorite: (req, res) => {
    try {
      const { facilityId } = req.body;
      userService.addFavorite(facilityId);
      res.json({ success: true, message: 'Facility added to favorites' });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  removeFavorite: (req, res) => {
    try {
      userService.removeFavorite(req.params.facilityId);
      res.json({ success: true, message: 'Facility removed from favorites' });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  // Matches
  getMatches: (req, res) => {
    try {
      const matches = userService.getMatches(req.query);
      res.json({ success: true, message: 'Matches retrieved', data: matches });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  createMatch: (req, res) => {
    try {
      const match = userService.createMatch(req.body);
      res.status(201).json({ success: true, message: 'Match created successfully', data: match });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  joinMatch: (req, res) => {
    try {
      const match = userService.joinMatch(req.params.id, 'usr_deepika');
      res.json({ success: true, message: 'Joined match successfully', data: match });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  getUserMatches: (req, res) => {
    try {
      const matches = userService.getUserMatches('usr_deepika');
      res.json({ success: true, message: 'User matches retrieved', data: matches });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Reviews
  getFacilityReviews: (req, res) => {
    try {
      const reviews = userService.getFacilityReviews(req.params.id);
      res.json({ success: true, message: 'Facility reviews retrieved', data: reviews });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  addReview: (req, res) => {
    try {
      const review = userService.addReview(req.body);
      res.status(201).json({ success: true, message: 'Review added successfully', data: review });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  // Notifications
  getNotifications: (req, res) => {
    try {
      const notifications = userService.getUserNotifications('usr_deepika');
      res.json({ success: true, message: 'Notifications retrieved', data: notifications });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  markNotificationRead: (req, res) => {
    try {
      const updated = userService.markNotificationRead(req.params.id);
      res.json({ success: true, message: 'Notification marked as read', data: updated });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  // Analytics
  getAnalytics: (req, res) => {
    try {
      const analytics = userService.getUserAnalytics('usr_deepika');
      res.json({ success: true, message: 'User analytics retrieved', data: analytics });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Profile
  getProfile: (req, res) => {
    try {
      const profile = userService.getUserProfile('usr_deepika');
      res.json({ success: true, message: 'User profile retrieved', data: profile });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  updateProfile: (req, res) => {
    try {
      const updated = userService.updateUserProfile('usr_deepika', req.body);
      res.json({ success: true, message: 'Profile updated successfully', data: updated });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  // Payments
  getPayments: (req, res) => {
    try {
      const payments = userService.getUserPayments('usr_deepika');
      res.json({ success: true, message: 'Payment history retrieved', data: payments });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};

module.exports = userController;
