import mongoose from 'mongoose';

const AgentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    agencyName: { type: String, required: true, trim: true },
    agencyLogo: { type: String, default: '' },
    licenseNumber: { type: String, trim: true },
    city: { type: String, required: true, index: true },
    operatingAreas: [{ type: String }],
    experienceYears: { type: Number, default: 1 },
    bio: { type: String, default: '' },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    reviewCount: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: true },
    phone: { type: String },
    whatsapp: { type: String },
    email: { type: String },
    address: { type: String },
    socialLinks: {
      website: { type: String },
      facebook: { type: String },
      whatsapp: { type: String },
    },
  },
  { timestamps: true }
);

export const Agent = mongoose.model('Agent', AgentSchema);
