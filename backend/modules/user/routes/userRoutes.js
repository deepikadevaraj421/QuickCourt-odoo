const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Facility routes
router.get('/facilities', userController.getFacilities);
router.get('/facilities/:id', userController.getFacilityById);
router.get('/facilities/:id/courts', userController.getCourtsByFacilityId);
router.get('/facilities/:id/reviews', userController.getFacilityReviews);
router.get('/courts/:id/slots', userController.getCourtAvailability);

// Booking routes
router.post('/bookings', userController.createBooking);
router.get('/bookings', userController.getUserBookings);
router.get('/bookings/:id', userController.getBookingById);
router.patch('/bookings/:id/cancel', userController.cancelBooking);

// Favorites routes
router.get('/favorites', userController.getFavorites);
router.post('/favorites', userController.addFavorite);
router.delete('/favorites/:facilityId', userController.removeFavorite);

// Match Hub routes
router.get('/matches', userController.getMatches);
router.post('/matches', userController.createMatch);
router.post('/matches/:id/join', userController.joinMatch);
router.get('/matches/my-matches', userController.getUserMatches);

// Reviews routes
router.post('/reviews', userController.addReview);

// Notifications routes
router.get('/notifications', userController.getNotifications);
router.patch('/notifications/:id/read', userController.markNotificationRead);

// Analytics, Profile, Payments
router.get('/analytics', userController.getAnalytics);
router.get('/profile', userController.getProfile);
router.patch('/profile', userController.updateProfile);
router.get('/payments', userController.getPayments);

module.exports = router;
