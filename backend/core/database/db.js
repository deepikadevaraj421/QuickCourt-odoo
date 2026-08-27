// QuickCourt Database Store for User Module
// Seeded with initial realistic facility & sports data for API operations

const initialFacilities = [
  {
    id: 'fac_1',
    name: 'PlayZone Arena',
    verified: true,
    location: 'Anna Nagar, Chennai',
    city: 'Chennai',
    distance: '2.5 km',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
    sports: ['Badminton', 'Tennis'],
    amenities: ['Parking', 'AC', 'Locker Room', 'Pro Shop', 'Cafe'],
    rating: 4.6,
    reviewsCount: 128,
    operatingHours: 'Available Today 6:00 AM - 11:00 PM',
    startingPrice: 300,
    discountPercentage: 20,
    description: 'Premier indoor badminton & tennis facility with BWF certified wooden courts, high-grade AC, and professional lighting.',
    courts: [
      { id: 'crt_1', name: 'Badminton Court 1', sport: 'Badminton', pricePerHour: 300, type: 'Wooden' },
      { id: 'crt_2', name: 'Badminton Court 2', sport: 'Badminton', pricePerHour: 300, type: 'Synthetic' },
      { id: 'crt_3', name: 'Tennis Court A', sport: 'Tennis', pricePerHour: 500, type: 'Hard Court' }
    ]
  },
  {
    id: 'fac_2',
    name: 'Champion Turf',
    verified: true,
    location: 'Velachery, Chennai',
    city: 'Chennai',
    distance: '4.1 km',
    image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=800&q=80',
    sports: ['Football', 'Cricket'],
    amenities: ['Changing Room', 'Parking', 'Cafe', 'Night Floodlights'],
    rating: 4.4,
    reviewsCount: 96,
    operatingHours: 'Available Today 5:00 AM - 11:00 PM',
    startingPrice: 1200,
    discountPercentage: 15,
    description: 'FIFA-approved multi-sport 5v5 turf with high-density synthetic grass and 360-degree LED floodlights.',
    courts: [
      { id: 'crt_4', name: 'Main 5v5 Turf', sport: 'Football', pricePerHour: 1200, type: 'Turf' },
      { id: 'crt_5', name: 'Box Cricket Pitch 1', sport: 'Cricket', pricePerHour: 1000, type: 'Indoor Pitch' }
    ]
  },
  {
    id: 'fac_3',
    name: 'Ace Tennis Club',
    verified: true,
    location: 'Nungambakkam, Chennai',
    city: 'Chennai',
    distance: '3.2 km',
    image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=800&q=80',
    sports: ['Tennis', 'Table Tennis'],
    amenities: ['Coaching', 'Parking', 'Showers', 'Equipment Rental'],
    rating: 4.5,
    reviewsCount: 74,
    operatingHours: 'Available Today 6:00 AM - 10:00 PM',
    startingPrice: 500,
    discountPercentage: 10,
    description: 'Clay and hard surface tennis courts with professional coaching programs and tournament hosting capacity.',
    courts: [
      { id: 'crt_6', name: 'Center Clay Court', sport: 'Tennis', pricePerHour: 500, type: 'Clay' },
      { id: 'crt_7', name: 'Table Tennis Arena', sport: 'Table Tennis', pricePerHour: 200, type: 'Indoor' }
    ]
  },
  {
    id: 'fac_4',
    name: 'SlamNation Basketball Hub',
    verified: true,
    location: 'Adyar, Chennai',
    city: 'Chennai',
    distance: '5.0 km',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
    sports: ['Basketball'],
    amenities: ['FIBA Hardwood', 'Scoreboard', 'Bleachers', 'Air Conditioned'],
    rating: 4.8,
    reviewsCount: 112,
    operatingHours: 'Available Today 7:00 AM - 10:00 PM',
    startingPrice: 800,
    discountPercentage: 0,
    description: 'FIBA standard wooden basketball court with electronic scoreboard, air conditioning, and spectator seating.',
    courts: [
      { id: 'crt_8', name: 'Hardwood Court 1', sport: 'Basketball', pricePerHour: 800, type: 'Wood' }
    ]
  }
];

const initialBookings = [
  {
    id: 'bk_1001',
    userId: 'usr_deepika',
    facilityId: 'fac_1',
    facilityName: 'PlayZone Arena',
    facilityImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
    courtId: 'crt_2',
    courtName: 'Badminton Court 2',
    sport: 'Badminton',
    date: '2026-08-28',
    timeSlot: '6:00 PM - 7:00 PM',
    price: 300,
    status: 'Confirmed',
    paymentStatus: 'PAID',
    createdAt: new Date().toISOString()
  }
];

