const db = require('../../../core/database/db');

const DEFAULT_OWNER_ID = 'owner_lina';
const defaultSlots = [
    '6:00 AM - 7:00 AM',
    '7:00 AM - 8:00 AM',
    '8:00 AM - 9:00 AM',
    '9:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '12:00 PM - 1:00 PM',
    '1:00 PM - 2:00 PM',
    '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM',
    '4:00 PM - 5:00 PM',
    '5:00 PM - 6:00 PM',
    '6:00 PM - 7:00 PM',
    '7:00 PM - 8:00 PM',
    '8:00 PM - 9:00 PM',
    '9:00 PM - 10:00 PM'
];

class OwnerService {
    resolveOwnerId(req = {}) {
        const candidate = req.user?.id || req.user?.userId || req.headers?.['x-owner-id'] || req.headers?.['x-user-id'] || DEFAULT_OWNER_ID;
        return candidate || DEFAULT_OWNER_ID;
    }

    getOwnerFacilities(ownerId = DEFAULT_OWNER_ID) {
        return db.facilities.filter(facility => !facility.ownerId || facility.ownerId === ownerId);
    }

    getOwnerFacilityIds(ownerId = DEFAULT_OWNER_ID) {
        return new Set(this.getOwnerFacilities(ownerId).map(facility => facility.id));
    }

    getDashboardSummary(req) {
        const ownerId = this.resolveOwnerId(req);
        const facilities = this.getOwnerFacilities(ownerId);
        const facilityIds = this.getOwnerFacilityIds(ownerId);
        const ownerBookings = db.bookings.filter(booking => facilityIds.has(booking.facilityId));
        const ownerReviews = db.reviews.filter(review => facilityIds.has(review.facilityId));

        const totalBookings = ownerBookings.length;
        const totalEarnings = ownerBookings
            .filter(booking => booking.status !== 'Cancelled')
            .reduce((sum, booking) => sum + Number(booking.price || 0), 0);
        const activeCourts = facilities.reduce((count, facility) => {
            return count + (facility.courts || []).filter(court => court.isActive !== false).length;
        }, 0);
        const averageRating = ownerReviews.length
            ? ownerReviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / ownerReviews.length
            : 0;

        return {
            ownerId,
            totalFacilities: facilities.length,
            totalBookings,
            activeCourts,
            totalEarnings,
            averageRating,
            revenueTrend: this.getRevenueTrend(ownerId),
            recentBookings: ownerBookings.slice(0, 5)
        };
    }

    getDashboardSchedule(req) {
        const ownerId = this.resolveOwnerId(req);
        const facilityIds = this.getOwnerFacilityIds(ownerId);
        const bookings = db.bookings
            .filter(booking => facilityIds.has(booking.facilityId))
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        return bookings.slice(0, 6).map(booking => ({
            id: booking.id,
            time: booking.timeSlot || 'Flexible slot',
            court: booking.courtName || 'Court',
            customer: booking.userName || 'Customer',
            status: booking.status || 'Confirmed',
            facility: booking.facilityName || 'Facility',
            date: booking.date
        }));
    }

    getFacilities(req) {
        const ownerId = this.resolveOwnerId(req);
        return this.getOwnerFacilities(ownerId).map(facility => ({
            ...facility,
            reviewsCount: db.reviews.filter(review => review.facilityId === facility.id).length,
            status: facility.status || 'Approved'
        }));
    }

    createFacility(req) {
        const ownerId = this.resolveOwnerId(req);
        const { name, location, description, city, sports, amenities, image, status } = req.body || {};

        if (!name || !location) {
            throw new Error('Facility name and location are required');
        }

        const newFacility = {
            id: `fac_${Date.now()}`,
            ownerId,
            name,
            location,
            city: city || location,
            description: description || '',
            sports: sports || ['Badminton'],
            amenities: amenities || ['Parking'],
            image: image || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
            rating: 0,
            reviewsCount: 0,
            verified: true,
            status: status || 'Pending Approval',
            courts: [],
            startingPrice: 0,
            operatingHours: 'Flexible hours'
        };

        db.facilities.unshift(newFacility);
        return newFacility;
    }

