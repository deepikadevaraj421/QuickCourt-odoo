const db = require('../../../core/database/db');

class UserService {
  // 1. Facilities
  getFacilities(filters = {}) {
    let list = db.facilities;

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(f =>
        f.name.toLowerCase().includes(q) ||
        f.location.toLowerCase().includes(q) ||
        f.city.toLowerCase().includes(q)
      );
    }

    if (filters.location && filters.location !== 'ALL') {
      const loc = filters.location.toLowerCase();
      list = list.filter(f => f.location.toLowerCase().includes(loc) || f.city.toLowerCase().includes(loc));
    }

    if (filters.sport && filters.sport !== 'All Sports' && filters.sport !== 'ALL') {
      list = list.filter(f => f.sports.includes(filters.sport));
    }

    if (filters.minPrice) {
      list = list.filter(f => f.startingPrice >= Number(filters.minPrice));
    }

    if (filters.maxPrice) {
      list = list.filter(f => f.startingPrice <= Number(filters.maxPrice));
    }

    if (filters.minRating) {
      list = list.filter(f => f.rating >= Number(filters.minRating));
    }

    // Attach isFavorite flag for the current user
    return list.map(f => ({
      ...f,
      isFavorite: db.favorites.has(f.id)
    }));
  }

  getFacilityById(id) {
    const facility = db.facilities.find(f => f.id === id);
    if (!facility) return null;
    return {
      ...facility,
      isFavorite: db.favorites.has(facility.id)
    };
  }

  getCourtsByFacilityId(facilityId) {
    const facility = db.facilities.find(f => f.id === facilityId);
    return facility ? facility.courts : [];
  }

  getCourtAvailability(courtId, date) {
    const defaultSlots = [
      '6:00 AM - 7:00 AM',
      '7:00 AM - 8:00 AM',
      '8:00 AM - 9:00 AM',
      '4:00 PM - 5:00 PM',
      '5:00 PM - 6:00 PM',
      '6:00 PM - 7:00 PM',
      '7:00 PM - 8:00 PM',
      '8:00 PM - 9:00 PM',
      '9:00 PM - 10:00 PM'
    ];

    // Find existing confirmed bookings for this court & date
    const bookedSlots = db.bookings
      .filter(b => b.courtId === courtId && b.date === date && b.status !== 'Cancelled')
      .map(b => b.timeSlot);

    return defaultSlots.map(slot => ({
      timeSlot: slot,
      isAvailable: !bookedSlots.includes(slot)
    }));
  }

  // 2. Bookings
  createBooking({ userId = 'usr_deepika', facilityId, courtId, date, timeSlot }) {
    const facility = db.facilities.find(f => f.id === facilityId);
    if (!facility) throw new Error('Facility not found');

    const court = facility.courts.find(c => c.id === courtId);
    if (!court) throw new Error('Court not found');

    // Check if slot is already booked
    const existing = db.bookings.find(
      b => b.courtId === courtId && b.date === date && b.timeSlot === timeSlot && b.status !== 'Cancelled'
    );
    if (existing) throw new Error('Selected time slot is no longer available');

    const newBooking = {
      id: `bk_${Date.now()}`,
      userId,
      facilityId,
      facilityName: facility.name,
      facilityImage: facility.image,
      courtId,
      courtName: court.name,
      sport: court.sport,
      date,
      timeSlot,
      price: court.pricePerHour,
      status: 'Confirmed',
      paymentStatus: 'PAID',
      createdAt: new Date().toISOString()
    };

    db.bookings.unshift(newBooking);

    // Create notification
    db.notifications.unshift({
      id: `notif_${Date.now()}`,
      userId,
      title: 'Booking Confirmed! 🎾',
      message: `Your slot at ${facility.name} (${court.name}) on ${date} (${timeSlot}) has been booked.`,
      type: 'BOOKING',
      isRead: false,
      createdAt: 'Just now'
    });

    return newBooking;
  }

  getUserBookings(userId = 'usr_deepika', statusFilter) {
    let userBookings = db.bookings.filter(b => b.userId === userId);
    if (statusFilter && statusFilter !== 'ALL') {
      userBookings = userBookings.filter(b => b.status.toLowerCase() === statusFilter.toLowerCase());
    }
    return userBookings;
  }

  getBookingById(id) {
    return db.bookings.find(b => b.id === id) || null;
  }

  cancelBooking(id, userId = 'usr_deepika') {
    const booking = db.bookings.find(b => b.id === id && b.userId === userId);
    if (!booking) throw new Error('Booking not found');
    if (booking.status === 'Cancelled') throw new Error('Booking is already cancelled');

    booking.status = 'Cancelled';

    db.notifications.unshift({
      id: `notif_${Date.now()}`,
      userId,
      title: 'Booking Cancelled',
      message: `Your booking for ${booking.facilityName} on ${booking.date} was cancelled.`,
      type: 'BOOKING',
      isRead: false,
      createdAt: 'Just now'
    });

    return booking;
  }

  // 3. Favorites
  getUserFavorites(userId = 'usr_deepika') {
    const favoriteIds = Array.from(db.favorites);
    return db.facilities.filter(f => favoriteIds.includes(f.id)).map(f => ({ ...f, isFavorite: true }));
  }

  addFavorite(facilityId) {
    db.favorites.add(facilityId);
    return true;
  }

  removeFavorite(facilityId) {
    db.favorites.delete(facilityId);
    return true;
  }

  // 4. Matches
  getMatches(filters = {}) {
    let list = db.matches;

    if (filters.sport && filters.sport !== 'ALL' && filters.sport !== 'All Sports') {
      list = list.filter(m => m.sport.toLowerCase() === filters.sport.toLowerCase());
    }

    if (filters.location && filters.location !== 'ALL') {
      const loc = filters.location.toLowerCase();
      list = list.filter(m => m.location.toLowerCase().includes(loc) || m.facilityName.toLowerCase().includes(loc));
    }

    if (filters.date) {
      list = list.filter(m => m.date === filters.date);
    }

    if (filters.skillLevel && filters.skillLevel !== 'ALL' && filters.skillLevel !== 'All Skills') {
      list = list.filter(m => m.skillLevel === filters.skillLevel);
    }

    return list;
  }

  createMatch(matchData) {
    const newMatch = {
      id: `mt_${Date.now()}`,
      title: matchData.title,
      facilityId: matchData.facilityId || 'fac_1',
      facilityName: matchData.facilityName || 'PlayZone Arena',
      location: matchData.location || 'Anna Nagar, Chennai',
      sport: matchData.sport || 'Badminton',
      date: matchData.date,
      time: matchData.time,
      skillLevel: matchData.skillLevel || 'Intermediate',
      creatorId: matchData.userId || 'usr_deepika',
      creatorName: matchData.userName || db.profile.name,
      requiredPlayers: Number(matchData.requiredPlayers) || 4,
      currentPlayers: 1,
      status: 'OPEN',
      isRecommended: true,
      joinedUsers: [matchData.userId || 'usr_deepika']
    };

    db.matches.unshift(newMatch);
    return newMatch;
  }

  joinMatch(matchId, userId = 'usr_deepika') {
    const match = db.matches.find(m => m.id === matchId);
    if (!match) throw new Error('Match not found');
    if (match.joinedUsers.includes(userId)) throw new Error('You have already joined this match');
    if (match.currentPlayers >= match.requiredPlayers) throw new Error('Match is already full');

    match.joinedUsers.push(userId);
    match.currentPlayers += 1;
    if (match.currentPlayers === match.requiredPlayers) {
      match.status = 'FULL';
    }

    return match;
  }

  getUserMatches(userId = 'usr_deepika') {
    return db.matches.filter(m => m.joinedUsers.includes(userId));
  }

  // 5. Reviews
  getFacilityReviews(facilityId) {
    return db.reviews.filter(r => r.facilityId === facilityId);
  }

  addReview({ facilityId, userId = 'usr_deepika', rating, comment }) {
    const facility = db.facilities.find(f => f.id === facilityId);
    if (!facility) throw new Error('Facility not found');

    const newReview = {
      id: `rev_${Date.now()}`,
      facilityId,
      userId,
      userName: db.profile.name,
      rating: Number(rating),
      comment,
      createdAt: new Date().toISOString().split('T')[0]
    };

    db.reviews.unshift(newReview);
    return newReview;
  }

  // 6. Notifications
  getUserNotifications(userId = 'usr_deepika') {
    return db.notifications.filter(n => n.userId === userId);
  }

  markNotificationRead(notificationId) {
    const notif = db.notifications.find(n => n.id === notificationId);
    if (notif) notif.isRead = true;
    return notif;
  }

  // 7. User Analytics
  getUserAnalytics(userId = 'usr_deepika') {
    const userBookings = db.bookings.filter(b => b.userId === userId);

    const sportCounts = {};
    userBookings.forEach(b => {
      sportCounts[b.sport] = (sportCounts[b.sport] || 0) + 1;
    });

    const sportDistribution = Object.keys(sportCounts).map(sport => ({
      sport,
      count: sportCounts[sport]
    }));

    return {
      totalBookings: userBookings.length,
      upcomingCount: userBookings.filter(b => b.status === 'Confirmed').length,
      completedCount: userBookings.filter(b => b.status === 'Completed').length,
      cancelledCount: userBookings.filter(b => b.status === 'Cancelled').length,
      sportDistribution,
      totalSpent: userBookings.filter(b => b.status !== 'Cancelled').reduce((sum, b) => sum + b.price, 0)
    };
  }

  // 8. Profile
  getUserProfile(userId = 'usr_deepika') {
    return db.profile;
  }

  updateUserProfile(userId = 'usr_deepika', data) {
    db.profile = {
      ...db.profile,
      ...data
    };
    return db.profile;
  }

  // 9. Payments
  getUserPayments(userId = 'usr_deepika') {
    return db.bookings
      .filter(b => b.userId === userId)
      .map(b => ({
        id: `tx_${b.id}`,
        bookingId: b.id,
        facilityName: b.facilityName,
        courtName: b.courtName,
        amount: b.price,
        date: b.date,
        status: b.paymentStatus,
        method: 'UPI / Credit Card'
      }));
  }
}

module.exports = new UserService();
