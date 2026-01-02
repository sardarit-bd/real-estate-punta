'use client';

import React, { useState, useEffect } from 'react';
import { 
  Home, MapPin, DollarSign, Bed, Bath, 
  Upload, X, Star, Calendar, Ruler,
  Loader2
} from 'lucide-react';
import CustomSelect from '@/components/dashboard/Admin/CustomSelect';

export default function PropertyForm({
  isEditMode = false,
  initialData = null,
  onSubmit,
  submitting = false,
  errors = {}
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'villa',
    listingType: 'rent',
    price: '',
    pricePeriod: 'night',
    bedrooms: '',
    bathrooms: '',
    area: '',
    areaUnit: 'sqft',
    city: 'Punta Cana',
    address: '',
    featured: false,
    status: 'active',
    amenities: []
  });

  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Property types
  const propertyTypes = [
    { value: 'villa', label: 'Villa', icon: '🏠' },
    { value: 'condo', label: 'Condo/Apartment', icon: '🏢' },
    { value: 'house', label: 'House', icon: '🏡' },
    { value: 'apartment', label: 'Apartment', icon: '🏘️' },
    { value: 'studio', label: 'Studio', icon: '🏭' },
    { value: 'land', label: 'Land', icon: '🌳' }
  ];

  // Cities
  const cities = [
    'Punta Cana', 'Bavaro', 'Cap Cana', 'Macao', 
    'Uvero Alto', 'Cabeza de Toro', 'Cortecito'
  ];

  // Amenities options
  const amenitiesOptions = [
    { value: 'pool', label: 'Swimming Pool' },
    { value: 'gym', label: 'Gym' },
    { value: 'parking', label: 'Parking' },
    { value: 'wifi', label: 'WiFi' },
    { value: 'ac', label: 'Air Conditioning' },
    { value: 'heating', label: 'Heating' },
    { value: 'kitchen', label: 'Kitchen' },
    { value: 'tv', label: 'TV' },
    { value: 'washer', label: 'Washer' },
    { value: 'dryer', label: 'Dryer' },
    { value: 'security', label: 'Security' },
    { value: 'elevator', label: 'Elevator' },
    { value: 'balcony', label: 'Balcony' },
    { value: 'garden', label: 'Garden' },
    { value: 'beach_access', label: 'Beach Access' },
    { value: 'concierge', label: 'Concierge' },
    { value: 'spa', label: 'Spa' },
    { value: 'tennis_court', label: 'Tennis Court' },
    { value: 'bbq_area', label: 'BBQ Area' }
  ];

  // City options for CustomSelect
  const cityOptions = cities.map(city => ({
    value: city,
    label: city
  }));

  // Area unit options
  const areaUnitOptions = [
    { value: 'sqft', label: 'Sq Ft' },
    { value: 'sqm', label: 'Sq M' },
    { value: 'acre', label: 'Acres' }
  ];

  // Price period options
  const pricePeriodOptions = [
    { value: 'night', label: 'Per Night' },
    { value: 'week', label: 'Per Week' },
    { value: 'month', label: 'Per Month' },
    { value: 'year', label: 'Per Year' }
  ];

  // Status options
  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' },
    { value: 'sold', label: 'Sold' },
    { value: 'rented', label: 'Rented' }
  ];

  // Initialize form with initialData
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        type: initialData.type || 'villa',
        listingType: initialData.listingType || 'rent',
        price: initialData.price?.toString() || '',
        pricePeriod: initialData.pricePeriod || 'night',
        bedrooms: initialData.bedrooms?.toString() || '',
        bathrooms: initialData.bathrooms?.toString() || '',
        area: initialData.area?.toString() || '',
        areaUnit: initialData.areaUnit || 'sqft',
        city: initialData.city || 'Punta Cana',
        address: initialData.address || '',
        featured: initialData.featured || false,
        status: initialData.status || 'active',
        amenities: initialData.amenities || []
      });

      if (initialData.images && initialData.images.length > 0) {
        setImages(initialData.images.map((img, index) => ({
          url: img.url,
          publicId: img.publicId,
          isCover: img.isCover || index === 0
        })));
      }
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);

    const newImages = [];
    files.forEach(file => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`);
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Max size is 5MB`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push({
          url: reader.result,
          file: file,
          name: file.name,
          isCover: images.length === 0 && newImages.length === 0
        });
        
        if (newImages.length === files.length) {
          setImages(prev => [...prev, ...newImages]);
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const setCoverImage = (index) => {
    setImages(prev => 
      prev.map((img, i) => ({
        ...img,
        isCover: i === index
      }))
    );
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Prepare final form data with images
    const finalData = {
      ...formData,
      images: images.map(img => ({
        url: img.url,
        isCover: img.isCover
      }))
    };

    onSubmit(finalData);
  };

  // Calculate price label
  const getPriceLabel = () => {
    if (formData.listingType === 'rent') {
      return `$${formData.price || '0'}/${formData.pricePeriod}`;
    } else {
      return `$${formData.price || '0'}`;
    }
  };

  return (
    <form id="property-form" onSubmit={handleFormSubmit}>
      {/* Hidden submit button for external trigger */}
      <button 
        id="property-form-submit" 
        type="submit" 
        style={{ display: 'none' }}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Basic Information
            </h2>
            
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  disabled={submitting}
                  placeholder="e.g., Luxury Beachfront Villa with Private Pool"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#004087] focus:border-transparent ${
                    errors.title ? 'border-red-300' : 'border-gray-300'
                  } ${submitting ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={submitting}
                  rows={4}
                  placeholder="Describe your property in detail..."
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#004087] focus:border-transparent ${
                    errors.description ? 'border-red-300' : 'border-gray-300'
                  } ${submitting ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              {/* Property Type & Listing Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Property Type *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {propertyTypes.map(type => (
                      <label
                        key={type.value}
                        className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all ${
                          formData.type === type.value
                            ? 'border-[#004087] bg-[#004087] text-white'
                            : 'border-gray-300 hover:border-gray-400'
                        } ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <input
                          type="radio"
                          name="type"
                          value={type.value}
                          checked={formData.type === type.value}
                          onChange={handleInputChange}
                          disabled={submitting}
                          className="hidden"
                        />
                        <div className="text-center">
                          <div className="text-xl mb-1">{type.icon}</div>
                          <div className="text-sm font-medium">{type.label}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Listing Type *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${
                      formData.listingType === 'rent'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    } ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <input
                        type="radio"
                        name="listingType"
                        value="rent"
                        checked={formData.listingType === 'rent'}
                        onChange={handleInputChange}
                        disabled={submitting}
                        className="hidden"
                      />
                      <Calendar className="h-6 w-6 mb-2 text-blue-600" />
                      <span className="font-medium">For Rent</span>
                    </label>
                    
                    <label className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${
                      formData.listingType === 'sale'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 hover:border-gray-400'
                    } ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <input
                        type="radio"
                        name="listingType"
                        value="sale"
                        checked={formData.listingType === 'sale'}
                        onChange={handleInputChange}
                        disabled={submitting}
                        className="hidden"
                      />
                      <DollarSign className="h-6 w-6 mb-2 text-green-600" />
                      <span className="font-medium">For Sale</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <CustomSelect
                  value={formData.status}
                  options={statusOptions}
                  onChange={(value) => handleSelectChange('status', value)}
                  className="w-full"
                  variant="admin"
                  disabled={submitting}
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Location
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <CustomSelect
                  value={formData.city}
                  options={cityOptions}
                  onChange={(value) => handleSelectChange('city', value)}
                  className="w-full"
                  variant="admin"
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area (Optional)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    disabled={submitting}
                    placeholder="0"
                    min="0"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004087] focus:border-transparent"
                  />
                  <div className="w-32">
                    <CustomSelect
                      value={formData.areaUnit}
                      options={areaUnitOptions}
                      onChange={(value) => handleSelectChange('areaUnit', value)}
                      className="w-full"
                      variant="compact"
                      disabled={submitting}
                    />
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={submitting}
                  placeholder="Enter full address"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#004087] focus:border-transparent ${
                    errors.address ? 'border-red-300' : 'border-gray-300'
                  } ${submitting ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Property Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    disabled={submitting}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#004087] focus:border-transparent ${
                      errors.price ? 'border-red-300' : 'border-gray-300'
                    } ${submitting ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                )}
                
                {formData.listingType === 'rent' && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Period
                    </label>
                    <CustomSelect
                      value={formData.pricePeriod}
                      options={pricePeriodOptions}
                      onChange={(value) => handleSelectChange('pricePeriod', value)}
                      className="w-full"
                      variant="admin"
                      disabled={submitting}
                    />
                  </div>
                )}
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Bed className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    disabled={submitting}
                    placeholder="0"
                    min="0"
                    max="50"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#004087] focus:border-transparent ${
                      errors.bedrooms ? 'border-red-300' : 'border-gray-300'
                    } ${submitting ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  />
                </div>
                {errors.bedrooms && (
                  <p className="mt-1 text-sm text-red-600">{errors.bedrooms}</p>
                )}
              </div>

              {/* Bathrooms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bathrooms *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Bath className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    disabled={submitting}
                    placeholder="0"
                    min="0"
                    max="50"
                    step="0.5"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#004087] focus:border-transparent ${
                      errors.bathrooms ? 'border-red-300' : 'border-gray-300'
                    } ${submitting ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  />
                </div>
                {errors.bathrooms && (
                  <p className="mt-1 text-sm text-red-600">{errors.bathrooms}</p>
                )}
              </div>
            </div>

            {/* Amenities */}
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-md font-semibold text-gray-900 mb-4">Amenities (Optional)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {amenitiesOptions.map(amenity => (
                  <label
                    key={amenity.value}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                      formData.amenities.includes(amenity.value)
                        ? 'border-[#004087] bg-[#004087] text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    } ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <input
                      type="checkbox"
                      value={amenity.value}
                      checked={formData.amenities.includes(amenity.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            amenities: [...prev.amenities, amenity.value]
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            amenities: prev.amenities.filter(a => a !== amenity.value)
                          }));
                        }
                      }}
                      disabled={submitting}
                      className="hidden"
                    />
                    <span className="text-sm font-medium">{amenity.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Images & Features */}
        <div className="space-y-6">
          {/* Images Upload */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Property Photos *
            </h2>
            
            {/* Clickable Upload Area */}
            <input
              type="file"
              id="image-upload"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              disabled={submitting || uploading}
              className="hidden"
            />
            
            <label
              htmlFor="image-upload"
              className={`block cursor-pointer ${errors.images ? 'border-red-300' : ''} ${
                (submitting || uploading) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <div className={`aspect-video rounded-lg border-2 border-dashed flex flex-col items-center justify-center p-8 transition-all ${
                errors.images ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-[#004087] hover:bg-gray-50'
              }`}>
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#004087] mb-4"></div>
                    <p className="text-gray-600">Uploading images...</p>
                  </>
                ) : (
                  <>
                    <div className="p-3 bg-blue-50 rounded-full mb-4">
                      <Upload className="h-8 w-8 text-blue-600" />
                    </div>
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      Click to upload photos
                    </p>
                    <p className="text-gray-600 text-center">
                      Upload high-quality photos of your property
                      <br />
                      <span className="text-sm">Max 5MB per image</span>
                    </p>
                  </>
                )}
              </div>
            </label>
            
            {errors.images && (
              <p className="mt-2 text-sm text-red-600">{errors.images}</p>
            )}
            
            <p className="mt-4 text-sm text-gray-500">
              Upload at least 3 high-quality images. First image will be used as cover.
            </p>

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Uploaded Images ({images.length})
                  </label>
                  {!submitting && !uploading && (
                    <button
                      type="button"
                      onClick={() => document.getElementById('image-upload').click()}
                      className="text-sm text-[#004087] hover:text-[#003366] font-medium"
                    >
                      Add More
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={image.url}
                          alt={`Property ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                      {!submitting && (
                        <>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setCoverImage(index)}
                            className="absolute top-1 left-1 px-2 py-0.5 text-xs rounded cursor-pointer"
                          >
                            {image.isCover ? (
                              <span className="bg-blue-500 text-white px-2 py-0.5 rounded text-xs">
                                Cover
                              </span>
                            ) : (
                              <span className="bg-gray-800 text-white px-2 py-0.5 rounded text-xs opacity-0 group-hover:opacity-100">
                                Set Cover
                              </span>
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Featured Listing */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">Featured Listing</h3>
                <p className="text-sm text-gray-600">Get more visibility</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  disabled={submitting}
                  className="sr-only peer"
                />
                <div className={`w-12 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500 ${
                  submitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}></div>
              </label>
            </div>

            {formData.featured && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-start space-x-3">
                  <Star className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-yellow-800">Featured Benefits</p>
                    <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                      <li>• Top placement in search results</li>
                      <li>• 3x more views</li>
                      <li>• Featured badge</li>
                      <li>• Priority support</li>
                    </ul>
                    <p className="mt-3 font-bold text-yellow-800">
                      $24.99/month
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Preview Card */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Live Preview</h3>
            
            <div className="space-y-4">
              {/* Image Preview */}
              <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                {images[0] ? (
                  <img
                    src={images[0].url}
                    alt="Property preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Home className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Details Preview */}
              <div className="space-y-3">
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">
                    {formData.title || 'Property Title'}
                  </h4>
                  <div className="flex items-center text-gray-600 text-sm mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {formData.address || 'Address will appear here'}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Bed className="h-4 w-4 mr-1 text-gray-500" />
                      <span className="text-sm">
                        {formData.bedrooms || '0'} bed
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="h-4 w-4 mr-1 text-gray-500" />
                      <span className="text-sm">
                        {formData.bathrooms || '0'} bath
                      </span>
                    </div>
                    {formData.area && (
                      <div className="flex items-center">
                        <Ruler className="h-4 w-4 mr-1 text-gray-500" />
                        <span className="text-sm">
                          {formData.area} {formData.areaUnit}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xl text-gray-900">
                        {getPriceLabel()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formData.listingType === 'rent' ? 'Rental Price' : 'Sale Price'}
                      </div>
                    </div>
                    {formData.featured && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button inside form for mobile view */}
          <div className="lg:hidden bg-white rounded-xl shadow-sm border p-6">
            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3 bg-[#004087] text-white rounded-lg hover:bg-[#004797] flex items-center justify-center transition-colors ${
                submitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : isEditMode ? (
                'Update Property'
              ) : (
                'Create Property'
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}