    updateFacility(req) {
        const ownerId = this.resolveOwnerId(req);
        const facility = this.getOwnerFacilities(ownerId).find(item => item.id === req.params.id);
        if (!facility) throw new Error('Facility not found');

        Object.assign(facility, req.body || {});
        return facility;
    }

    getCourts(req) {
        const ownerId = this.resolveOwnerId(req);
        return this.getOwnerFacilities(ownerId).flatMap(facility =>
            (facility.courts || []).map(court => ({
                ...court,
                facilityId: facility.id,
                facilityName: facility.name,
                facilityStatus: facility.status || 'Approved'
            }))
        );
    }

    createCourt(req) {
        const ownerId = this.resolveOwnerId(req);
        const { facilityId, name, sport, pricePerHour, type, isActive } = req.body || {};
        if (!facilityId || !name || !sport) throw new Error('Facility, name and sport are required');

        const facility = this.getOwnerFacilities(ownerId).find(item => item.id === facilityId);
        if (!facility) throw new Error('Facility not found');

        const newCourt = {
            id: `crt_${Date.now()}`,
            name,
            sport,
            pricePerHour: Number(pricePerHour || 0),
            type: type || 'Standard',
            isActive: isActive !== false,
            operatingHours: '6:00 AM - 10:00 PM'
        };

        facility.courts = facility.courts || [];
        facility.courts.push(newCourt);
        return newCourt;
    }

    updateCourt(req) {
        const ownerId = this.resolveOwnerId(req);
        const facility = this.getOwnerFacilities(ownerId).find(item => item.id === req.params.facilityId);
        if (!facility) throw new Error('Facility not found');

        const courtIndex = (facility.courts || []).findIndex(court => court.id === req.params.id);
        if (courtIndex < 0) throw new Error('Court not found');

        const updated = { ...(facility.courts[courtIndex]), ...(req.body || {}) };
        facility.courts[courtIndex] = updated;
        return updated;
    }

    deleteCourt(req) {
        const ownerId = this.resolveOwnerId(req);
        const facility = this.getOwnerFacilities(ownerId).find(item => item.id === req.params.facilityId);
        if (!facility) throw new Error('Facility not found');

        const court = (facility.courts || []).find(item => item.id === req.params.id);
        if (!court) throw new Error('Court not found');

        const hasBookings = db.bookings.some(booking => booking.courtId === req.params.id && booking.status !== 'Cancelled');
        if (hasBookings) throw new Error('Cannot delete a court with active bookings');

        facility.courts = (facility.courts || []).filter(item => item.id !== req.params.id);
        return { success: true };
    }

    getAvailability(req) {
        const ownerId = this.resolveOwnerId(req);
        const date = req.query.date || new Date().toISOString().split('T')[0];
        const facilityId = req.query.facilityId;
        const facilities = this.getOwnerFacilities(ownerId);
        const relevantFacilities = facilityId ? facilities.filter(f => f.id === facilityId) : facilities;

        const response = relevantFacilities.flatMap(facility =>
            (facility.courts || []).map(court => {
                const bookedSlots = db.bookings
                    .filter(booking => booking.courtId === court.id && booking.date === date && booking.status !== 'Cancelled')
                    .map(booking => booking.timeSlot);

                const maintenanceSlots = (db.maintenanceBlocks || [])
                    .filter(block => block.courtId === court.id && block.date === date)
                    .map(block => block.timeSlot);

                return {
                    facilityId: facility.id,
                    facilityName: facility.name,
                    courtId: court.id,
                    courtName: court.name,
                    slots: defaultSlots.map(slot => ({
                        timeSlot: slot,
                        status: bookedSlots.includes(slot) ? 'Booked' : maintenanceSlots.includes(slot) ? 'Maintenance' : 'Available'
                    }))
                };
            })
        );

        return response;
    }

    blockAvailability(req) {
        const ownerId = this.resolveOwnerId(req);
        const { facilityId, courtId, date, timeSlot, reason } = req.body || {};
        if (!facilityId || !courtId || !date || !timeSlot) throw new Error('facilityId, courtId, date and timeSlot are required');

        const facility = this.getOwnerFacilities(ownerId).find(item => item.id === facilityId);
        if (!facility) throw new Error('Facility not found');

        const court = (facility.courts || []).find(item => item.id === courtId);
        if (!court) throw new Error('Court not found');

        const block = {
            id: `block_${Date.now()}`,
            ownerId,
            facilityId,
            courtId,
            date,
            timeSlot,
            reason: reason || 'Maintenance',
            createdAt: new Date().toISOString()
        };

        db.maintenanceBlocks = db.maintenanceBlocks || [];
        db.maintenanceBlocks.push(block);
        return block;
    }

