'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Shield,
  Camera,
  Save,
  Edit,
  Lock,
  Globe,
  Home,
  Building,
  CheckCircle,
  AlertCircle,
  Upload,
  X
} from 'lucide-react';
import CustomSelect from '@/components/dashboard/Admin/CustomSelect';

export default function AccountPage() {
  // User data state
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    bio: '',
    company: '',
    website: '',
    joinDate: ''
  });

  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Countries list (for dropdown)
  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 
    'France', 'Spain', 'Italy', 'Dominican Republic', 'Mexico', 'Brazil'
  ];

  // Cities in Dominican Republic
  const dominicanCities = [
    'Punta Cana', 'Santo Domingo', 'Puerto Plata', 'La Romana',
    'Santiago', 'Bavaro', 'Cap Cana', 'Juanillo', 'Macao',
    'Cabeza de Toro', 'Cortecito', 'Uvero Alto'
  ];

  // Country options for CustomSelect
  const countryOptions = countries.map(country => ({
    value: country,
    label: country
  }));

  // City options for CustomSelect
  const cityOptions = dominicanCities.map(city => ({
    value: city,
    label: city
  }));

  // Load user data
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        const mockUserData = {
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1 (809) 555-0123',
          address: '123 Beach Road',
          city: 'Punta Cana',
          country: 'Dominican Republic',
          bio: 'Property owner specializing in luxury vacation rentals in Punta Cana. Over 5 years of experience in real estate management.',
          company: 'Punta Cana Luxury Properties',
          website: 'https://puntacanaluxury.com',
          joinDate: '2022-05-15',
          profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop'
        };
        
        setUserData(mockUserData);
        setFormData(mockUserData);
        setImagePreview(mockUserData.profileImage);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, image: 'Please upload an image file' }));
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'Image size should be less than 5MB' }));
      return;
    }

    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Clear image error
    if (errors.image) {
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  // Remove uploaded image
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(userData.profileImage);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name?.trim()) newErrors.name = 'Name is required';
    if (!formData.email?.trim()) newErrors.email = 'Email is required';
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[^\d+]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSaving(true);
    setSuccessMessage('');

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Append form data
      Object.keys(formData).forEach(key => {
        if (key !== 'profileImage') {
          submitData.append(key, formData[key]);
        }
      });
      
      // Append image if uploaded
      if (imageFile) {
        submitData.append('profileImage', imageFile);
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update user data
      const updatedData = {
        ...formData,
        profileImage: imagePreview
      };
      
      setUserData(updatedData);
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({ submit: 'Failed to update profile. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setFormData(userData);
    setImagePreview(userData.profileImage);
    setImageFile(null);
    setIsEditing(false);
    setErrors({});
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="h-64 bg-gray-200 rounded-xl"></div>
            </div>
            <div className="lg:col-span-2">
              <div className="h-96 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
              <p className="text-gray-600">Manage your profile and account settings</p>
            </div>
            
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 bg-[#1F3A34] text-white rounded-lg hover:bg-[#2a4d45] transition-colors"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="profile-form"
                  disabled={saving}
                  className="flex items-center px-4 py-2 bg-[#1F3A34] text-white rounded-lg hover:bg-[#2a4d45] disabled:opacity-50 transition-colors"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <p className="text-green-800 font-medium">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <div className="mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
                <p className="text-red-800">{errors.submit}</p>
              </div>
            </div>
          </div>
        )}

        <form id="profile-form" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="text-center">
                  {/* Profile Image */}
                  <div className="relative inline-block mb-4">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <img
                        src={imagePreview}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {isEditing && (
                      <>
                        <label className="absolute bottom-2 right-2 p-2 bg-[#1F3A34] text-white rounded-full cursor-pointer hover:bg-[#2a4d45] transition-colors">
                          <Camera className="h-4 w-4" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                        
                        {imageFile && (
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </>
                    )}
                  </div>

                  {errors.image && (
                    <p className="text-sm text-red-600 mt-2">{errors.image}</p>
                  )}

                  <h2 className="text-xl font-bold text-gray-900">
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full text-center text-xl font-bold border-b pb-1 focus:outline-none focus:border-[#1F3A34] ${
                          errors.name ? 'border-red-300' : 'border-transparent'
                        }`}
                      />
                    ) : (
                      userData.name
                    )}
                  </h2>
                  
                  {errors.name && (
                    <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                  )}

                  <p className="text-gray-600 mt-1">
                    {isEditing ? (
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Company name"
                        className="w-full text-center text-gray-600 border-b pb-1 focus:outline-none focus:border-[#1F3A34] border-transparent"
                      />
                    ) : (
                      userData.company || 'Property Owner'
                    )}
                  </p>

                  <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    Member since {formatDate(userData.joinDate)}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-medium text-gray-900 mb-3">Account Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Verified Email</span>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Phone Verified</span>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Account Type</span>
                      <span className="font-medium text-[#1F3A34]">Property Owner</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Security Card */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Account Security
                </h3>
                
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium text-blue-800">Email Verification</p>
                    <p className="text-sm text-blue-700 mt-1">Your email is verified</p>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => console.log('Change password')}
                    className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <Lock className="h-5 w-5 text-gray-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Change Password</p>
                        <p className="text-sm text-gray-600">Update your password</p>
                      </div>
                    </div>
                    <div className="text-gray-400">→</div>
                  </button>
                  
                  {/* <button
                    type="button"
                    onClick={() => console.log('Two-factor auth')}
                    className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-gray-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Two-Factor Auth</p>
                        <p className="text-sm text-gray-600">Add extra security</p>
                      </div>
                    </div>
                    <div className="text-gray-400">→</div>
                  </button> */}
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border">
                {/* Form Header */}
                <div className="px-6 py-4 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Update your personal and contact information
                  </p>
                </div>

                {/* Form Body */}
                <div className="p-6 space-y-8">
                  {/* Personal Information */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Personal Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1F3A34] focus:border-transparent ${
                              errors.name ? 'border-red-300' : 'border-gray-300'
                            }`}
                          />
                        ) : (
                          <div className="px-4 py-3 bg-gray-50 rounded-lg">
                            {userData.name}
                          </div>
                        )}
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        {isEditing ? (
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1F3A34] focus:border-transparent ${
                              errors.email ? 'border-red-300' : 'border-gray-300'
                            }`}
                          />
                        ) : (
                          <div className="px-4 py-3 bg-gray-50 rounded-lg flex items-center">
                            <Mail className="h-4 w-4 text-gray-400 mr-2" />
                            {userData.email}
                          </div>
                        )}
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        {isEditing ? (
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1F3A34] focus:border-transparent ${
                              errors.phone ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="+1 (809) 555-0123"
                          />
                        ) : (
                          <div className="px-4 py-3 bg-gray-50 rounded-lg flex items-center">
                            <Phone className="h-4 w-4 text-gray-400 mr-2" />
                            {userData.phone}
                          </div>
                        )}
                        {errors.phone && (
                          <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                        )}
                      </div>

                      {/* Company */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F3A34] focus:border-transparent"
                            placeholder="Your company name"
                          />
                        ) : (
                          <div className="px-4 py-3 bg-gray-50 rounded-lg flex items-center">
                            <Building className="h-4 w-4 text-gray-400 mr-2" />
                            {userData.company || 'Not specified'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Location Information */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Location Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Address */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F3A34] focus:border-transparent"
                            placeholder="Street address"
                          />
                        ) : (
                          <div className="px-4 py-3 bg-gray-50 rounded-lg flex items-center">
                            <Home className="h-4 w-4 text-gray-400 mr-2" />
                            {userData.address}
                          </div>
                        )}
                      </div>

                      {/* City */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        {isEditing ? (
                          <CustomSelect
                            value={formData.city || ''}
                            options={[{ value: '', label: 'Select City' }, ...cityOptions]}
                            onChange={(value) => handleSelectChange('city', value)}
                            className="w-full"
                            variant="admin"
                          />
                        ) : (
                          <div className="px-4 py-3 bg-gray-50 rounded-lg">
                            {userData.city}
                          </div>
                        )}
                      </div>

                      {/* Country */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country
                        </label>
                        {isEditing ? (
                          <CustomSelect
                            value={formData.country || ''}
                            options={[{ value: '', label: 'Select Country' }, ...countryOptions]}
                            onChange={(value) => handleSelectChange('country', value)}
                            className="w-full"
                            variant="admin"
                          />
                        ) : (
                          <div className="px-4 py-3 bg-gray-50 rounded-lg">
                            {userData.country}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bio & Website */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">About & Website</h3>
                    
                    <div className="space-y-6">
                      {/* Bio */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bio / Description
                        </label>
                        {isEditing ? (
                          <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F3A34] focus:border-transparent"
                            placeholder="Tell us about yourself and your experience..."
                          />
                        ) : (
                          <div className="px-4 py-3 bg-gray-50 rounded-lg">
                            <p className="text-gray-700 whitespace-pre-line">
                              {userData.bio}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Website */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Website
                        </label>
                        {isEditing ? (
                          <input
                            type="url"
                            name="website"
                            value={formData.website}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F3A34] focus:border-transparent"
                            placeholder="https://example.com"
                          />
                        ) : (
                          <div className="px-4 py-3 bg-gray-50 rounded-lg flex items-center">
                            <Globe className="h-4 w-4 text-gray-400 mr-2" />
                            <a 
                              href={userData.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[#1F3A34] hover:text-[#2a4d45]"
                            >
                              {userData.website}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Footer */}
                {isEditing && (
                  <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2 bg-[#1F3A34] text-white rounded-lg hover:bg-[#2a4d45] disabled:opacity-50 transition-colors flex items-center"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving Changes...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Danger Zone */}
              {!isEditing && (
                <div className="mt-6 bg-white rounded-xl shadow-sm border border-red-200">
                  <div className="px-6 py-4 border-b border-red-200">
                    <h3 className="font-semibold text-red-800">Danger Zone</h3>
                    <p className="text-sm text-red-600 mt-1">
                      Irreversible actions - proceed with caution
                    </p>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <p className="font-medium text-gray-900">Delete Account</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Permanently delete your account and all associated data
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => console.log('Delete account')}
                        className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}