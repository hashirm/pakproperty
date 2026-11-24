import mongoose from 'mongoose';

const PropertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, index: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    purpose: { type: String, enum: ['sale', 'rent'], required: true, index: true },
    category: { type: String, enum: ['home', 'plot', 'commercial'], required: true, index: true },
    propertyType: { type: String, required: true, index: true },
    price: { type: Number, required: true, index: true },
    displayPrice: { type: String },
    location: {
      city: { type: String, required: true, index: true },
      area: { type: String, required: true, index: true },
      address: { type: String, required: true },
      coordinates: {
        lat: { type: Number, default: 33.6844 },
        lng: { type: Number, default: 73.0479 },
      },
    },
    areaSize: { type: Number, required: true },
    areaUnit: {
      type: String,
      enum: ['marla', 'kanal', 'sqft', 'sqyard'],
      default: 'marla',
    },
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    description: { type: String, required: true },
    features: [{ type: String }],
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String },
        caption: { type: String },
      },
    ],
    featuredImage: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    rejectionReason: { type: String },
    isFeatured: { type: Boolean, default: false, index: true },
    views: { type: Number, default: 0 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    agency: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
  },
  { timestamps: true }
);

// Compound text index for search
PropertySchema.index({
  title: 'text',
  description: 'text',
  'location.city': 'text',
  'location.area': 'text',
  'location.address': 'text',
});

export const Property = mongoose.model('Property', PropertySchema);
