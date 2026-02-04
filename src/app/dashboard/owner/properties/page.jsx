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
  ChevronRight,
  ExternalLink,
  AlertTriangle,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import CustomSelect from '@/components/dashboard/Admin/CustomSelect';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const itemsPerPage = 8;
  

  const route = useRouter();
  useEffect(() => {
    const fetchMyProperties = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/properties/owner/my-properties`,
          {
            withCredentials: true
          }
        );

        if (res.data.success) {
          setProperties(res.data.data);
          setFilteredProperties(res.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch properties', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyProperties();
  }, []);

  // Filter properties
  useEffect(() => {
    let result = [...properties];

    if (searchTerm) {
      result = result.filter(property =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType !== 'all') {
      result = result.filter(property => property.type === selectedType);
    }

    if (selectedCity !== 'all') {
      result = result.filter(property => property.city === selectedCity);
    }

    setFilteredProperties(result);
    setCurrentPage(1);
  }, [searchTerm, selectedType, selectedCity, properties]);

  // Get unique types and cities
  const propertyTypes = ['all', ...new Set(properties.map(p => p.type))];
  const cities = ['all', ...new Set(properties.map(p => p.city))];

  // Prepare options for CustomSelect
  const typeOptions = propertyTypes.map(type => ({
    value: type,
    label: type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)
  }));

  const cityOptions = cities.map(city => ({
    value: city,
    label: city === 'all' ? 'All Cities' : city
  }));

  const stats = {
    total: properties.length,
    active: properties.filter(p => p.status === 'active').length,
    featured: properties.filter(p => p.featured).length
  };

  // Handle delete property
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/properties/${id}`,
        {
          withCredentials: true
        }
      );

      // Remove property from state
      setProperties(properties.filter(p => p._id !== id));
      setFilteredProperties(filteredProperties.filter(p => p._id !== id));

      alert('Property deleted successfully');
    } catch (error) {
      console.error('Failed to delete property', error);
      alert('Failed to delete property');
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment/create-checkout`,
        { propertyId: id },
        {
          withCredentials: true
        }
      );

      console.log('Received response for featured status toggle:', res?.data?.data);
      if(res?.data?.data?.url){
        window.location.href = res.data.data.url;
      }
    } catch (error) {
      console.error('Failed to toggle featured status', error);
      alert('Failed to update featured status');
      return;
    }
  }
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
              className="flex items-center px-4 py-2 bg-[#004087] text-white rounded-lg hover:bg-[#004797] transition-all duration-200 hover:scale-105 active:scale-95"
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
          {[
            { title: "Total Properties", value: stats.total, icon: Home, color: "blue" },
            { title: "Active Listings", value: stats.active, icon: Home, color: "green" },
            { title: "Featured", value: stats.featured, icon: Star, color: "yellow" }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-2 bg-${stat.color}-50 rounded-lg`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F3A34] focus:border-transparent transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="w-full md:w-40">
              <CustomSelect
                value={selectedType}
                options={typeOptions}
                onChange={setSelectedType}
                className="w-full"
                variant="compact"
              />
            </div>

            <div className="w-full md:w-40">
              <CustomSelect
                value={selectedCity}
                options={cityOptions}
                onChange={setSelectedCity}
                className="w-full"
                variant="compact"
              />
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => {
              const coverImage =
                property.images?.find(img => img.isCover)?.url ||
                property.images?.[0]?.url;

              return (
                <div
                  key={property._id}
                  className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Property Image */}
                  <div className="h-48 bg-gray-200 relative group">
                    {coverImage ? (
                      <>
                        <img
                          src={coverImage}
                          alt={property.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </>
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                        <Home className="h-12 w-12 text-white" />
                      </div>
                    )}

                    {property.featured && (
                      <div className="absolute top-3 left-3 animate-pulse">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 shadow-sm">
                          <Star className="h-3 w-3 mr-1 fill-yellow-500" />
                          Featured
                        </span>
                      </div>
                    )}

                    {/* Action Menu - Improved UX */}
                    <div className="absolute top-3 right-3">
                      <div className="relative">
                        <button
                          className="cursor-pointer p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-md hover:shadow-lg transition-all duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteConfirm(showDeleteConfirm === property._id ? null : property._id);
                          }}
                        >
                          <MoreVertical className="h-4 w-4 text-gray-700" />
                        </button>

                        {/* Action Menu Dropdown */}
                        <div className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border transform transition-all duration-200 origin-top-right z-50
                          ${showDeleteConfirm === property._id ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'}`}>
                          <div className="py-1">
                            {/* View Details Link */}
                            <Link
                              href={`/pages/properties/${property._id}`}
                              className="flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 group"
                              onClick={() => setShowDeleteConfirm(null)}
                            >
                              <div className="flex items-center">
                                <Eye className="h-4 w-4 mr-3 text-gray-400 group-hover:text-blue-500" />
                                View Details
                              </div>
                              <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>

                            {/* Edit Link */}
                            <Link
                              href={`/dashboard/owner/properties/edit/${property._id}`}
                              className="flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-150 group"
                              onClick={() => setShowDeleteConfirm(null)}
                            >
                              <div className="flex items-center">
                                <Edit className="h-4 w-4 mr-3 text-gray-400 group-hover:text-green-500" />
                                Edit Property
                              </div>
                              <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>

                            {/* Delete Button */}
                            <button
                              className="flex items-center justify-between w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 group"
                              onClick={() => {
                                setShowDeleteConfirm(null);
                                if (window.confirm(`Are you sure you want to delete "${property.title}"? This action cannot be undone.`)) {
                                  handleDelete(property._id);
                                }
                              }}
                            >
                              <div className="flex items-center">
                                <Trash2 className="h-4 w-4 mr-3" />
                                Delete Property
                              </div>
                              <AlertTriangle className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          </div>

                          {/* Confirmation Tooltip (Optional) */}
                          {showDeleteConfirm === property._id && (
                            <div className="px-4 py-2 bg-red-50 border-t border-red-100">
                              <p className="text-xs text-red-600">
                                Deleting will permanently remove this property
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Close dropdown when clicking outside */}
                      {showDeleteConfirm === property._id && (
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setShowDeleteConfirm(null)}
                        />
                      )}
                    </div>

                    {/* Quick View Button */}
                    <Link
                      href={`/dashboard/owner/properties/detail/${property._id}`}
                      className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
                    >
                      <button className="cursor-pointer px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-200 flex items-center">
                        <Eye className="h-3 w-3 mr-2" />
                        Quick View
                      </button>
                    </Link>
                  </div>

                  {/* Property Details */}
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg mb-1 hover:text-[#004087] transition-colors duration-200">
                          {property.title}
                        </h3>
                        <div className="flex items-center text-gray-600 text-sm mb-3">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span className="truncate">{property.address}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        {property.listingType === 'rent' ? (<><div className="font-bold text-gray-900 text-lg">
                          ${property.price}/{property.pricePeriod}
                        </div>
                          <div className="text-xs text-gray-500">
                            per {property.pricePeriod}
                          </div></>) : (<>
                            <div className="font-bold text-gray-900 text-lg">
                              ${property.price}
                            </div>
                            <div className="text-xs text-gray-500">
                              One-time Payment
                            </div>
                          </>)}

                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {property.description}
                    </p>

                    <div className="flex items-center justify-between border-t pt-4">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center text-sm bg-gray-50 px-2 py-1 rounded">
                          <Bed className="h-4 w-4 mr-1 text-gray-500" />
                          {property.bedrooms} beds
                        </span>
                        <span className="flex items-center text-sm bg-gray-50 px-2 py-1 rounded">
                          <Bath className="h-4 w-4 mr-1 text-gray-500" />
                          {property.bathrooms} baths
                        </span>
                      </div>
                      <Link
                        href={`/dashboard/owner/properties/edit/${property._id}`}
                        className="flex items-center justify-center px-4 py-2.5 bg-[#004797] text-white rounded-lg text-sm font-medium hover:bg-[#2a4d45] hover:shadow-sm transition-all duration-200"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Property
                      </Link>
                    </div>
                    <>
                      {/* here add three button, make lease, make featured , and edit */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex justify-between space-y-3">
                          {/* Make Lease Button */}
                          {/* <button
                            onClick={() => route.push(`/dashboard/owner/leases/create?id=${property._id}`)}
                            className={`flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${property.isLeased
                              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                              : 'bg-blue-50 text-blue-700 hover:bg-blue-100 hover:shadow-sm'
                              }`}
                            disabled={property.isLeased}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            {property.isLeased ? 'Already Leased' : 'Make Lease'}
                          </button> */}

                          {/* Make Featured Button */}
                          <button
                            onClick={() => handleToggleFeatured(property._id)}
                            disabled={property.featured}
                            className={`flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${property.featured
                              ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-sm'
                              }`}
                          >
                            <Star className={`h-4 w-4 mr-2 ${property.featured ? 'fill-yellow-500' : ''}`} />
                            {property.featured ? 'Featured' : 'MakeFeatured'}
                          </button>

                          {/* Edit Button - Full width variant */}

                        </div>
                      </div>
                    </>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full">
              <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Home className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No properties found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search or filters
                </p>
                <Link
                  href="/dashboard/owner/properties/add"
                  className="inline-flex items-center px-4 py-2 bg-[#004087] text-white rounded-lg hover:bg-[#004797] hover:shadow-md transition-all duration-200"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Property
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}