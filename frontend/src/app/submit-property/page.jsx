'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import {
  Upload,
  PlusCircle,
  X,
  CheckCircle2,
  Loader2,
  Sparkles,
} from 'lucide-react';

const CITIES_AREAS = {
  Islamabad: [
    'DHA Phase 2',
    'Sector F-7',
    'Sector F-10',
    'Sector F-11',
    'Sector G-11',
    'Sector G-13',
    'Sector E-11',
    'Bahria Town Phase 8',
    'Gulberg Greens',
    'Park View City',
    'B-17 Multi Gardens',
  ],
  Lahore: [
    'DHA Phase 5',
    'DHA Phase 6',
    'DHA Phase 7',
    'Gulberg III',
    'Bahria Town',
    'Johar Town',
    'Model Town',
    'Cantt',
    'Lake City',
    'Wapda Town',
  ],
  Karachi: [
    'DHA Phase 5',
    'DHA Phase 6',
    'Clifton Block 2',
    'Clifton Block 4',
    'Bahria Town Karachi',
    'Gulshan-e-Iqbal',
    'PECHS',
    'North Nazimabad',
  ],
  Rawalpindi: [
    'Bahria Town Phase 4',
    'Bahria Town Phase 7',
    'Chaklala Scheme 3',
    'Saddar',
    'Westridge 1',
    'Gulraiz Housing Scheme',
  ],
  Peshawar: ['Hayatabad Phase 3', 'Hayatabad Phase 5', 'University Town', 'Regi Model Town', 'DHA Peshawar'],
};

const AMENITIES_LIST = [
  'Electricity Backup (UPS/Generator)',
  'Sui Gas',
  'Water Supply',
  'Sewerage',
  'Security Staff',
  'CCTV Security',
  'Servant Quarters',
  'Lawn or Garden',
  'Double Glazed Windows',
  'Central Air Conditioning',
  'Central Heating',
  'Elevator or Lift',
  'Swimming Pool',
  'Covered Parking',
  'Gymnasium',
  'Mosque Nearby',
  'Nearby Schools',
  'Nearby Hospitals',
  'Nearby Shopping Malls',
  'Broadband Internet Access',
];

