import mongoose from 'mongoose';

const FavoriteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true, index: true },
  },
  { timestamps: true }
);

FavoriteSchema.index({ user: 1, property: 1 }, { unique: true });

export const Favorite = mongoose.model('Favorite', FavoriteSchema);
