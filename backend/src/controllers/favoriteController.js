import { Favorite } from '../models/Favorite.js';
import { Property } from '../models/Property.js';

export const getFavorites = async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const favorites = await Favorite.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: 'property',
        populate: [
          { path: 'user', select: 'name phone email avatar whatsapp' },
          { path: 'agency', select: 'agencyName rating city' },
        ],
      });

    const validProperties = favorites
      .filter((fav) => fav.property != null)
      .map((fav) => fav.property);

    res.status(200).json({
      success: true,
      data: validProperties,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleFavorite = async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Please log in to save properties to favorites.' });
      return;
    }

    const { propertyId } = req.params;

    const property = await Property.findById(propertyId);
    if (!property) {
      res.status(404).json({ success: false, message: 'Property not found.' });
      return;
    }

    const existingFav = await Favorite.findOne({
      user: req.user._id,
      property: property._id,
    });

    if (existingFav) {
      await Favorite.findByIdAndDelete(existingFav._id);
      res.status(200).json({
        success: true,
        isFavorite: false,
        message: 'Removed from your saved favorites.',
      });
    } else {
      await Favorite.create({
        user: req.user._id,
        property: property._id,
      });
      res.status(200).json({
        success: true,
        isFavorite: true,
        message: 'Saved to your favorites!',
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
