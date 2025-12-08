'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Star, 
  Home,
  DollarSign,
  MapPin,
  Bed,
  Bath,
  MoreVertical,
  DeleteIcon
} from 'lucide-react';
import Link from 'next/link';

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Mock data - Replace with actual API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockProperties = [
        {
          id: 1,
          title: 'Luxury Beachfront Villa',
          description: 'Beautiful villa with ocean view',
          address: 'Punta Cana, Bavaro',
          type: 'villa',
          city: 'Punta Cana',
          price: 350,
          bedrooms: 4,
          bathrooms: 3,
          featured: true,
          status: 'active',
          images: ['/villa1.jpg'],
          createdAt: '2024-01-15'
        },
        {
          id: 2,
          title: 'Modern Condo with Ocean View',
          description: 'New condo near beach',
          address: 'Cap Cana, Punta Cana',
          type: 'condo',
          city: 'Punta Cana',
          price: 220,
          bedrooms: 2,
          bathrooms: 2,
          featured: false,
          status: 'active',
          images: ['/condo1.jpg'],
          createdAt: '2024-01-10'
        },
        {
          id: 3,
          title: 'Golf Course Villa',
          description: 'Luxury villa on golf course',
          address: 'Cocotal Golf Course',
          type: 'villa',
          city: 'Punta Cana',
          price: 450,
          bedrooms: 5,
          bathrooms: 4,
          featured: true,
          status: 'active',
          images: ['/golf-villa.jpg'],
          createdAt: '2024-01-05'
        },
        {
          id: 4,
          title: 'Studio Apartment',
          description: 'Cozy studio in downtown',
          address: 'Downtown Punta Cana',
          type: 'apartment',
          city: 'Punta Cana',
          price: 120,
          bedrooms: 1,
          bathrooms: 1,
          featured: false,
          status: 'active',
          images: ['/studio.jpg'],
          createdAt: '2024-01-02'
        },
      ];

      setProperties(mockProperties);
      setFilteredProperties(mockProperties);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter properties
  useEffect(() => {
    let result = [...properties];

    // Search filter
    if (searchTerm) {
      result = result.filter(property =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (selectedType !== 'all') {
      result = result.filter(property => property.type === selectedType);
    }

    // City filter
    if (selectedCity !== 'all') {
      result = result.filter(property => property.city === selectedCity);
    }

    setFilteredProperties(result);
    setCurrentPage(1);
  }, [searchTerm, selectedType, selectedCity, properties]);

  // Get unique types and cities
  const propertyTypes = ['all', ...new Set(properties.map(p => p.type))];
  const cities = ['all', ...new Set(properties.map(p => p.city))];

  // Summary statistics
  const stats = {
    total: properties.length,
    active: properties.filter(p => p.status === 'active').length,
    featured: properties.filter(p => p.featured).length
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
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
              <h1 className="text-2xl font-bold text-gray-900">My Properties</h1>
              <p className="text-gray-600">Manage all your property listings</p>
            </div>
            <Link
              href="/dashboard/owner/properties/add"
              className="flex items-center px-4 py-2 bg-[#1F3A34] text-white rounded-lg hover:bg-[#2a4d45]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Property
            </Link>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Properties</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Home className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active Listings</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.active}</p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <div className="h-6 w-6 bg-green-600 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Featured</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.featured}</p>
              </div>
              <div className="p-2 bg-yellow-50 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F3A34] focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Type Filter */}
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#1F3A34] focus:border-transparent"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">All Types</option>
              {propertyTypes.filter(type => type !== 'all').map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>

            {/* City Filter */}
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#1F3A34] focus:border-transparent"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="all">All Cities</option>
              {cities.filter(city => city !== 'all').map(city => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <div key={property.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                {/* Property Image */}
                <div className="h-48 bg-gray-200 relative">
                  <div className="h-full w-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <Home className="h-12 w-12 text-white" />
                  </div>
                  {property.featured && (
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <div className="relative group">
                      <button className="p-1.5 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white">
                        <MoreVertical className="h-4 w-4 text-gray-700" />
                      </button>
                      <div className="absolute right-0 mt-0 w-40 bg-white rounded-lg shadow-lg border hidden group-hover:block z-10">
                        <div className="py-1">
                          <Link
                            href={`/pages/properties/${property.id}`}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                          <button
                           
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <DeleteIcon className="h-4 w-4 mr-2" />
                            Delete Property
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Property Details */}
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">
                        {property.title}
                      </h3>
                      <div className="flex items-center text-gray-600 text-sm mb-3">
                        <MapPin className="h-3 w-3 mr-1" />
                        {property.address}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900 text-lg">
                        ${property.price}/night
                      </div>
                      <div className="text-xs text-gray-500">per night</div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {property.description}
                  </p>

                  <div className="flex items-center justify-between border-t pt-4">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center text-sm">
                        <Bed className="h-4 w-4 mr-1" />
                        {property.bedrooms} beds
                      </span>
                      <span className="flex items-center text-sm">
                        <Bath className="h-4 w-4 mr-1" />
                        {property.bathrooms} baths
                      </span>
                    </div>
                    <Link
                      href={`/dashboard/owner/properties/edit/${property.id}`}
                      className="text-[#1F3A34] hover:text-[#2a4d45] text-sm font-medium"
                    >
                      Edit →
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full">
              <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Home className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
                <Link
                  href="/owner/properties/add"
                  className="inline-flex items-center px-4 py-2 bg-[#1F3A34] text-white rounded-lg hover:bg-[#2a4d45]"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Property
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Simple Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Properties by Type</p>
                <div className="mt-3 space-y-2">
                  {Array.from(new Set(properties.map(p => p.type))).map(type => {
                    const count = properties.filter(p => p.type === type).length;
                    return (
                      <div key={type} className="flex justify-between items-center">
                        <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                        <span className="font-semibold">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <Home className="h-10 w-10 opacity-80" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Properties by City</p>
                <div className="mt-3 space-y-2">
                  {Array.from(new Set(properties.map(p => p.city))).map(city => {
                    const count = properties.filter(p => p.city === city).length;
                    return (
                      <div key={city} className="flex justify-between items-center">
                        <span>{city}</span>
                        <span className="font-semibold">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <MapPin className="h-10 w-10 opacity-80" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}