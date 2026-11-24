import { Property } from '../models/Property.js';
import { Notification } from '../models/Notification.js';

export const getMyProperties = async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const { status } = req.query;
    const query = { user: req.user._id };

    if (status && ['approved', 'pending', 'rejected'].includes(String(status))) {
      query.status = status;
    }

    const properties = await Property.find(query).sort({ createdAt: -1 });

    const counts = {
      all: await Property.countDocuments({ user: req.user._id }),
      approved: await Property.countDocuments({ user: req.user._id, status: 'approved' }),
      pending: await Property.countDocuments({ user: req.user._id, status: 'pending' }),
      rejected: await Property.countDocuments({ user: req.user._id, status: 'rejected' }),
    };

    res.status(200).json({
      success: true,
      data: properties,
      counts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyNotifications = async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30);

    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      data: notifications,
      unreadCount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const { id } = req.params;

    if (id === 'all') {
      await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
    } else {
      await Notification.findOneAndUpdate({ _id: id, user: req.user._id }, { isRead: true });
    }

    res.status(200).json({ success: true, message: 'Marked as read.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
