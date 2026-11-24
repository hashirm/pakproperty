import { User } from '../models/User.js';
import { Agent } from '../models/Agent.js';
import { Property } from '../models/Property.js';
import { LocationModel } from '../models/Location.js';
import { Category } from '../models/Category.js';
import { PAKISTANI_CITIES, formatPKR } from './pakistaniData.js';

export const seedDatabase = async (force = false) => {
  try {
    const existingPropertiesCount = await Property.countDocuments();
    if (existingPropertiesCount > 0 && !force) {
      console.log(`Database already has ${existingPropertiesCount} properties. Skipping seed.`);
      return;
    }

    console.log('Seeding database with authentic Pakistani real estate data (JS)...');

    if (force) {
      await User.deleteMany({});
      await Agent.deleteMany({});
      await Property.deleteMany({});
      await LocationModel.deleteMany({});
      await Category.deleteMany({});
    }

    // 1. Create Admin
    const adminUser = await User.create({
      name: 'Administrator',
      email: 'admin@pakproperty.com',
      password: 'adminpassword123',
      phone: '+92 300 0000000',
      whatsapp: '+92 300 0000000',
      role: 'admin',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    });

    // 2. Create Seller & Buyer
    const sellerUser = await User.create({
      name: 'Chaudhry Nadeem',
      email: 'seller@pakproperty.com',
      password: 'password123',
      phone: '+92 301 5551234',
      whatsapp: '+92 301 5551234',
      role: 'seller',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    });

    const buyerUser = await User.create({
      name: 'Bilal Farooq',
      email: 'buyer@pakproperty.com',
      password: 'password123',
      phone: '+92 321 4445678',
      whatsapp: '+92 321 4445678',
      role: 'buyer',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    });

    // 3. Create Real Estate Agents
    const agentUsersData = [
      {
        name: 'Tariq Mehmood',
        email: 'tariq@apexproperties.pk',
        password: 'password123',
        phone: '+92 333 5152535',
        whatsapp: '+92 333 5152535',
        role: 'agent',
        isVerified: true,
        agencyName: 'Apex Real Estate & Builders',
        city: 'Islamabad',
        areas: ['DHA Phase 2', 'Bahria Town Phase 8', 'Sector F-7', 'Sector F-10', 'Gulberg Greens'],
        experience: 12,
        rating: 4.9,
        reviewCount: 38,
        bio: 'Premier Islamabad real estate consultancy specializing in luxury residential bungalows, CDA plots, and commercial high-rises.',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
      },
      {
        name: 'Malik Zafar Iqbal',
        email: 'zafar@dhaprime.pk',
        password: 'password123',
        phone: '+92 300 8484848',
        whatsapp: '+92 300 8484848',
        role: 'agent',
        isVerified: true,
        agencyName: 'DHA Prime Properties',
        city: 'Lahore',
        areas: ['DHA Phase 5', 'DHA Phase 6', 'Gulberg III', 'Cantt'],
        experience: 15,
        rating: 4.8,
        reviewCount: 52,
        bio: 'Authorized DHA Lahore real estate advisor providing verified title deeds, investment portfolios, and premium residential estates.',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
      },
      {
        name: 'Fatima Noor',
        email: 'fatima@cliftonrealty.pk',
        password: 'password123',
        phone: '+92 321 9876543',
        whatsapp: '+92 321 9876543',
        role: 'agent',
        isVerified: true,
        agencyName: 'Clifton & Defense Realtors',
        city: 'Karachi',
        areas: ['DHA Phase 5', 'DHA Phase 6', 'Clifton Block 2', 'Clifton Block 4', 'Bahria Town Karachi'],
        experience: 9,
        rating: 4.9,
        reviewCount: 29,
        bio: 'Specializing in beachfront apartments, DHA residential properties, and corporate commercial spaces across Karachi.',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      },
      {
        name: 'Farhan Rauf',
        email: 'farhan@rawalpindirealtors.pk',
        password: 'password123',
        phone: '+92 312 5559876',
        whatsapp: '+92 312 5559876',
        role: 'agent',
        isVerified: true,
        agencyName: 'Twin Cities Estate Network',
        city: 'Rawalpindi',
        areas: ['Bahria Town Phase 4', 'Bahria Town Phase 7', 'Chaklala Scheme 3', 'Saddar'],
        experience: 8,
        rating: 4.7,
        reviewCount: 21,
        bio: 'Reliable real estate advisor for Bahria Town Rawalpindi, Chaklala Scheme 3, and surrounding investment hot-spots.',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
      },
    ];

    const createdAgents = [];

    for (const aData of agentUsersData) {
      const u = await User.create({
        name: aData.name,
        email: aData.email,
        password: aData.password,
        phone: aData.phone,
        whatsapp: aData.whatsapp,
        role: 'agent',
        isVerified: true,
        avatar: aData.avatar,
      });

      const agentProfile = await Agent.create({
        user: u._id,
        agencyName: aData.agencyName,
        agencyLogo: aData.avatar,
        city: aData.city,
        operatingAreas: aData.areas,
        experienceYears: aData.experience,
        rating: aData.rating,
        reviewCount: aData.reviewCount,
        isVerified: true,
        phone: aData.phone,
        whatsapp: aData.whatsapp,
        email: aData.email,
        bio: aData.bio,
      });

      u.agency = agentProfile._id;
      await u.save();
      createdAgents.push({ user: u, agent: agentProfile });
    }

    // 4. Seed Locations
    for (const city of PAKISTANI_CITIES) {
      await LocationModel.create({
        city: city.name,
        province: city.province,
        popularAreas: city.areas,
        imageUrl: city.image,
        coordinates: { lat: city.lat, lng: city.lng },
      });
    }

    // 5. Seed Properties
    const propertiesData = [
      {
        title: '1 Kanal Ultra Luxury Spanish Designer House in Sector F-7/2',
        purpose: 'sale',
        category: 'home',
        propertyType: 'house',
        price: 145000000,
        city: 'Islamabad',
        area: 'Sector F-7',
        address: 'Street 18, Sector F-7/2, Islamabad',
        areaSize: 1,
        areaUnit: 'kanal',
        bedrooms: 5,
        bathrooms: 6,
        description:
          'Presenting an immaculate 1 Kanal Spanish style architectural masterpiece in the heart of Sector F-7/2 Islamabad. Featuring imported Italian marble flooring, Grohe & Kohler bathroom fittings, custom ash-wood carpentry, dual chef kitchens equipped with Bosch appliances, dedicated cinema room, elevator shaft, servant quarters, and lush landscaped front lawn. 100% CDA transfer with clear title.',
        features: [
          'Electricity Backup (UPS/Generator)',
          'Sui Gas',
          'Water Supply',
          'Sewerage',
          'Security Staff',
          'CCTV Security',
          'Servant Quarters',
          'Lawn or Garden',
          'Double Glazed Windows',
          'Central Air Conditioning',
          'Covered Parking',
          'Nearby Hospitals',
          'Nearby Schools',
        ],
        images: [
          { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80', caption: 'Front Elevation' },
          { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', caption: 'Drawing Room' },
          { url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80', caption: 'Designer Kitchen' },
          { url: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80', caption: 'Master Bedroom' },
        ],
        coordinates: { lat: 33.7215, lng: 73.0563 },
        isFeatured: true,
        userIndex: 0,
      },
      {
        title: '10 Marla Brand New Modern Solid Built House in DHA Phase 2',
        purpose: 'sale',
        category: 'home',
        propertyType: 'house',
        price: 42500000,
        city: 'Islamabad',
        area: 'DHA Phase 2',
        address: 'Sector B, DHA Phase 2, Islamabad',
        areaSize: 10,
        areaUnit: 'marla',
        bedrooms: 5,
        bathrooms: 5,
        description:
          'Stunning brand new 10 Marla modern house available for sale in prime location of DHA Phase 2 Islamabad. Built with solid A+ construction materials, Spanish tiles, high-grade UPVC windows, modern false ceilings with warm LED profiles, two independent kitchens, separate servant room, and two-car covered porch. Walking distance to commercial hub and central mosque.',
        features: [
          'Electricity Backup (UPS/Generator)',
          'Sui Gas',
          'Water Supply',
          'Security Staff',
          'CCTV Security',
          'Maintenance Staff',
          'Double Glazed Windows',
          'Covered Parking',
          'Mosque Nearby',
          'Nearby Shopping Malls',
        ],
        images: [
          { url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80', caption: 'Front View' },
          { url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80', caption: 'Living Lounge' },
          { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', caption: 'Master Bed' },
        ],
        coordinates: { lat: 33.5222, lng: 73.1611 },
        isFeatured: true,
        userIndex: 0,
      },
      {
        title: '1 Kanal Brand New Corner Bungalow in DHA Phase 6',
        purpose: 'sale',
        category: 'home',
        propertyType: 'house',
        price: 89000000,
        city: 'Lahore',
        area: 'DHA Phase 6',
        address: 'Sector K, DHA Phase 6, Lahore',
        areaSize: 1,
        areaUnit: 'kanal',
        bedrooms: 5,
        bathrooms: 6,
        description:
          'A magnificent corner 1 Kanal designer bungalow situated on a 60ft wide road in Sector K, DHA Phase 6 Lahore. Featuring high ceilings, double height lobby, Turkish sanitary fittings, heated pool Jacuzzi, automated gate, dirty kitchen, 2 servant quarters, and imported glass chandeliers. Direct access to Raya Golf Club and Ring Road.',
        features: [
          'Electricity Backup (UPS/Generator)',
          'Sui Gas',
          'Water Supply',
          'Security Staff',
          'CCTV Security',
          'Servant Quarters',
          'Swimming Pool',
          'Lawn or Garden',
          'Elevator or Lift',
          'Covered Parking',
        ],
        images: [
          { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80', caption: 'Exterior Corner View' },
          { url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80', caption: 'Dining Area' },
          { url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80', caption: 'Upper Terrace' },
        ],
        coordinates: { lat: 31.4707, lng: 74.4552 },
        isFeatured: true,
        userIndex: 1,
      },
      {
        title: '1 Kanal Direct Owner Residential Plot in DHA Phase 5',
        purpose: 'sale',
        category: 'plot',
        propertyType: 'residential_plot',
        price: 38000000,
        city: 'Lahore',
        area: 'DHA Phase 5',
        address: 'Sector G, DHA Phase 5, Lahore',
        areaSize: 1,
        areaUnit: 'kanal',
        bedrooms: 0,
        bathrooms: 0,
        description:
          'Prime location 1 Kanal solid land plot in Sector G, DHA Phase 5 Lahore. Facing park, walking distance to commercial avenue and main boulevard. Peaceful and fully developed sector with 100% underground utilities, fast gas connection, and immediate possession available for house construction.',
        features: ['Sui Gas', 'Water Supply', 'Sewerage', 'Security Staff', 'Mosque Nearby'],
        images: [
          { url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80', caption: 'Plot Frontage' },
          { url: 'https://images.unsplash.com/photo-1524813686514-a57563d77d66?auto=format&fit=crop&w=1200&q=80', caption: 'Sector Avenue' },
        ],
        coordinates: { lat: 31.4682, lng: 74.4024 },
        isFeatured: false,
        userIndex: 1,
      },
      {
        title: '500 Sq. Yd. Luxurious Mediterranean Villa in Clifton Block 4',
        purpose: 'sale',
        category: 'home',
        propertyType: 'house',
        price: 180000000,
        city: 'Karachi',
        area: 'Clifton Block 4',
        address: 'Sea View Enclave, Clifton Block 4, Karachi',
        areaSize: 500,
        areaUnit: 'sqyard',
        bedrooms: 6,
        bathrooms: 7,
        description:
          'Exceptional coastal villa nestled in highly secured elite enclave of Clifton Block 4. High-security boundary walls, solar net-metering system installed, private rooftop lounge with Arabian Sea horizon views, sound-proof windows, guard post, and premium imported finishes throughout.',
        features: [
          'Electricity Backup (UPS/Generator)',
          'Sui Gas',
          'Water Supply',
          'Security Staff',
          'CCTV Security',
          'Servant Quarters',
          'Covered Parking',
          'Nearby Shopping Malls',
          'Broadband Internet Access',
        ],
        images: [
          { url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80', caption: 'Front Façade' },
          { url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80', caption: 'Grand Hall' },
          { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', caption: 'Terrace View' },
        ],
        coordinates: { lat: 24.8197, lng: 67.0289 },
        isFeatured: true,
        userIndex: 2,
      },
      {
        title: '3 Bed Luxury Sea-Facing Executive Apartment in DHA Phase 8',
        purpose: 'rent',
        category: 'home',
        propertyType: 'flat',
        price: 275000,
        city: 'Karachi',
        area: 'DHA Phase 8',
        address: 'Creek Promenade, DHA Phase 8, Karachi',
        areaSize: 2400,
        areaUnit: 'sqft',
        bedrooms: 3,
        bathrooms: 4,
        description:
          'Fully serviced 3-bedroom sea-facing apartment offering panoramic ocean views from every balcony. Building features 24/7 standby power generator, biometric security access, high-speed passenger & cargo lifts, dedicated gym and clubhouse, and 2 reserved basement parking slots.',
        features: [
          'Electricity Backup (UPS/Generator)',
          'Sui Gas',
          'Water Supply',
          'Security Staff',
          'CCTV Security',
          'Elevator or Lift',
          'Gymnasium',
          'Covered Parking',
          'Waste Disposal',
        ],
        images: [
          { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80', caption: 'Apartment Tower' },
          { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80', caption: 'Living Area' },
          { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80', caption: 'Bedroom' },
        ],
        coordinates: { lat: 24.7744, lng: 67.0722 },
        isFeatured: true,
        userIndex: 2,
      },
      {
        title: '5 Marla Beautiful Semi-Furnished House in Bahria Town Phase 8',
        purpose: 'sale',
        category: 'home',
        propertyType: 'house',
        price: 16500000,
        city: 'Rawalpindi',
        area: 'Bahria Town Phase 8',
        address: 'Ali Block, Bahria Town Phase 8, Rawalpindi',
        areaSize: 5,
        areaUnit: 'marla',
        bedrooms: 3,
        bathrooms: 4,
        description:
          'Ideal family home in Ali Block Bahria Town Phase 8. Modern architecture with 3 spacious master bedrooms, attached designer baths, fitted wardrobes, stylish kitchen with cooking range and hood, laundry area, and compact garage. Uninterrupted Bahria electricity and 24/7 security patrol.',
        features: [
          'Electricity Backup (UPS/Generator)',
          'Sui Gas',
          'Water Supply',
          'Security Staff',
          'CCTV Security',
          'Mosque Nearby',
          'Nearby Schools',
          'Nearby Shopping Malls',
        ],
        images: [
          { url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80', caption: 'Front View' },
          { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', caption: 'Interior' },
        ],
        coordinates: { lat: 33.4862, lng: 73.0841 },
        isFeatured: false,
        userIndex: 3,
      },
      {
        title: '10 Marla Corner Modern House for Rent in Gulberg III',
        purpose: 'rent',
        category: 'home',
        propertyType: 'house',
        price: 135000,
        city: 'Lahore',
        area: 'Gulberg III',
        address: 'Near MM Alam Road, Gulberg III, Lahore',
        areaSize: 10,
        areaUnit: 'marla',
        bedrooms: 4,
        bathrooms: 4,
        description:
          'Prime location residential house available for rent in Gulberg III Lahore, just 2 minutes drive from MM Alam Road and Main Boulevard. Perfect for corporate executive residence or quiet family living. Generous parking space, separate servant room, and lush green garden.',
        features: [
          'Electricity Backup (UPS/Generator)',
          'Sui Gas',
          'Water Supply',
          'Lawn or Garden',
          'Servant Quarters',
          'Covered Parking',
          'Nearby Shopping Malls',
        ],
        images: [
          { url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80', caption: 'House View' },
          { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', caption: 'Lounge' },
        ],
        coordinates: { lat: 31.5122, lng: 74.3436 },
        isFeatured: false,
        userIndex: 1,
      },
      {
        title: '2 Kanal Majestic Farmhouse with Swimming Pool in Gulberg Greens',
        purpose: 'sale',
        category: 'home',
        propertyType: 'farm_house',
        price: 85000000,
        city: 'Islamabad',
        area: 'Gulberg Greens',
        address: 'Executive Block, Gulberg Greens, Islamabad',
        areaSize: 2,
        areaUnit: 'kanal',
        bedrooms: 4,
        bathrooms: 5,
        description:
          'Resort-style contemporary farmhouse built on 2 Kanals in elite Executive Block of Gulberg Greens Islamabad. Features an outdoor heated swimming pool, manicured lawn with exotic palms, BBQ pergola, modern single-storey open-concept design with floor-to-ceiling glass walls, and organic orchard.',
        features: [
          'Electricity Backup (UPS/Generator)',
          'Sui Gas',
          'Water Supply',
          'Swimming Pool',
          'Lawn or Garden',
          'Security Staff',
          'CCTV Security',
          'Servant Quarters',
          'Covered Parking',
        ],
        images: [
          { url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80', caption: 'Farmhouse Exterior & Pool' },
          { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80', caption: 'Lawn & Patio' },
        ],
        coordinates: { lat: 33.6012, lng: 73.1384 },
        isFeatured: true,
        userIndex: 0,
      },
      {
        title: 'Prime 1200 Sq. Ft. Commercial Corporate Office in Blue Area',
        purpose: 'rent',
        category: 'commercial',
        propertyType: 'office',
        price: 320000,
        city: 'Islamabad',
        area: 'Sector F-7',
        address: 'Jinnah Avenue, Blue Area, Islamabad',
        areaSize: 1200,
        areaUnit: 'sqft',
        bedrooms: 0,
        bathrooms: 2,
        description:
          'A-grade commercial corporate office space ready for immediate occupancy on 5th floor of prestigious high-rise in Blue Area Islamabad. Fully partitioned with executive glass cabins, reception desk, conference room, IT server room, kitchenette, and reserved basement parking. Dual elevator access and 100% generator power backup.',
        features: [
          'Electricity Backup (UPS/Generator)',
          'Central Air Conditioning',
          'Central Heating',
          'Elevator or Lift',
          'Security Staff',
          'CCTV Security',
          'Covered Parking',
          'Broadband Internet Access',
        ],
        images: [
          { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80', caption: 'Office Space' },
          { url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80', caption: 'Conference Room' },
        ],
        coordinates: { lat: 33.7121, lng: 73.0645 },
        isFeatured: false,
        userIndex: 0,
      },
      {
        title: '5 Marla Residential Plot in Park View City Islamabad',
        purpose: 'sale',
        category: 'plot',
        propertyType: 'residential_plot',
        price: 6800000,
        city: 'Islamabad',
        area: 'Park View City',
        address: 'Block H, Park View City, Malot Road, Islamabad',
        areaSize: 5,
        areaUnit: 'marla',
        bedrooms: 0,
        bathrooms: 0,
        description:
          'CDA-approved 5 Marla on-ground plot in Block H of Park View City. Nestled against the scenic Margalla hills with ready possession. Complete development with electricity, wide carpeted roads, underground sewage, and community park. Great opportunity for both capital gains and home construction.',
        features: ['Electricity Backup (UPS/Generator)', 'Water Supply', 'Sewerage', 'Security Staff'],
        images: [
          { url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80', caption: 'Plot View' },
        ],
        coordinates: { lat: 33.6931, lng: 73.1812 },
        isFeatured: false,
        userIndex: 0,
      },
      {
        title: '1 Kanal Beautiful Contemporary House in Hayatabad Phase 5',
        purpose: 'sale',
        category: 'home',
        propertyType: 'house',
        price: 52000000,
        city: 'Peshawar',
        area: 'Hayatabad Phase 5',
        address: 'Sector F, Hayatabad Phase 5, Peshawar',
        areaSize: 1,
        areaUnit: 'kanal',
        bedrooms: 5,
        bathrooms: 6,
        description:
          'Superb 1 Kanal double storey house in premier residential sector of Hayatabad Phase 5 Peshawar. 5 bedrooms with attached luxury bathrooms, drawing and dining hall, spacious family TV lounges on both floors, open Italian kitchen, dirty kitchen, front lawn, and 3-car parking porch. Completely peaceful VIP neighborhood.',
        features: [
          'Electricity Backup (UPS/Generator)',
          'Sui Gas',
          'Water Supply',
          'Security Staff',
          'Lawn or Garden',
          'Servant Quarters',
          'Covered Parking',
          'Nearby Hospitals',
        ],
        images: [
          { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', caption: 'Front Elevation' },
          { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80', caption: 'Main Hall' },
        ],
        coordinates: { lat: 33.9872, lng: 71.4391 },
        isFeatured: true,
        userIndex: 3,
      },
      {
        title: '10 Marla Elegant Corner House in Johar Town Block G',
        purpose: 'sale',
        category: 'home',
        propertyType: 'house',
        price: 33000000,
        city: 'Lahore',
        area: 'Johar Town',
        address: 'Block G-3, Johar Town, Lahore',
        areaSize: 10,
        areaUnit: 'marla',
        bedrooms: 4,
        bathrooms: 5,
        description:
          'Prime 10 Marla corner double storey house situated right near Shaukat Khanum Hospital and Expo Center. Superb woodwork, imported tile finishes, high water pressure system, rooftop terrace with panoramic area view, and separate outer staircase for upper portion rental income potential.',
        features: [
          'Electricity Backup (UPS/Generator)',
          'Sui Gas',
          'Water Supply',
          'Nearby Hospitals',
          'Nearby Shopping Malls',
          'Nearby Schools',
          'Covered Parking',
        ],
        images: [
          { url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80', caption: 'House Façade' },
          { url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80', caption: 'Lounge' },
        ],
        coordinates: { lat: 31.4697, lng: 74.2728 },
        isFeatured: false,
        userIndex: 1,
      },
      {
        title: '2 Bed Modern Luxury Apartment in Centaurus Residencia, F-8',
        purpose: 'rent',
        category: 'home',
        propertyType: 'flat',
        price: 185000,
        city: 'Islamabad',
        area: 'Sector F-8',
        address: 'Tower A, The Centaurus Residencia, Jinnah Avenue, F-8, Islamabad',
        areaSize: 1600,
        areaUnit: 'sqft',
        bedrooms: 2,
        bathrooms: 3,
        description:
          'Live the five-star lifestyle at The Centaurus Residencia in Sector F-8. Fully furnished 2-bedroom executive apartment with Margalla view balcony. Central HVAC cooling/heating, high-speed Otis elevators, fitness center, indoor heated swimming pool, round-the-clock security and maintenance, and direct private resident elevator to Centaurus Mall.',
        features: [
          'Electricity Backup (UPS/Generator)',
          'Central Air Conditioning',
          'Central Heating',
          'Elevator or Lift',
          'Swimming Pool',
          'Gymnasium',
          'Security Staff',
          'CCTV Security',
          'Nearby Shopping Malls',
          'Covered Parking',
        ],
        images: [
          { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80', caption: 'Tower Exterior' },
          { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80', caption: 'Furnished Lounge' },
          { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80', caption: 'Bedroom' },
        ],
        coordinates: { lat: 33.7077, lng: 73.0506 },
        isFeatured: true,
        userIndex: 0,
      },
    ];

    for (const p of propertiesData) {
      const agentObj = createdAgents[p.userIndex];
      const slug = `${p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`;

      await Property.create({
        title: p.title,
        slug,
        purpose: p.purpose,
        category: p.category,
        propertyType: p.propertyType,
        price: p.price,
        displayPrice: formatPKR(p.price, p.purpose),
        location: {
          city: p.city,
          area: p.area,
          address: p.address,
          coordinates: p.coordinates,
        },
        areaSize: p.areaSize,
        areaUnit: p.areaUnit,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        description: p.description,
        features: p.features,
        images: p.images,
        featuredImage: p.images[0]?.url || '',
        status: 'approved',
        isFeatured: p.isFeatured,
        views: Math.floor(Math.random() * 250) + 20,
        user: agentObj.user._id,
        agency: agentObj.agent._id,
      });
    }

    // Add 1 pending property owned by regular seller for testing Admin Approval flow!
    await Property.create({
      title: '7 Marla Solid Double Storey House in Chaklala Scheme 3',
      slug: `7-marla-solid-double-storey-house-in-chaklala-scheme-3-${Date.now().toString(36)}`,
      purpose: 'sale',
      category: 'home',
      propertyType: 'house',
      price: 24000000,
      displayPrice: 'PKR 2.4 Crore',
      location: {
        city: 'Rawalpindi',
        area: 'Chaklala Scheme 3',
        address: 'Street 4, Commercial Road, Chaklala Scheme 3, Rawalpindi',
        coordinates: { lat: 33.5855, lng: 73.0901 },
      },
      areaSize: 7,
      areaUnit: 'marla',
      bedrooms: 4,
      bathrooms: 4,
      description:
        'Well-maintained 7 Marla family residence in heart of Chaklala Scheme 3 Rawalpindi. 4 bedrooms, 4 bathrooms, double kitchen, car porch, water boring installed. Waiting for moderation approval.',
      features: ['Electricity Backup (UPS/Generator)', 'Sui Gas', 'Water Supply', 'Covered Parking'],
      images: [
        { url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80', caption: 'Front' },
      ],
      featuredImage: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
      status: 'pending',
      isFeatured: false,
      user: sellerUser._id,
    });

    console.log('Database seeded successfully with users, agents, and rich Pakistani property listings (JS)!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};