    unblockAvailability(req) {
        const ownerId = this.resolveOwnerId(req);
        db.maintenanceBlocks = db.maintenanceBlocks || [];
        const block = db.maintenanceBlocks.find(item => item.id === req.params.id && item.ownerId === ownerId);
        if (!block) throw new Error('Maintenance block not found');

        db.maintenanceBlocks = db.maintenanceBlocks.filter(item => item.id !== req.params.id);
        return { success: true, removed: block };
    }

    getBookings(req) {
        const ownerId = this.resolveOwnerId(req);
        const facilityIds = this.getOwnerFacilityIds(ownerId);
        let list = db.bookings.filter(booking => facilityIds.has(booking.facilityId));

        if (req.query.status && req.query.status !== 'ALL') {
            list = list.filter(booking => booking.status?.toLowerCase() === req.query.status.toLowerCase());
        }

        if (req.query.facilityId) {
            list = list.filter(booking => booking.facilityId === req.query.facilityId);
        }

        if (req.query.courtId) {
            list = list.filter(booking => booking.courtId === req.query.courtId);
        }

        if (req.query.search) {
            const searchText = String(req.query.search).toLowerCase();
            list = list.filter(booking =>
                booking.userId?.toLowerCase().includes(searchText) ||
                booking.facilityName?.toLowerCase().includes(searchText) ||
                booking.courtName?.toLowerCase().includes(searchText)
            );
        }

        return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    getEarningsSummary(req) {
        const ownerId = this.resolveOwnerId(req);
        const facilityIds = this.getOwnerFacilityIds(ownerId);
        const bookings = db.bookings.filter(booking => facilityIds.has(booking.facilityId) && booking.status !== 'Cancelled');

        const today = new Date();
        const startOfWeek = new Date(today); startOfWeek.setDate(today.getDate() - today.getDay());
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        const isSameDay = date => date.toISOString().slice(0, 10) === today.toISOString().slice(0, 10);
        const isSameWeek = date => date >= startOfWeek && date <= today;
        const isSameMonth = date => date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();

        const totals = {
            today: bookings.filter(booking => {
                const date = new Date(booking.createdAt || booking.date);
                return date && isSameDay(date);
            }).reduce((sum, booking) => sum + Number(booking.price || 0), 0),
            week: bookings.filter(booking => {
                const date = new Date(booking.createdAt || booking.date);
                return date && isSameWeek(date);
            }).reduce((sum, booking) => sum + Number(booking.price || 0), 0),
            month: bookings.filter(booking => {
                const date = new Date(booking.createdAt || booking.date);
                return date && isSameMonth(date);
            }).reduce((sum, booking) => sum + Number(booking.price || 0), 0),
            total: bookings.reduce((sum, booking) => sum + Number(booking.price || 0), 0)
        };

        return {
            summary: totals,
            trend: this.getRevenueTrend(ownerId),
            byFacility: this.getRevenueByFacility(ownerId)
        };
    }

    getRevenueTrend(ownerId = DEFAULT_OWNER_ID) {
        const facilityIds = this.getOwnerFacilityIds(ownerId);
        const bookings = db.bookings.filter(booking => facilityIds.has(booking.facilityId));
        const monthlyMap = new Map();

        bookings.forEach(booking => {
            const date = new Date(booking.createdAt || booking.date);
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            monthlyMap.set(key, (monthlyMap.get(key) || 0) + Number(booking.price || 0));
        });

        return Array.from(monthlyMap.entries()).map(([month, total]) => ({ month, total }));
    }

    getRevenueByFacility(ownerId = DEFAULT_OWNER_ID) {
        const facilityIds = this.getOwnerFacilityIds(ownerId);
        const bookings = db.bookings.filter(booking => facilityIds.has(booking.facilityId) && booking.status !== 'Cancelled');

        const byFacility = new Map();
        bookings.forEach(booking => {
            const facilityName = booking.facilityName || 'Unknown Facility';
            byFacility.set(facilityName, (byFacility.get(facilityName) || 0) + Number(booking.price || 0));
        });

        return Array.from(byFacility.entries()).map(([facility, total]) => ({ facility, total }));
    }

    getReviews(req) {
        const ownerId = this.resolveOwnerId(req);
        const facilityIds = this.getOwnerFacilityIds(ownerId);
        return db.reviews
            .filter(review => facilityIds.has(review.facilityId))
            .map(review => ({
                ...review,
                facilityName: db.facilities.find(facility => facility.id === review.facilityId)?.name || 'Facility'
            }));
    }

    getNotifications(req) {
        const ownerId = this.resolveOwnerId(req);
        const facilityIds = this.getOwnerFacilityIds(ownerId);
        return db.notifications.filter(notification => {
            if (notification.ownerId === ownerId) return true;
            if (notification.facilityId && facilityIds.has(notification.facilityId)) return true;
            if (notification.userId === ownerId) return true;
            return false;
        });
    }

    markNotificationRead(req) {
        const ownerId = this.resolveOwnerId(req);
        const notification = db.notifications.find(item => item.id === req.params.id && (item.ownerId === ownerId || item.userId === ownerId));
        if (!notification) throw new Error('Notification not found');

        notification.isRead = true;
        return notification;
    }

    getAnalytics(req) {
        const ownerId = this.resolveOwnerId(req);
        const facilityIds = this.getOwnerFacilityIds(ownerId);
        const bookings = db.bookings.filter(booking => facilityIds.has(booking.facilityId));
        const reviews = db.reviews.filter(review => facilityIds.has(review.facilityId));
        const totalRevenue = bookings.reduce((sum, booking) => sum + Number(booking.price || 0), 0);
        const cancellationRate = bookings.length ? bookings.filter(booking => booking.status === 'Cancelled').length / bookings.length : 0;
        const popularCourts = this.getPopularCourts(bookings);
        const popularSports = this.getPopularSports(bookings);

        return {
            totalBookings: bookings.length,
            totalRevenue,
            cancellationRate,
            averageRating: reviews.length ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length : 0,
            popularCourts,
            popularSports,
            peakHours: this.getPeakHours(bookings),
            utilization: this.getUtilization(ownerId)
        };
    }

    getPopularCourts(bookings) {
        const map = new Map();
        bookings.forEach(booking => {
            const key = booking.courtName || 'Court';
            map.set(key, (map.get(key) || 0) + 1);
        });
        return Array.from(map.entries()).map(([court, count]) => ({ court, count })).sort((a, b) => b.count - a.count).slice(0, 5);
    }

    getPopularSports(bookings) {
        const map = new Map();
        bookings.forEach(booking => {
            const key = booking.sport || 'General';
            map.set(key, (map.get(key) || 0) + 1);
        });
        return Array.from(map.entries()).map(([sport, count]) => ({ sport, count })).sort((a, b) => b.count - a.count).slice(0, 5);
    }

    getPeakHours(bookings) {
        const map = new Map();
        bookings.forEach(booking => {
            const slot = booking.timeSlot || 'Flexible';
            map.set(slot, (map.get(slot) || 0) + 1);
        });
        return Array.from(map.entries()).map(([slot, count]) => ({ slot, count })).sort((a, b) => b.count - a.count).slice(0, 5);
    }

    getUtilization(ownerId = DEFAULT_OWNER_ID) {
        const facilities = this.getOwnerFacilities(ownerId);
        return facilities.map(facility => ({
            facilityId: facility.id,
            facilityName: facility.name,
            activeCourts: (facility.courts || []).filter(court => court.isActive !== false).length,
            totalCourts: (facility.courts || []).length
        }));
    }

    getProfile(req) {
        const ownerId = this.resolveOwnerId(req);
        return db.ownerProfile ? { ...db.ownerProfile, id: ownerId } : { id: ownerId, name: 'Lina', role: 'Facility Owner' };
    }

    updateProfile(req) {
        const ownerId = this.resolveOwnerId(req);
        const current = this.getProfile(req);
        db.ownerProfile = { ...current, ...(req.body || {}), id: ownerId };
        return db.ownerProfile;
    }
}

module.exports = new OwnerService();
