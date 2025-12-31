'use client';

import { Mail, MapPin, Phone, User, Home } from "lucide-react";
import { useState, useEffect } from "react";
import CustomSelect from "../../Admin/CustomSelect";

export function PersonalInfo({ user, editMode, onSave, loading }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    location: {
      address: '',
      city: '',
      state: '',
      zip: '',
      country: '',
    }
  });

  // Initialize form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        company: user.company || '',
        location: {
          address: user.location?.address || '',
          city: user.location?.city || '',
          state: user.location?.state || '',
          zip: user.location?.zip || '',
          country: user.location?.country || '',
        }
      });
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested location fields
    if (name.startsWith('location.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleLocationChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value
      }
    }));
  };

  // Country options
  const countryOptions = [
    { value: '', label: 'Select Country' },
    { value: 'United States', label: 'United States' },
    { value: 'Canada', label: 'Canada' },
    { value: 'United Kingdom', label: 'United Kingdom' },
    { value: 'Australia', label: 'Australia' },
    { value: 'Germany', label: 'Germany' },
    { value: 'France', label: 'France' },
    { value: 'Spain', label: 'Spain' },
    { value: 'Italy', label: 'Italy' },
    { value: 'Japan', label: 'Japan' },
    { value: 'China', label: 'China' },
    { value: 'India', label: 'India' },
    { value: 'Bangladesh', label: 'Bangladesh' }
  ];

  // City options
  const cityOptions = [
    { value: '', label: 'Select City' },
    { value: 'New York', label: 'New York' },
    { value: 'Los Angeles', label: 'Los Angeles' },
    { value: 'Chicago', label: 'Chicago' },
    { value: 'Houston', label: 'Houston' },
    { value: 'Phoenix', label: 'Phoenix' },
    { value: 'Philadelphia', label: 'Philadelphia' },
    { value: 'San Antonio', label: 'San Antonio' },
    { value: 'San Diego', label: 'San Diego' },
    { value: 'Dallas', label: 'Dallas' },
    { value: 'San Jose', label: 'San Jose' },
    { value: 'Punta Cana', label: 'Punta Cana' },
    { value: 'Dhaka', label: 'Dhaka' },
    { value: 'Chittagong', label: 'Chittagong' },
    { value: 'London', label: 'London' },
    { value: 'Toronto', label: 'Toronto' },
    { value: 'Sydney', label: 'Sydney' },
    { value: 'Berlin', label: 'Berlin' },
    { value: 'Paris', label: 'Paris' },
    { value: 'Madrid', label: 'Madrid' },
    { value: 'Rome', label: 'Rome' },
    { value: 'Tokyo', label: 'Tokyo' },
    { value: 'Beijing', label: 'Beijing' },
    { value: 'Mumbai', label: 'Mumbai' }
  ];

  return (
    <div>
      {editMode ? (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Company */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Company
                </label>
                <div className="relative">
                  <Home className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="border-t pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              Location Information
            </h3>

            {/* Address Field */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <textarea
                  name="location.address"
                  value={formData.location.address}
                  onChange={handleChange}
                  rows="3"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none disabled:opacity-50"
                  placeholder="Enter your complete address"
                  disabled={loading}
                />
              </div>
            </div>

            {/* City, State, Zip, Country Fields in Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* City */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <CustomSelect
                  value={formData.location.city}
                  onChange={(value) => handleLocationChange('city', value)}
                  options={cityOptions}
                  className="w-full disabled:opacity-50"
                  variant="admin"
                  disabled={loading}
                />
              </div>

              {/* State */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  State
                </label>
                <input
                  type="text"
                  name="location.state"
                  value={formData.location.state}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  placeholder="State"
                  disabled={loading}
                />
              </div>

              {/* Zip Code */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Zip Code
                </label>
                <input
                  type="text"
                  name="location.zip"
                  value={formData.location.zip}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  placeholder="Zip Code"
                  disabled={loading}
                />
              </div>

              {/* Country */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <CustomSelect
                  value={formData.location.country}
                  onChange={(value) => handleLocationChange('country', value)}
                  options={countryOptions}
                  className="w-full disabled:opacity-50"
                  variant="admin"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-8">
          {/* Personal Information Display */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Full Name *
                </label>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <User className="h-5 w-5 text-gray-500 mr-3" />
                  <span className="font-medium text-gray-900">
                    {user.name || 'Not provided'}
                  </span>
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <Phone className="h-5 w-5 text-gray-500 mr-3" />
                  <span className="font-medium text-gray-900">
                    {user.phone || 'Not provided'}
                  </span>
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email Address *
                </label>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <Mail className="h-5 w-5 text-gray-500 mr-3" />
                  <span className="font-medium text-gray-900">
                    {user.email || 'Not provided'}
                  </span>
                </div>
              </div>

              {/* Company */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Company
                </label>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <Home className="h-5 w-5 text-gray-500 mr-3" />
                  <span className="font-medium text-gray-900">
                    {user.company || 'Not provided'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Location Information Display */}
          <div className="border-t pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              Location Information
            </h3>
            
            {user.location?.address ? (
              <div className="space-y-6">
                {/* Address */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex">
                      <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
                      <p className="font-medium text-gray-900 leading-relaxed">
                        {user.location.address}
                      </p>
                    </div>
                  </div>
                </div>

                {/* City, Country Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* City */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="font-medium text-gray-900">
                        {user.location.city || 'Not provided'}
                      </p>
                    </div>
                  </div>

                  {/* Country */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Country
                    </label>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="font-medium text-gray-900">
                        {user.location.country || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* State and Zip Code */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* State */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      State
                    </label>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="font-medium text-gray-900">
                        {user.location.state || 'Not provided'}
                      </p>
                    </div>
                  </div>

                  {/* Zip Code */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Zip Code
                    </label>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="font-medium text-gray-900">
                        {user.location.zip || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-gray-600">No location information added yet</p>
                <p className="text-sm text-gray-500 mt-2">Click "Edit Profile" to add location details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}