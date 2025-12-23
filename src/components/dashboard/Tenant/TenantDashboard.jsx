'use client';

import React, { useState, useEffect } from 'react';
import {
  Home,
  DollarSign,
  Calendar,
  FileText,
  MessageSquare,
  Settings,
  Bell,
  Search,
  ChevronRight,
  CreditCard,
  Key,
  Clock,
  CheckCircle,
  AlertCircle,
  MapPin,
  Star,
  Download,
  Filter,
  PlusCircle,
  User
} from 'lucide-react';
import Link from 'next/link';

export default function TenantDashboard() {
  const [tenantStats, setTenantStats] = useState({
    activeLeases: 0,
    totalRentPaid: 0,
    upcomingPayments: 0,
    maintenanceRequests: 0,
    leaseEndingSoon: 0,
    documents: 0
  });

  const [upcomingPayments, setUpcomingPayments] = useState([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - Replace with actual API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTenantStats({
        activeLeases: 2,
        totalRentPaid: 2400,
        upcomingPayments: 1200,
        maintenanceRequests: 3,
        leaseEndingSoon: 1,
        documents: 5
      });

      setUpcomingPayments([
        { 
          id: 1, 
          property: 'Sunset Apartment #304', 
          amount: '$1200', 
          dueDate: '2024-02-01',
          status: 'Pending',
          type: 'Rent'
        },
        { 
          id: 2, 
          property: 'Garden Villa B', 
          amount: '$150', 
          dueDate: '2024-01-25',
          status: 'Due Soon',
          type: 'Utility'
        },
      ]);

      setMaintenanceRequests([
        { 
          id: 1, 
          title: 'Kitchen Sink Leak', 
          property: 'Sunset Apartment #304',
          submitted: '2024-01-15',
          status: 'In Progress',
          priority: 'Medium'
        },
        { 
          id: 2, 
          title: 'AC Not Working', 
          property: 'Garden Villa B',
          submitted: '2024-01-10',
          status: 'Completed',
          priority: 'High'
        },
        { 
          id: 3, 
          title: 'Paint Touch-up', 
          property: 'Sunset Apartment #304',
          submitted: '2024-01-05',
          status: 'Pending',
          priority: 'Low'
        },
      ]);

      setRecentActivities([
        { id: 1, action: 'Rent Payment Made', property: 'Sunset Apartment', date: '2 hours ago', icon: <CreditCard className="h-4 w-4" /> },
        { id: 2, action: 'Maintenance Request Submitted', property: 'Garden Villa', date: '1 day ago', icon: <FileText className="h-4 w-4" /> },
        { id: 3, action: 'Lease Renewal Reminder', property: 'Sunset Apartment', date: '3 days ago', icon: <Bell className="h-4 w-4" /> },
        { id: 4, action: 'Document Uploaded', property: 'Both Properties', date: '1 week ago', icon: <Download className="h-4 w-4" /> },
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const statCards = [
    {
      title: 'Active Leases',
      value: tenantStats.activeLeases,
      icon: <Key className="h-6 w-6" />,
      color: 'bg-blue-50 text-blue-600',
      subtitle: 'Properties rented',
      link: '/tenant/leases'
    },
    {
      title: 'Upcoming Payments',
      value: `$${tenantStats.upcomingPayments}`,
      icon: <DollarSign className="h-6 w-6" />,
      color: 'bg-purple-50 text-purple-600',
      subtitle: 'Due this month',
      link: '/tenant/payments'
    },
    {
      title: 'Maintenance Requests',
      value: tenantStats.maintenanceRequests,
      icon: <Home className="h-6 w-6" />,
      color: 'bg-orange-50 text-orange-600',
      subtitle: 'Open tickets',
      link: '/tenant/maintenance'
    },
    {
      title: 'Lease Ending',
      value: tenantStats.leaseEndingSoon,
      icon: <Calendar className="h-6 w-6" />,
      color: 'bg-red-50 text-red-600',
      subtitle: 'In next 30 days',
      link: '/tenant/leases'
    }
  ];

  const quickActions = [
    { 
      title: 'Pay Rent', 
      icon: <CreditCard className="h-5 w-5" />, 
      href: '/tenant/payments/pay', 
      color: 'bg-[#004087] hover:bg-[#0250a8]',
      description: 'Make a payment'
    },
    { 
      title: 'Request Maintenance', 
      icon: <PlusCircle className="h-5 w-5" />, 
      href: '/tenant/maintenance/new', 
      color: 'bg-[#004087] hover:bg-[#0250a8]',
      description: 'Submit a request'
    },
    { 
      title: 'View Documents', 
      icon: <FileText className="h-5 w-5" />, 
      href: '/tenant/documents', 
      color: 'bg-[#004087] hover:bg-[#0250a8]',
      description: 'Lease & agreements'
    },
    { 
      title: 'Contact Landlord', 
      icon: <MessageSquare className="h-5 w-5" />, 
      href: '/tenant/messages', 
      color: 'bg-[#004087] hover:bg-[#0250a8]',
      description: 'Send message'
    },
  ];

  const propertyCards = [
    {
      id: 1,
      name: 'Sunset Apartment #304',
      address: '123 Beach Rd, Santa Monica',
      rent: '$1200/month',
      leaseEnd: '2024-06-30',
      status: 'Active',
      image: '/properties/sunset-apt.jpg',
      landlord: 'John Smith'
    },
    {
      id: 2,
      name: 'Garden Villa B',
      address: '456 Garden St, Malibu',
      rent: '$1500/month',
      leaseEnd: '2024-08-15',
      status: 'Active',
      image: '/properties/garden-villa.jpg',
      landlord: 'Maria Garcia'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1F3A34]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tenant Dashboard</h1>
              <p className="text-gray-600">Manage your rentals, payments, and requests</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-gradient-to-r from-[#004087] to-[#004087] rounded-xl p-6 text-white mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold mb-2">Welcome back, Alex!</h2>
              <p className="opacity-90">You have {tenantStats.upcomingPayments > 0 ? `${tenantStats.upcomingPayments} upcoming payments` : 'no upcoming payments'}</p>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{tenantStats.activeLeases}</p>
                  <p className="text-sm opacity-80">Active Leases</p>
                </div>
                <div className="h-12 w-px bg-white/20"></div>
                <div className="text-center">
                  <p className="text-2xl font-bold">${tenantStats.totalRentPaid}</p>
                  <p className="text-sm opacity-80">Total Paid</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Link key={index} href={stat.link}>
              <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <p className="text-gray-400 text-sm mt-2">{stat.subtitle}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <div className={`${action.color} text-white rounded-xl p-5 hover:shadow-lg transition-shadow cursor-pointer`}>
                  <div className="flex items-center justify-between mb-3">
                    {action.icon}
                    <ChevronRight className="h-5 w-5 opacity-80" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">{action.title}</h3>
                  <p className="text-sm opacity-90">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Properties */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">My Properties</h2>
                <Link href="/tenant/properties" className="text-[#1F3A34] hover:text-[#2a4d45] font-medium flex items-center">
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {propertyCards.map((property) => (
                  <div key={property.id} className="border rounded-xl p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-gray-900">{property.name}</h3>
                        <p className="text-sm text-gray-500 flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {property.address}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        {property.status}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Monthly Rent</span>
                        <span className="font-semibold">{property.rent}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Lease Ends</span>
                        <span className="font-semibold">{property.leaseEnd}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Landlord</span>
                        <span className="font-semibold">{property.landlord}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3 mt-5">
                      <Link href={`/tenant/properties/${property.id}`} className="flex-1 text-center py-2 border border-[#004087] text-[#004087] rounded-lg hover:bg-[#004087] hover:text-white transition-colors">
                        View Details
                      </Link>
                      <Link href={`/tenant/payments/pay?property=${property.id}`} className="flex-1 text-center py-2 bg-[#004087] text-white rounded-lg hover:bg-[#0250a8] transition-colors">
                        Pay Rent
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Payments */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Upcoming Payments</h2>
                <Link href="/tenant/payments" className="text-[#004087] hover:text-[#0250a8] font-medium">
                  View All →
                </Link>
              </div>
              
              <div className="space-y-4">
                {upcomingPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                        payment.status === 'Pending' ? 'bg-blue-100' : 'bg-orange-100'
                      }`}>
                        <CreditCard className={`h-6 w-6 ${
                          payment.status === 'Pending' ? 'text-blue-600' : 'text-orange-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{payment.property}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <span>Due: {payment.dueDate}</span>
                          <span className="flex items-center">
                            <DollarSign className="h-3 w-3 mr-1" />
                            {payment.amount}
                          </span>
                          <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                            {payment.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        payment.status === 'Pending' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {payment.status}
                      </span>
                      <button className="px-4 py-2 bg-[#004087] text-white rounded-lg hover:bg-[#0250a8] text-sm">
                        Pay Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Maintenance Requests */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Maintenance Requests</h2>
                <Link href="/tenant/maintenance" className="text-[#1F3A34] hover:text-[#2a4d45] font-medium">
                  View All →
                </Link>
              </div>
              
              <div className="space-y-4">
                {maintenanceRequests.map((request) => (
                  <div key={request.id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">{request.title}</h3>
                        <p className="text-sm text-gray-500">{request.property}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        request.status === 'Completed' 
                          ? 'bg-green-100 text-green-800' 
                          : request.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-sm text-gray-500">Submitted: {request.submitted}</span>
                      <span className={`text-xs font-medium ${
                        request.priority === 'High' 
                          ? 'text-red-600' 
                          : request.priority === 'Medium'
                          ? 'text-yellow-600'
                          : 'text-gray-600'
                      }`}>
                        {request.priority} Priority
                      </span>
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