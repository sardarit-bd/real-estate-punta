
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Home, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Calendar,
  MapPin,
  Star,
  Eye,
  Download,
  Filter,
  PlusCircle
} from 'lucide-react';
import Link from 'next/link';

export default function OwnerDashboard() {
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeProperties: 0,
    totalRevenue: 0,
    featuredProperties: 0,
    viewsThisMonth: 0,
    conversionRate: 0
  });

  const [recentProperties, setRecentProperties] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - Replace with actual API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalProperties: 12,
        activeProperties: 8,
        totalRevenue: 299.88,
        featuredProperties: 3,
        viewsThisMonth: 1245,
        conversionRate: 2.4
      });

      setRecentProperties([
        { id: 1, title: 'Luxury Villa Punta Cana', status: 'Active', price: '$350/night', views: 245, featured: true },
        { id: 2, title: 'Beachfront Condo', status: 'Active', price: '$220/night', views: 189, featured: false },
        { id: 3, title: 'Golf Course Villa', status: 'Pending', price: '$450/night', views: 98, featured: true },
        { id: 4, title: 'Studio Apartment', status: 'Active', price: '$120/night', views: 312, featured: false },
      ]);

      setRecentPayments([
        { id: 1, property: 'Luxury Villa', amount: '$24.99', date: '2024-01-15', status: 'Completed' },
        { id: 2, property: 'Golf Course Villa', amount: '$24.99', date: '2024-01-10', status: 'Completed' },
        { id: 3, property: 'Beachfront Condo', amount: '$24.99', date: '2024-01-05', status: 'Pending' },
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const statCards = [
    {
      title: 'Total Properties',
      value: stats.totalProperties,
      icon: <Home className="h-6 w-6" />,
      color: 'bg-blue-50 text-blue-600',
      change: '+2 this month'
    },
    {
      title: 'Active Listings',
      value: stats.activeProperties,
      icon: <Eye className="h-6 w-6" />,
      color: 'bg-green-50 text-green-600',
      change: '80% active rate'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue}`,
      icon: <DollarSign className="h-6 w-6" />,
      color: 'bg-purple-50 text-purple-600',
      change: '+$49.98 this month'
    },
    {
      title: 'Featured Properties',
      value: stats.featuredProperties,
      icon: <Star className="h-6 w-6" />,
      color: 'bg-yellow-50 text-yellow-600',
      change: 'Get more views'
    }
  ];

  const quickActions = [
    { title: 'Add New Property', icon: <PlusCircle className="h-5 w-5" />, href: '/owner/properties/add', color: 'bg-[#1F3A34] hover:bg-[#2a4d45]' },
    { title: 'View All Properties', icon: <Home className="h-5 w-5" />, href: '/owner/properties', color: 'bg-blue-600 hover:bg-blue-700' },
    { title: 'Payment History', icon: <DollarSign className="h-5 w-5" />, href: '/owner/payments', color: 'bg-green-600 hover:bg-green-700' },
    { title: 'Analytics Report', icon: <TrendingUp className="h-5 w-5" />, href: '/owner/analytics', color: 'bg-purple-600 hover:bg-purple-700' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1F3A34]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Owner Dashboard</h1>
              <p className="text-gray-600">Welcome back! Here is your property overview</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center px-4 py-2 bg-[#1F3A34] text-white rounded-lg hover:bg-[#2a4d45]">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-green-600 text-sm mt-2">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Recent Properties */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Recent Properties</h2>
                <Link href="/owner/properties" className="text-[#1F3A34] hover:text-[#2a4d45] font-medium">
                  View All →
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentProperties.map((property) => (
                  <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Home className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{property.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <span className="flex items-center">
                            <DollarSign className="h-3 w-3 mr-1" />
                            {property.price}
                          </span>
                          <span className="flex items-center">
                            <Eye className="h-3 w-3 mr-1" />
                            {property.views} views
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        property.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {property.status}
                      </span>
                      {property.featured && (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Recent Payments */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Recent Payments</h2>
                <Link href="/owner/payments" className="text-[#1F3A34] hover:text-[#2a4d45] font-medium">
                  View All →
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentPayments.map((payment) => (
                  <div key={payment.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">{payment.property}</h3>
                        <p className="text-sm text-gray-500">{payment.date}</p>
                      </div>
                      <span className="font-bold text-gray-900">{payment.amount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`px-2 py-1 rounded text-xs ${
                        payment.status === 'Completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payment.status}
                      </span>
                      <button className="text-sm text-[#1F3A34] hover:text-[#2a4d45] font-medium">
                        View Receipt
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
           
          </div>
        </div>
      </div>
    </div>
  );
}