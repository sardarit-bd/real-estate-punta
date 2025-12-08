'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Home, MapPin, DollarSign, Bed, Bath, Image as ImageIcon, Upload, X, Star, Save, Plus } from 'lucide-react';
import Link from 'next/link';
import PropertyForm from './PropertyForm.jsx';

export default function AddEditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const isEditMode = !!params.id;
  const propertyId = params.id;

  const [loading, setLoading] = useState(isEditMode);
  const [propertyData, setPropertyData] = useState(null);

  // Load property data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchPropertyData();
    }
  }, [isEditMode, propertyId]);

  const fetchPropertyData = async () => {
    setLoading(true);
    try {
      // Mock API call - Replace with actual API
      const mockProperty = {
        id: propertyId,
        title: 'Beachfront Villa Punta Cana',
        description: 'Luxury villa with private pool and ocean view. Perfect for family vacations.',
        type: 'villa',
        price: 350,
        bedrooms: 4,
        bathrooms: 3,
        city: 'Punta Cana',
        address: 'Playa Bavaro, Punta Cana',
        featured: true,
        images: [
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format',
          'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&auto=format',
        ],
        status: 'active'
      };
      
      setPropertyData(mockProperty);
    } catch (error) {
      console.error('Error fetching property:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    console.log('Submitting property:', formData);
    // Add your API call here
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Redirect after success
    router.push('/dashboard/owner/properties');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1F3A34] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading property data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard/owner/properties"
                className="flex items-center text-gray-600 hover:text-gray-900"
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
              <Link
                href="/owner/properties"
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                form="property-form"
                className="px-4 py-2 bg-[#1F3A34] text-white rounded-lg hover:bg-[#2a4d45] flex items-center"
              >
                {isEditMode ? (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update Property
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Property
                  </>
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
        />
      </div>
    </div>
  );
}