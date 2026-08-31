const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/ownerController');

router.get('/dashboard/summary', ownerController.getDashboardSummary);
router.get('/dashboard/schedule', ownerController.getDashboardSchedule);

router.get('/facilities', ownerController.getFacilities);
router.post('/facilities', ownerController.createFacility);
router.put('/facilities/:id', ownerController.updateFacility);

router.get('/courts', ownerController.getCourts);
router.post('/courts', ownerController.createCourt);
router.put('/courts/:facilityId/:id', ownerController.updateCourt);
router.delete('/courts/:facilityId/:id', ownerController.deleteCourt);

router.get('/availability', ownerController.getAvailability);
router.post('/availability/block', ownerController.blockAvailability);
router.delete('/availability/block/:id', ownerController.unblockAvailability);

router.get('/bookings', ownerController.getBookings);

router.get('/earnings/summary', ownerController.getEarningsSummary);

router.get('/reviews', ownerController.getReviews);

router.get('/notifications', ownerController.getNotifications);
router.patch('/notifications/:id/read', ownerController.markNotificationRead);

router.get('/analytics', ownerController.getAnalytics);

router.get('/profile', ownerController.getProfile);
router.put('/profile', ownerController.updateProfile);

module.exports = router;
