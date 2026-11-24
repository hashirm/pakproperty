import { Property } from '../models/Property.js';
import { User } from '../models/User.js';
import { Agent } from '../models/Agent.js';
import { Inquiry } from '../models/Inquiry.js';
import { Notification } from '../models/Notification.js';

export const getAdminStats = async (_req, res) => {
  try {
    const [
      totalUsers,
      totalProperties,
      approvedProperties,
      pendingProperties,
      rejectedProperties,
      totalAgents,
      totalInquiries,
    ] = await Promise.all([
      User.countDocuments(),
      Property.countDocuments(),
      Property.countDocuments({ status: 'approved' }),
      Property.countDocuments({ status: 'pending' }),
      Property.countDocuments({ status: 'rejected' }),
      Agent.countDocuments(),
      Inquiry.countDocuments(),
    ]);

    const recentPending = await Property.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email phone role');

    const recentInquiries = await Inquiry.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('property', 'title price location');

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalProperties,
          approvedProperties,
          pendingProperties,
          rejectedProperties,
          totalAgents,
          totalInquiries,
        },
        recentPending,
        recentInquiries,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPendingProperties = async (_req, res) => {
  try {
    const pending = await Property.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .populate('user', 'name email phone role avatar')
      .populate('agency', 'agencyName city');

    res.status(200).json({ success: true, data: pending });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const approveProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findByIdAndUpdate(
      id,
      { status: 'approved', rejectionReason: '' },
      { new: true }
    );

    if (!property) {
      res.status(404).json({ success: false, message: 'Property not found.' });
      return;
    }

    await Notification.create({
      user: property.user,
      title: 'Listing Approved & Published!',
      message: `Your property listing "${property.title}" has been approved by the moderator team and is now live.`,
      link: `/property/${property._id}`,
      type: 'status_change',
    });

    res.status(200).json({
      success: true,
      message: 'Property listing approved successfully and published to marketplace.',
      data: property,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const rejectProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const property = await Property.findByIdAndUpdate(
      id,
      {
        status: 'rejected',
        rejectionReason: reason || 'Listing does not adhere to quality guidelines or missing verified info.',
      },
      { new: true }
    );

    if (!property) {
      res.status(404).json({ success: false, message: 'Property not found.' });
      return;
    }

    await Notification.create({
      user: property.user,
      title: 'Listing Rejected',
      message: `Your property listing "${property.title}" was not approved. Reason: ${
        reason || 'Quality guidelines.'
      }`,
      link: `/dashboard/my-properties`,
      type: 'status_change',
    });

    res.status(200).json({
      success: true,
      message: 'Property listing rejected.',
      data: property,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleFeaturedProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id);

    if (!property) {
      res.status(404).json({ success: false, message: 'Property not found.' });
      return;
    }

    property.isFeatured = !property.isFeatured;
    await property.save();

    res.status(200).json({
      success: true,
      message: property.isFeatured ? 'Property marked as Featured!' : 'Property removed from Featured.',
      data: property,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllUsers = async (_req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .populate('agency', 'agencyName city rating');

    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
