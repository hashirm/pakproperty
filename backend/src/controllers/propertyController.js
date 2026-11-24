import { Property } from '../models/Property.js';
import { Favorite } from '../models/Favorite.js';
import { formatPKR } from '../utils/pakistaniData.js';

export const getProperties = async (req, res) => {
  try {
    const {
      purpose,
      category,
      propertyType,
      city,
      area,
      search,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      minArea,
      maxArea,
      areaUnit,
      sort = 'newest',
      page = '1',
      limit = '12',
      isFeatured,
      status = 'approved',
    } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (purpose && (purpose === 'sale' || purpose === 'rent')) {
      query.purpose = purpose;
    }

    if (category) {
      query.category = category;
    }

    if (propertyType) {
      query.propertyType = propertyType;
    }

    if (city) {
      query['location.city'] = { $regex: new RegExp(`^${city}$`, 'i') };
    }

    if (area) {
      query['location.area'] = { $regex: new RegExp(String(area), 'i') };
    }

    if (isFeatured !== undefined) {
      query.isFeatured = isFeatured === 'true';
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (bedrooms) {
      if (bedrooms === '5+') {
        query.bedrooms = { $gte: 5 };
      } else {
        query.bedrooms = Number(bedrooms);
      }
    }

    if (bathrooms) {
      if (bathrooms === '4+') {
        query.bathrooms = { $gte: 4 };
      } else {
        query.bathrooms = Number(bathrooms);
      }
    }

    if (minArea || maxArea) {
      query.areaSize = {};
      if (minArea) query.areaSize.$gte = Number(minArea);
      if (maxArea) query.areaSize.$lte = Number(maxArea);
    }

    if (areaUnit) {
      query.areaUnit = areaUnit;
    }

    if (search) {
      const searchRegex = new RegExp(String(search), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { 'location.city': searchRegex },
        { 'location.area': searchRegex },
        { 'location.address': searchRegex },
        { propertyType: searchRegex },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') {
      sortOption = { price: 1 };
    } else if (sort === 'price_desc') {
      sortOption = { price: -1 };
    } else if (sort === 'popular') {
      sortOption = { views: -1, createdAt: -1 };
    } else if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    }

    const pageNum = Math.max(1, parseInt(String(page), 10));
    const pageSize = Math.max(1, Math.min(100, parseInt(String(limit), 10)));
    const skip = (pageNum - 1) * pageSize;

    const [properties, total] = await Promise.all([
      Property.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(pageSize)
        .populate('user', 'name phone email avatar whatsapp role')
        .populate('agency', 'agencyName agencyLogo rating city phone whatsapp'),
      Property.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: properties,
      pagination: {
        page: pageNum,
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFeaturedProperties = async (_req, res) => {
  try {
    const featured = await Property.find({ status: 'approved', isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(8)
      .populate('user', 'name phone email avatar whatsapp role')
      .populate('agency', 'agencyName agencyLogo rating city');

    res.status(200).json({
      success: true,
      data: featured,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCityStats = async (_req, res) => {
  try {
    const stats = await Property.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$location.city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const formatted = stats.map((item) => ({
      city: item._id,
      count: item.count,
    }));

    res.status(200).json({ success: true, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findById(id)
      .populate('user', 'name phone email avatar whatsapp role createdAt')
      .populate('agency', 'agencyName agencyLogo rating reviewCount city operatingAreas phone whatsapp email bio');

    if (!property) {
      res.status(404).json({ success: false, message: 'Property not found.' });
      return;
    }

    Property.findByIdAndUpdate(id, { $inc: { views: 1 } }).exec();

    let isFavorite = false;
    if (req.user) {
      const fav = await Favorite.findOne({ user: req.user._id, property: property._id });
      isFavorite = !!fav;
    }

    const similarProperties = await Property.find({
      _id: { $ne: property._id },
      status: 'approved',
      'location.city': property.location.city,
      category: property.category,
    })
      .limit(4)
      .select('title price displayPrice location areaSize areaUnit bedrooms bathrooms featuredImage purpose propertyType');

    res.status(200).json({
      success: true,
      data: property,
      isFavorite,
      similarProperties,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProperty = async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const {
      title,
      purpose,
      category,
      propertyType,
      price,
      location,
      areaSize,
      areaUnit,
      bedrooms,
      bathrooms,
      description,
      features,
      images,
      featuredImage,
    } = req.body;

    if (!title || !purpose || !category || !propertyType || !price || !location?.city || !location?.area || !areaSize || !description) {
      res.status(400).json({
        success: false,
        message: 'Missing required property details (title, purpose, category, propertyType, price, city, area, size, description).',
      });
      return;
    }

    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`;
    const parsedPrice = Number(price);
    const displayPrice = formatPKR(parsedPrice, purpose);

    const imageList = Array.isArray(images) && images.length > 0 ? images : [
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        caption: 'Property Front View',
      },
    ];

    const mainImage = featuredImage || (imageList[0]?.url || '');
    const initialStatus = req.user.role === 'admin' ? 'approved' : 'pending';

    const property = await Property.create({
      title,
      slug,
      purpose,
      category,
      propertyType,
      price: parsedPrice,
      displayPrice,
      location: {
        city: location.city,
        area: location.area,
        address: location.address || `${location.area}, ${location.city}`,
        coordinates: location.coordinates || { lat: 33.6844, lng: 73.0479 },
      },
      areaSize: Number(areaSize),
      areaUnit: areaUnit || 'marla',
      bedrooms: bedrooms ? Number(bedrooms) : 0,
      bathrooms: bathrooms ? Number(bathrooms) : 0,
      description,
      features: Array.isArray(features) ? features : [],
      images: imageList,
      featuredImage: mainImage,
      status: initialStatus,
      isFeatured: false,
      user: req.user._id,
      agency: req.user.agency || undefined,
    });

    res.status(201).json({
      success: true,
      message:
        initialStatus === 'approved'
          ? 'Property listing created and published!'
          : 'Property submitted successfully! It will be reviewed and published shortly.',
      data: property,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProperty = async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const { id } = req.params;
    const property = await Property.findById(id);

    if (!property) {
      res.status(404).json({ success: false, message: 'Property not found.' });
      return;
    }

    if (property.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'You are not authorized to update this listing.' });
      return;
    }

    const updates = { ...req.body };

    if (updates.price) {
      updates.price = Number(updates.price);
      updates.displayPrice = formatPKR(updates.price, updates.purpose || property.purpose);
    }

    if (property.status === 'rejected' && req.user.role !== 'admin') {
      updates.status = 'pending';
      updates.rejectionReason = '';
    }

    const updated = await Property.findByIdAndUpdate(id, updates, { new: true });

    res.status(200).json({
      success: true,
      message: 'Property updated successfully!',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const { id } = req.params;
    const property = await Property.findById(id);

    if (!property) {
      res.status(404).json({ success: false, message: 'Property not found.' });
      return;
    }

    if (property.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'You are not authorized to delete this listing.' });
      return;
    }

    await Property.findByIdAndDelete(id);
    await Favorite.deleteMany({ property: id });

    res.status(200).json({ success: true, message: 'Property deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