const initialFavorites = ['fac_1', 'fac_2'];

const initialMatches = [
  {
    id: 'mt_1',
    title: 'Weekend 5v5 Football Friendly',
    facilityId: 'fac_2',
    facilityName: 'Champion Turf',
    location: 'Velachery, Chennai',
    sport: 'Football',
    date: '2026-08-29',
    time: '7:00 PM',
    skillLevel: 'Intermediate',
    creatorId: 'usr_alex',
    creatorName: 'Marcus Vance',
    requiredPlayers: 10,
    currentPlayers: 7,
    status: 'OPEN',
    isRecommended: true,
    joinedUsers: ['usr_alex', 'usr_deepika']
  },
  {
    id: 'mt_2',
    title: 'Badminton Intermediate Doubles Sparring',
    facilityId: 'fac_1',
    facilityName: 'PlayZone Arena',
    location: 'Anna Nagar, Chennai',
    sport: 'Badminton',
    date: '2026-08-30',
    time: '6:00 PM',
    skillLevel: 'Intermediate',
    creatorId: 'usr_elena',
    creatorName: 'Elena Rostova',
    requiredPlayers: 4,
    currentPlayers: 3,
    status: 'OPEN',
    isRecommended: true,
    joinedUsers: ['usr_elena']
  },
  {
    id: 'mt_3',
    title: 'Pro Tennis Singles Challenge Match',
    facilityId: 'fac_3',
    facilityName: 'Ace Tennis Club',
    location: 'Nungambakkam, Chennai',
    sport: 'Tennis',
    date: '2026-08-31',
    time: '5:00 PM',
    skillLevel: 'Advanced',
    creatorId: 'usr_sarah',
    creatorName: 'Sarah Jenkins',
    requiredPlayers: 2,
    currentPlayers: 1,
    status: 'OPEN',
    isRecommended: true,
    joinedUsers: ['usr_sarah']
  },
  {
    id: 'mt_4',
    title: 'Casual 3v3 Basketball Pickup Game',
    facilityId: 'fac_4',
    facilityName: 'SlamNation Basketball Hub',
    location: 'Adyar, Chennai',
    sport: 'Basketball',
    date: '2026-09-01',
    time: '6:30 PM',
    skillLevel: 'All Skills',
    creatorId: 'usr_david',
    creatorName: 'David Miller',
    requiredPlayers: 6,
    currentPlayers: 4,
    status: 'OPEN',
    isRecommended: false,
    joinedUsers: ['usr_david']
  }
];

const initialReviews = [
  {
    id: 'rev_1',
    facilityId: 'fac_1',
    userId: 'usr_deepika',
    userName: 'Deepika R',
    rating: 5,
    comment: 'Exceptional wooden court quality! Clean lockers and excellent lighting.',
    createdAt: '2026-08-20'
  }
];

const initialNotifications = [
  {
    id: 'notif_1',
    userId: 'usr_deepika',
    title: 'Booking Confirmed! 🎾',
    message: 'Your slot at PlayZone Arena (Badminton Court 2) for 28 Aug 6:00 PM is confirmed.',
    type: 'BOOKING',
    isRead: false,
    createdAt: '2026-08-27 10:00 AM'
  },
  {
    id: 'notif_2',
    userId: 'usr_deepika',
    title: 'Match Reminder ⚽',
    message: 'You joined Weekend 5v5 Football Friendly scheduled for 29 Aug at Champion Turf.',
    type: 'MATCH',
    isRead: true,
    createdAt: '2026-08-26 04:30 PM'
  }
];

const initialProfile = {
  id: 'usr_deepika',
  name: 'Deepika R',
  email: 'deepika@quickcourt.com',
  phone: '+91 98765 43210',
  location: 'Chennai, India',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  favoriteSports: ['Badminton', 'Football', 'Tennis'],
  skillLevel: 'Intermediate',
  bio: 'Sports enthusiast & badminton player looking for match partners!'
};

class DatabaseStore {
  constructor() {
    this.facilities = [...initialFacilities];
    this.bookings = [...initialBookings];
    this.favorites = new Set(initialFavorites);
    this.matches = [...initialMatches];
    this.reviews = [...initialReviews];
    this.notifications = [...initialNotifications];
    this.profile = { ...initialProfile };
  }
}

const db = new DatabaseStore();
module.exports = db;