export default function SubmitPropertyPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [purpose, setPurpose] = useState('sale');
  const [category, setCategory] = useState('home');
  const [propertyType, setPropertyType] = useState('house');
  const [title, setTitle] = useState('');
  const [city, setCity] = useState('Islamabad');
  const [area, setArea] = useState('DHA Phase 2');
  const [customArea, setCustomArea] = useState('');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState('');
  const [areaSize, setAreaSize] = useState('10');
  const [areaUnit, setAreaUnit] = useState('marla');
  const [bedrooms, setBedrooms] = useState('4');
  const [bathrooms, setBathrooms] = useState('4');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState([
    'Electricity Backup (UPS/Generator)',
    'Sui Gas',
    'Water Supply',
    'Security Staff',
    'Covered Parking',
  ]);

  // Image uploads state
  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-format price display
  const formatPricePreview = (val) => {
    const num = Number(val);
    if (!num || isNaN(num)) return '';
    if (num >= 10000000) {
      return `≈ PKR ${(num / 10000000).toFixed(2)} Crore`;
    } else if (num >= 100000) {
      return `≈ PKR ${(num / 100000).toFixed(2)} Lakh`;
    }
    return `≈ PKR ${num.toLocaleString('en-PK')}`;
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      setImageFiles((prev) => [...prev, ...selected]);

      const newPreviews = selected.map((f) => URL.createObjectURL(f));
      setPreviewUrls((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleFeature = (feature) => {
    setFeatures((prev) =>
      prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please sign in or register to submit a property listing.');
      router.push('/login');
      return;
    }

    if (!title || !price || !areaSize || !description) {
      toast.error('Please complete all required fields.');
      return;
    }

    try {
      setIsSubmitting(true);

      let uploadedImages = [];

      if (imageFiles.length > 0) {
        toast.info('Uploading property photos...');
        const uploadRes = await api.upload.images(imageFiles);
        if (uploadRes.success && uploadRes.data) {
          uploadedImages = uploadRes.data;
        }
      }

      // Default placeholder if no files chosen
      if (uploadedImages.length === 0) {
        uploadedImages = [
          {
            url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
            caption: 'Front Elevation',
          },
        ];
      }

      const finalArea = customArea ? customArea : area;

      const propertyPayload = {
        title,
        purpose,
        category,
        propertyType,
        price: Number(price),
        location: {
          city,
          area: finalArea,
          address: address || `${finalArea}, ${city}`,
        },
        areaSize: Number(areaSize),
        areaUnit,
        bedrooms: category === 'plot' ? 0 : Number(bedrooms),
        bathrooms: category === 'plot' ? 0 : Number(bathrooms),
        description,
        features,
        images: uploadedImages,
        featuredImage: uploadedImages[0]?.url,
      };

      const res = await api.properties.create(propertyPayload);
      if (res.success) {
        toast.success(res.message || 'Property submitted successfully!');
        router.push('/dashboard/my-properties');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit property.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 text-white p-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold bg-white/20 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>List with Pakistan's #1 Real Estate Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Post Your Property Listing</h1>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-xl">
            Reach hundreds of thousands of active buyers and tenants. Verified listings receive up to 5x more inquiries.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
          {/* 1. Purpose & Category */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              1. Property Purpose & Category
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                  Purpose
                </label>
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setPurpose('sale')}
                    className={`py-2 text-xs font-bold rounded-lg transition ${
                      purpose === 'sale'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    For Sale
                  </button>
                  <button
                    type="button"
                    onClick={() => setPurpose('rent')}
                    className={`py-2 text-xs font-bold rounded-lg transition ${
                      purpose === 'rent'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    For Rent
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                  Category
                </label>
                <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-xl">
                  {['home', 'plot', 'commercial'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`py-2 text-xs font-bold capitalize rounded-lg transition ${
                        category === cat
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Property Type Dropdown */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Property Sub-Type
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-4 py-2.5 text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {category === 'home' && (
                  <>
                    <option value="house">House / Bungalow</option>
                    <option value="flat">Flat / Apartment</option>
                    <option value="upper_portion">Upper Portion</option>
                    <option value="lower_portion">Lower Portion</option>
                    <option value="farm_house">Farm House</option>
                    <option value="penthouse">Penthouse</option>
                  </>
                )}
                {category === 'plot' && (
                  <>
                    <option value="residential_plot">Residential Plot</option>
                    <option value="commercial_plot">Commercial Plot</option>
                    <option value="agricultural_land">Agricultural Land</option>
                    <option value="plot_file">Plot File</option>
                  </>
                )}
                {category === 'commercial' && (
                  <>
                    <option value="office">Commercial Office</option>
                    <option value="shop">Shop</option>
                    <option value="building">Commercial Building / Plaza</option>
                    <option value="warehouse">Warehouse / Factory</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* 2. Title & Location */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              2. Title & Pakistani Location
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Listing Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 10 Marla Brand New Modern House in DHA Phase 2"
                required
                className="w-full px-4 py-3 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  City *
                </label>
                <select
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    const areas = CITIES_AREAS[e.target.value] || [];
                    if (areas.length > 0) setArea(areas[0]);
                  }}
                  className="w-full px-4 py-2.5 text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {Object.keys(CITIES_AREAS).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                  <option value="Faisalabad">Faisalabad</option>
                  <option value="Multan">Multan</option>
                  <option value="Quetta">Quetta</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Popular Society / Sector *
                </label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {(CITIES_AREAS[city] || ['Main Boulevard', 'Cantt']).map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                  <option value="Other">Other / Custom Area</option>
                </select>
              </div>
            </div>

            {area === 'Other' && (
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Enter Custom Locality / Sector Name
                </label>
                <input
                  type="text"
                  value={customArea}
                  onChange={(e) => setCustomArea(e.target.value)}
                  placeholder="e.g. Multi Gardens B-17 Block C"
                  className="w-full px-4 py-2.5 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Complete Street Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Street 14, Sector B, DHA Phase 2, Islamabad"
                className="w-full px-4 py-2.5 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* 3. Pricing & Specs */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              3. Pricing & Covered Dimensions
            </h3>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase text-slate-600">
                  Total Price (PKR) *
                </label>
                {price && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {formatPricePreview(price)}
                  </span>
                )}
              </div>
              <div className="relative">
                <span className="text-xs font-bold text-slate-500 absolute left-4 top-1/2 -translate-y-1/2">
                  PKR
                </span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 42500000 (for 4.25 Crore)"
                  required
                  min={1000}
                  className="w-full pl-14 pr-4 py-3 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Area Size *
                </label>
                <input
                  type="number"
                  value={areaSize}
                  onChange={(e) => setAreaSize(e.target.value)}
                  placeholder="10"
                  required
                  min={1}
                  className="w-full px-4 py-2.5 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Area Unit
                </label>
                <select
                  value={areaUnit}
                  onChange={(e) => setAreaUnit(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="marla">Marla (225 / 250 sq ft)</option>
                  <option value="kanal">Kanal (20 Marla)</option>
                  <option value="sqft">Square Feet</option>
                  <option value="sqyard">Square Yards</option>
                </select>
              </div>

              {category !== 'plot' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                      Bedrooms
                    </label>
                    <select
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                      className="w-full px-2 py-2.5 text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                      Baths
                    </label>
                    <select
                      value={bathrooms}
                      onChange={(e) => setBathrooms(e.target.value)}
                      className="w-full px-2 py-2.5 text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 4. Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              4. Property Description
            </h3>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a comprehensive description of the property, construction quality, woodwork, fixtures, flooring, location advantages, nearby amenities, and clear title deed status..."
              required
              className="w-full p-4 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* 5. Amenities Checklist */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              5. Amenities & Features
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {AMENITIES_LIST.map((feat) => {
                const isSelected = features.includes(feat);
                return (
                  <button
                    key={feat}
                    type="button"
                    onClick={() => toggleFeature(feat)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold text-left transition ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 ${
                        isSelected ? 'text-emerald-600' : 'text-slate-300'
                      }`}
                    />
                    <span className="truncate">{feat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Photo Uploads */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              6. Property Photos
            </h3>

            <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-8 text-center bg-slate-50 transition cursor-pointer relative">
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800">
                Click to browse or drag and drop photos
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Upload up to 10 high-resolution photos (JPG, PNG, WEBP up to 10MB each)
              </p>
            </div>

            {/* Previews */}
            {previewUrls.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pt-3">
                {previewUrls.map((url, i) => (
                  <div key={i} className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 group">
                    <img src={url} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center opacity-80 hover:opacity-100 transition shadow"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Your listing will be reviewed by our moderation team and published upon approval.
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/30 transition transform active:scale-98 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Listing...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Submit Property Listing</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
