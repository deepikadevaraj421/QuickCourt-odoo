const ownerService = require('../services/ownerService');

const sendJson = (res, statusCode, payload) => res.status(statusCode).json(payload);

const ownerController = {
    getDashboardSummary: (req, res) => {
        try {
            const data = ownerService.getDashboardSummary(req);
            sendJson(res, 200, { success: true, message: 'Dashboard summary retrieved', data });
        } catch (err) {
            sendJson(res, 500, { success: false, message: err.message });
        }
    },

    getDashboardSchedule: (req, res) => {
        try {
            const data = ownerService.getDashboardSchedule(req);
            sendJson(res, 200, { success: true, message: 'Today schedule retrieved', data });
        } catch (err) {
            sendJson(res, 500, { success: false, message: err.message });
        }
    },

    getFacilities: (req, res) => {
        try {
            const data = ownerService.getFacilities(req);
            sendJson(res, 200, { success: true, message: 'Facilities retrieved', data });
        } catch (err) {
            sendJson(res, 500, { success: false, message: err.message });
        }
    },

    createFacility: (req, res) => {
        try {
            const data = ownerService.createFacility(req);
            sendJson(res, 201, { success: true, message: 'Facility created', data });
        } catch (err) {
            sendJson(res, 400, { success: false, message: err.message });
        }
    },

    updateFacility: (req, res) => {
        try {
            const data = ownerService.updateFacility(req);
            sendJson(res, 200, { success: true, message: 'Facility updated', data });
        } catch (err) {
            sendJson(res, 400, { success: false, message: err.message });
        }
    },

    getCourts: (req, res) => {
        try {
            const data = ownerService.getCourts(req);
            sendJson(res, 200, { success: true, message: 'Courts retrieved', data });
        } catch (err) {
            sendJson(res, 500, { success: false, message: err.message });
        }
    },

    createCourt: (req, res) => {
        try {
            const data = ownerService.createCourt(req);
            sendJson(res, 201, { success: true, message: 'Court created', data });
        } catch (err) {
            sendJson(res, 400, { success: false, message: err.message });
        }
    },

    updateCourt: (req, res) => {
        try {
            const data = ownerService.updateCourt(req);
            sendJson(res, 200, { success: true, message: 'Court updated', data });
        } catch (err) {
            sendJson(res, 400, { success: false, message: err.message });
        }
    },

    deleteCourt: (req, res) => {
        try {
            const data = ownerService.deleteCourt(req);
            sendJson(res, 200, { success: true, message: 'Court deleted', data });
        } catch (err) {
            sendJson(res, 400, { success: false, message: err.message });
        }
    },

    getAvailability: (req, res) => {
        try {
            const data = ownerService.getAvailability(req);
            sendJson(res, 200, { success: true, message: 'Availability retrieved', data });
        } catch (err) {
            sendJson(res, 500, { success: false, message: err.message });
        }
    },

    blockAvailability: (req, res) => {
        try {
            const data = ownerService.blockAvailability(req);
            sendJson(res, 201, { success: true, message: 'Maintenance block created', data });
        } catch (err) {
            sendJson(res, 400, { success: false, message: err.message });
        }
    },

    unblockAvailability: (req, res) => {
        try {
            const data = ownerService.unblockAvailability(req);
            sendJson(res, 200, { success: true, message: 'Maintenance block removed', data });
        } catch (err) {
            sendJson(res, 400, { success: false, message: err.message });
        }
    },

    getBookings: (req, res) => {
        try {
            const data = ownerService.getBookings(req);
            sendJson(res, 200, { success: true, message: 'Bookings retrieved', data });
        } catch (err) {
            sendJson(res, 500, { success: false, message: err.message });
        }
    },

    getEarningsSummary: (req, res) => {
        try {
            const data = ownerService.getEarningsSummary(req);
            sendJson(res, 200, { success: true, message: 'Earnings summary retrieved', data });
        } catch (err) {
            sendJson(res, 500, { success: false, message: err.message });
        }
    },

    getReviews: (req, res) => {
        try {
            const data = ownerService.getReviews(req);
            sendJson(res, 200, { success: true, message: 'Reviews retrieved', data });
        } catch (err) {
            sendJson(res, 500, { success: false, message: err.message });
        }
    },

    getNotifications: (req, res) => {
        try {
            const data = ownerService.getNotifications(req);
            sendJson(res, 200, { success: true, message: 'Notifications retrieved', data });
        } catch (err) {
            sendJson(res, 500, { success: false, message: err.message });
        }
    },

    markNotificationRead: (req, res) => {
        try {
            const data = ownerService.markNotificationRead(req);
            sendJson(res, 200, { success: true, message: 'Notification marked as read', data });
        } catch (err) {
            sendJson(res, 400, { success: false, message: err.message });
        }
    },

    getAnalytics: (req, res) => {
        try {
            const data = ownerService.getAnalytics(req);
            sendJson(res, 200, { success: true, message: 'Analytics retrieved', data });
        } catch (err) {
            sendJson(res, 500, { success: false, message: err.message });
        }
    },

    getProfile: (req, res) => {
        try {
            const data = ownerService.getProfile(req);
            sendJson(res, 200, { success: true, message: 'Owner profile retrieved', data });
        } catch (err) {
            sendJson(res, 500, { success: false, message: err.message });
        }
    },

    updateProfile: (req, res) => {
        try {
            const data = ownerService.updateProfile(req);
            sendJson(res, 200, { success: true, message: 'Owner profile updated', data });
        } catch (err) {
            sendJson(res, 400, { success: false, message: err.message });
        }
    }
};

module.exports = ownerController;
