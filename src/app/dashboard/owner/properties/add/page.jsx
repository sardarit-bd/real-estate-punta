'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, CheckCircle, AlertCircle, Loader2 
} from 'lucide-react';
import Link from 'next/link';
import PropertyForm from './PropertyForm.jsx';
import { toast } from 'react-hot-toast';
import { propertyService } from '@/services/propertyService';
import { useAuthContext } from '@/providers/AuthProvider.jsx';

export default function AddEditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading } = useAuthContext();
  
  const isEditMode = !!params.id;
  const propertyId = params.id;

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [propertyData, setPropertyData] = useState(null);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  // Check authentication
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Please login to continue');
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Load property data if in edit mode
  useEffect(() => {
    if (isEditMode && user) {
      fetchPropertyData();
    }
  }, [isEditMode, propertyId, user]);

  const fetchPropertyData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const response = await propertyService.getProperty(propertyId, token);
      
      if (response.success) {
        setPropertyData(response.data);
        
        // Check if user owns this property (for edit mode)
        if (isEditMode && user && response.data.owner?._id !== user.id && response.data.owner?._id !== user._id) {
          toast.error('You are not authorized to edit this property');
          router.push('/dashboard/owner/properties');
        }
      } else {
        throw new Error(response.message || 'Failed to fetch property');
      }
    } catch (error) {
      console.error('Error fetching property:', error);
      
      // Specific error handling
      if (error.message.includes('unauthorized') || error.message.includes('401')) {
        toast.error('Session expired. Please login again.');
        router.push('/login');
      } else if (error.message.includes('not found') || error.message.includes('404')) {
        toast.error('Property not found');
        router.push('/dashboard/owner/properties');
      } else {
        toast.error(error.message || 'Failed to load property');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    if (!user) {
      toast.error('Please login to continue');
      router.push('/login');
      return;
    }

    setSubmitting(true);
    setErrors({});
    setSuccess(false);

    try {
      // Prepare form data
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseFloat(formData.bathrooms),
        area: formData.area ? parseFloat(formData.area) : undefined,
        // Handle amenities if selected
        amenities: formData.amenities || [],
      };

      // Get token if using JWT
      const token = localStorage.getItem('token');
      
      let response;
      
      if (isEditMode) {
        // Update property
        response = await propertyService.updateProperty(propertyId, submitData, token);
      } else {
        // Create new property
        response = await propertyService.createProperty(submitData, token);
      }

      if (response.success) {
        const successMessage = isEditMode 
          ? 'Property updated successfully!' 
          : 'Property created successfully!';
        
        toast.success(successMessage);
        setSuccess(true);

        // Redirect after 1.5 seconds
        setTimeout(() => {
          router.push('/dashboard/owner/properties');
        }, 1500);
      } else {
        throw new Error(response.message || `Failed to ${isEditMode ? 'update' : 'create'} property`);
      }
    } catch (error) {
      console.error('Error submitting property:', error);
      
      // Handle validation errors
      if (error.response?.data?.errors) {
        const validationErrors = {};
        
        Object.keys(error.response.data.errors).forEach(key => {
          validationErrors[key] = error.response.data.errors[key].message || 
                                 error.response.data.errors[key];
        });
        
        setErrors(validationErrors);
        
        // Show first error in toast
        const firstError = Object.values(validationErrors)[0];
        if (firstError) {
          toast.error(firstError);
        }
      } else {
        toast.error(error.message || `Failed to ${isEditMode ? 'update' : 'create'} property`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (submitting) {
      const confirm = window.confirm('Are you sure you want to cancel? Changes may not be saved.');
      if (confirm) {
        router.push('/dashboard/owner/properties');
      }
    } else {
      router.push('/dashboard/owner/properties');
    }
  };

  if (authLoading || (isEditMode && loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#004087] mx-auto" />
          <p className="mt-4 text-gray-600">
            {authLoading ? 'Checking authentication...' : 'Loading property data...'}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Toast */}
      {success && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-800 font-medium">
                Property {isEditMode ? 'updated' : 'created'} successfully!
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Error Summary */}
      {Object.keys(errors).length > 0 && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
            <div className="flex items-center mb-2">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <h3 className="text-red-800 font-medium">Please fix the errors:</h3>
            </div>
            <ul className="text-sm text-red-700 list-disc pl-5">
              {Object.entries(errors).slice(0, 3).map(([field, error]) => (
                <li key={field}>{error}</li>
              ))}
              {Object.keys(errors).length > 3 && (
                <li>...and {Object.keys(errors).length - 3} more errors</li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center space-y-4">
              <Link
                href="/dashboard/owner/properties"
                className="flex items-center text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors"
                onClick={(e) => {
                  if (submitting) {
                    e.preventDefault();
                    const confirm = window.confirm('Are you sure you want to go back? Changes may not be saved.');
                    if (confirm) {
                      router.push('/dashboard/owner/properties');
                    }
                  }
                }}
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Properties
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isEditMode ? 'Edit Property' : 'Add New Property'}
                </h1>
                <p className="text-gray-600">
                  {isEditMode 
                    ? 'Update your property listing' 
                    : 'Create a new property listing'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleCancel}
                disabled={submitting}
                className={`px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors ${
                  submitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => document.getElementById('property-form-submit').click()}
                disabled={submitting}
                className={`px-4 py-2 bg-[#004087] text-white rounded-lg hover:bg-[#004797] flex items-center transition-colors ${
                  submitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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
      </div>

      {/* Main Content */}
      <div className="p-6">
        <PropertyForm
          isEditMode={isEditMode}
          initialData={propertyData}
          onSubmit={handleSubmit}
          submitting={submitting}
          errors={errors}
        />
      </div>

      {/* Loading Overlay */}
      {submitting && (
        <div className="fixed inset-0 bg-black bg-opacity-20 z-40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <div className="flex items-center">
              <Loader2 className="h-6 w-6 animate-spin text-[#004087] mr-3" />
              <div>
                <p className="font-medium text-gray-900">
                  {isEditMode ? 'Updating Property...' : 'Creating Property...'}
                </p>
                <p className="text-sm text-gray-600">Please wait</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}