import mongoose from 'mongoose';

const LocationSchema = new mongoose.Schema(
  {
    city: { type: String, required: true, unique: true, index: true },
    province: { type: String, required: true },
    popularAreas: [{ type: String }],
    listingCount: { type: Number, default: 0 },
    imageUrl: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  { timestamps: true }
);

export const LocationModel = mongoose.model('Location', LocationSchema);
