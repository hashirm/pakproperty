export const PAKISTANI_CITIES = [
  {
    name: 'Islamabad',
    province: 'Federal Capital',
    areas: [
      'DHA Phase 2',
      'Bahria Town Phase 8',
      'Sector F-7',
      'Sector F-10',
      'Sector F-11',
      'Sector G-11',
      'Sector G-13',
      'Sector E-11',
      'Gulberg Greens',
      'Park View City',
      'B-17 Multi Gardens',
    ],
    image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80',
    lat: 33.6844,
    lng: 73.0479,
  },
  {
    name: 'Lahore',
    province: 'Punjab',
    areas: [
      'DHA Phase 5',
      'DHA Phase 6',
      'DHA Phase 7',
      'Gulberg III',
      'Bahria Town',
      'Johar Town',
      'Model Town',
      'Cantt',
      'Lake City',
      'Wapda Town',
      'Askari 11',
    ],
    image: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=800&q=80',
    lat: 31.5204,
    lng: 74.3587,
  },
  {
    name: 'Karachi',
    province: 'Sindh',
    areas: [
      'DHA Phase 5',
      'DHA Phase 6',
      'Clifton Block 2',
      'Clifton Block 4',
      'Bahria Town Karachi',
      'Gulshan-e-Iqbal Block 13',
      'PECHS Block 6',
      'North Nazimabad Block B',
      'Malir Cantt',
      'Askari 4',
    ],
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
    lat: 24.8607,
    lng: 67.0011,
  },
  {
    name: 'Rawalpindi',
    province: 'Punjab',
    areas: [
      'Bahria Town Phase 4',
      'Bahria Town Phase 7',
      'Chaklala Scheme 3',
      'Saddar',
      'Westridge 1',
      'Gulraiz Housing Scheme',
      'Askari 14',
      'Adyala Road',
    ],
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    lat: 33.5651,
    lng: 73.0169,
  },
  {
    name: 'Peshawar',
    province: 'Khyber Pakhtunkhwa',
    areas: [
      'Hayatabad Phase 3',
      'Hayatabad Phase 5',
      'University Town',
      'Regi Model Town',
      'DHA Peshawar',
      'Warsak Road',
    ],
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    lat: 34.0151,
    lng: 71.5249,
  },
  {
    name: 'Faisalabad',
    province: 'Punjab',
    areas: [
      'Madina Town',
      'Peoples Colony',
      'Susan Road',
      'Canal Road',
      'FDA City',
      'Wapda City',
    ],
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    lat: 31.4504,
    lng: 73.135,
  },
  {
    name: 'Multan',
    province: 'Punjab',
    areas: [
      'DHA Multan',
      'Cantt',
      'Bosan Road',
      'Wapda Town',
      'Model Town',
      'Gulgasht Colony',
    ],
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    lat: 30.1575,
    lng: 71.5249,
  },
  {
    name: 'Quetta',
    province: 'Balochistan',
    areas: ['Cantt', 'Jinnah Town', 'Samungli Road', 'Zarghoon Housing Scheme'],
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    lat: 30.1798,
    lng: 66.975,
  },
];

/**
 * Format price in PKR units (Crore, Lakh, Thousand)
 */
export function formatPKR(amount, purpose = 'sale') {
  if (amount == null || isNaN(amount)) return 'PKR 0';

  let formatted = '';
  if (amount >= 100000000) {
    const val = (amount / 100000000).toFixed(2).replace(/\.00$/, '');
    formatted = `PKR ${val} Arab`;
  } else if (amount >= 10000000) {
    const val = (amount / 10000000).toFixed(2).replace(/\.00$/, '');
    formatted = `PKR ${val} Crore`;
  } else if (amount >= 100000) {
    const val = (amount / 100000).toFixed(2).replace(/\.00$/, '');
    formatted = `PKR ${val} Lakh`;
  } else if (amount >= 1000) {
    formatted = `PKR ${(amount / 1000).toFixed(1).replace(/\.0$/, '')} Thousand`;
  } else {
    formatted = `PKR ${amount.toLocaleString('en-PK')}`;
  }

  if (purpose === 'rent') {
    return `${formatted} / month`;
  }
  return formatted;
}

/**
 * Format area with unit
 */
export function formatArea(size, unit = 'marla') {
  if (unit === 'marla') {
    return `${size} Marla`;
  } else if (unit === 'kanal') {
    return `${size} Kanal`;
  } else if (unit === 'sqyard') {
    return `${size} Sq. Yd.`;
  }
  return `${size.toLocaleString()} Sq. Ft.`;
}

/**
 * Standard amenities available in Pakistani real estate
 */
export const PAKISTANI_AMENITIES = [
  'Electricity Backup (UPS/Generator)',
  'Sui Gas',
  'Water Supply',
  'Sewerage',
  'Security Staff',
  'CCTV Security',
  'Maintenance Staff',
  'Servant Quarters',
  'Lawn or Garden',
  'Double Glazed Windows',
  'Central Air Conditioning',
  'Central Heating',
  'Elevator or Lift',
  'Swimming Pool',
  'Covered Parking',
  'Gymnasium',
  'Mosque Nearby',
  'Nearby Schools',
  'Nearby Hospitals',
  'Nearby Shopping Malls',
  'Waste Disposal',
  'Broadband Internet Access',
];
