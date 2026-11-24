import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export const uploadImages = async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      res.status(400).json({ success: false, message: 'No image files uploaded.' });
      return;
    }

    const uploadedUrls = [];

    const hasCloudinary =
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET;

    for (const file of files) {
      if (hasCloudinary) {
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'pakproperty/properties',
            transformation: [{ width: 1200, height: 800, crop: 'limit', quality: 'auto' }],
          });
          fs.unlinkSync(file.path);
          uploadedUrls.push({ url: result.secure_url, caption: file.originalname });
          continue;
        } catch (cloudErr) {
          console.warn('Cloudinary upload failed, falling back to local storage:', cloudErr);
        }
      }

      const localUrl = `/uploads/${file.filename}`;
      uploadedUrls.push({ url: localUrl, caption: file.originalname });
    }

    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully!',
      data: uploadedUrls,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Image upload failed.' });
  }
};
