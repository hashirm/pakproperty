import { Inquiry } from '../models/Inquiry.js';
import { Property } from '../models/Property.js';
import { Notification } from '../models/Notification.js';

export const createInquiry = async (req, res) => {
  try {
    const { propertyId, name, email, phone, message } = req.body;

    if (!propertyId || !name || !email || !phone || !message) {
      res.status(400).json({
        success: false,
        message: 'Please provide all required fields: propertyId, name, email, phone, message.',
      });
      return;
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      res.status(404).json({ success: false, message: 'Property not found.' });
      return;
    }

    const inquiry = await Inquiry.create({
      property: property._id,
      sender: req.user?._id || undefined,
      senderName: name,
      senderEmail: email,
      senderPhone: phone,
      message,
      recipient: property.user,
      status: 'pending',
    });

    await Notification.create({
      user: property.user,
      title: 'New Property Inquiry Received',
      message: `${name} sent an inquiry regarding "${property.title}": "${message.slice(0, 80)}..."`,
      link: `/dashboard/inquiries`,
      type: 'inquiry',
    });

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been sent to the property owner/agent successfully!',
      data: inquiry,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyInquiries = async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const [received, sent] = await Promise.all([
      Inquiry.find({ recipient: req.user._id })
        .sort({ createdAt: -1 })
        .populate('property', 'title price displayPrice featuredImage location purpose propertyType')
        .populate('sender', 'name email phone avatar'),
      Inquiry.find({ sender: req.user._id })
        .sort({ createdAt: -1 })
        .populate('property', 'title price displayPrice featuredImage location purpose propertyType')
        .populate('recipient', 'name email phone avatar'),
    ]);

    res.status(200).json({
      success: true,
      data: {
        received,
        sent,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateInquiryStatus = async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const { id } = req.params;
    const { status } = req.body;

    const inquiry = await Inquiry.findOne({ _id: id, recipient: req.user._id });
    if (!inquiry) {
      res.status(404).json({ success: false, message: 'Inquiry not found or unauthorized.' });
      return;
    }

    inquiry.status = status;
    await inquiry.save();

    res.status(200).json({ success: true, message: 'Inquiry status updated.', data: inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
