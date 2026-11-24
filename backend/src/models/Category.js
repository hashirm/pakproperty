import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    group: { type: String, enum: ['home', 'plot', 'commercial'], required: true },
    description: { type: String },
    icon: { type: String },
  },
  { timestamps: true }
);

export const Category = mongoose.model('Category', CategorySchema);
