import mongoose from 'mongoose';

const InquirySchema = new mongoose.Schema(
  {
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true, index: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    senderName: { type: String, required: true, trim: true },
    senderEmail: { type: String, required: true, trim: true, lowercase: true },
    senderPhone: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: {
      type: String,
      enum: ['pending', 'read', 'replied'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export const Inquiry = mongoose.model('Inquiry', InquirySchema);
