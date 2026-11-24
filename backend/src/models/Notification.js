import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String },
    isRead: { type: Boolean, default: false },
    type: {
      type: String,
      enum: ['inquiry', 'status_change', 'system'],
      default: 'system',
    },
  },
  { timestamps: true }
);

export const Notification = mongoose.model('Notification', NotificationSchema);
