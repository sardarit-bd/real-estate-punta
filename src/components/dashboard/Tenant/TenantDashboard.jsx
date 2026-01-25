'use client';

import React, { useState, useEffect } from 'react';
import {
  Home,
  DollarSign,
  Calendar,
  FileText,
  MessageSquare,
  Bell,
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
  User,
  Building,
  RefreshCw,
  AlertTriangle,
  TrendingUp,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { leaseService } from '@/services/lease.service';

// Helper functions
const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(parseFloat(amount));
};

const formatDate = (dateStr) => {
  if (!dateStr) return "Not set";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getTimeAgo = (dateStr) => {
  if (!dateStr) return '';
  const now = new Date();
  const past = new Date(dateStr);
  const diffInHours = Math.floor((now - past) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  return `${Math.floor(diffInHours / 24)} days ago`;
};

export default function TenantDashboard() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  // Fetch user profile from localStorage
  const fetchUserProfile = () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserInfo(user);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user profile
      fetchUserProfile();

      // Fetch leases and stats in parallel
      const [leasesResponse, statsResponse] = await Promise.allSettled([
        leaseService.getMyLeases({ role: 'tenant' }),
        leaseService.getLeaseStats()
      ]);

      let leases = [];
      let stats = {};

      // Process leases response
      if (leasesResponse.status === 'fulfilled') {
        leases = leasesResponse.value.data || [];
      } else {
        console.error('Error fetching leases:', leasesResponse.reason);
        toast.error('Failed to load leases');
      }

      // Process stats response
      if (statsResponse.status === 'fulfilled') {
        stats = statsResponse.value.data || {};
      } else {
        console.error('Error fetching stats:', statsResponse.reason);
      }

      // Extract properties from leases
      const properties = leases.map(lease => ({
        id: lease.property?._id || lease.property,
        name: lease.property?.title || 'Property',
        address: `${lease.property?.address || ''} ${lease.property?.city || ''}`.trim() || 'Address not available',
        rent: formatCurrency(lease.rentAmount || 0),
        leaseEnd: lease.endDate,
        status: getLeaseStatus(lease.status),
        landlord: lease.landlord?.name || 'Landlord',
        leaseId: lease._id,
        propertyDetails: lease.property
      }));

      // Calculate dashboard stats
      const activeLeases = leases.filter(lease => 
        ['active', 'fully_executed'].includes(lease.status)
      ).length;

      const leaseEndingSoon = leases.filter(lease => {
        if (!lease.endDate) return false;
        const endDate = new Date(lease.endDate);
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        return endDate <= thirtyDaysFromNow && endDate >= new Date();
      }).length;

      const totalRentPaid = leases.reduce((sum, lease) => sum + (lease.rentAmount || 0), 0);
      
      // Generate recent activities from status history
      const recentActivities = [];
      leases.forEach(lease => {
        if (lease.statusHistory && lease.statusHistory.length > 0) {
          const lastStatus = lease.statusHistory[lease.statusHistory.length - 1];
          recentActivities.push({
            id: `status-${lease._id}`,
            action: `Lease ${getStatusText(lease.status)}`,
            property: lease.property?.title || 'Property',
            date: getTimeAgo(lastStatus.changedAt),
            icon: <Clock className="h-4 w-4" />
          });
        }
      });

      // If no recent activities, add a welcome message
      if (recentActivities.length === 0) {
        recentActivities.push({
          id: 'welcome',
          action: 'Welcome to Rental System',
          property: 'Get started with your lease',
          date: 'Just now',
          icon: <CheckCircle className="h-4 w-4" />
        });
      }

      // Generate upcoming payments
      const upcomingPayments = generateUpcomingPayments(leases);

      setDashboardData({
        stats: {
          activeLeases,
          totalRentPaid,
          upcomingPayments: upcomingPayments.length,
          maintenanceRequests: 0, // Add maintenance service later
          leaseEndingSoon,
          documents: leases.reduce((sum, lease) => sum + (lease.documents?.length || 0), 0),
          overduePayments: 0 // Add payment service later
        },
        leases,
        properties,
        upcomingPayments,
        maintenanceRequests: [],
        recentActivities: recentActivities.slice(0, 5),
        notifications: []
      });

      // toast.success('Dashboard loaded successfully');
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Helper functions
  const getLeaseStatus = (status) => {
    const statusMap = {
      'active': 'Active',
      'fully_executed': 'Active',
      'pending_request': 'Pending',
      'under_review': 'Under Review',
      'approved': 'Approved',
      'draft': 'Draft',
      'sent_to_tenant': 'Under Review',
      'signed_by_landlord': 'Signed by Landlord',
      'expired': 'Expired',
      'cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
  };

  const getStatusText = (status) => {
    return status.replace(/_/g, ' ');
  };

  const generateUpcomingPayments = (leases) => {
    const payments = [];
    leases.forEach(lease => {
      if (['active', 'fully_executed'].includes(lease.status) && lease.rentAmount) {
        payments.push({
          id: `payment-${lease._id}`,
          property: lease.property?.title || 'Property',
          amount: lease.rentAmount,
          dueDate: getNextPaymentDate(),
          status: 'Pending',
          type: 'Rent',
          leaseId: lease._id
        });
      }
    });
    return payments;
  };

  const getNextPaymentDate = () => {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return nextMonth.toISOString().split('T')[0];
  };

  // Initial fetch
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  // Handle view lease
  const handleViewLease = (leaseId) => {
    if (leaseId) {
      router.push(`/tenant/leases/${leaseId}`);
    }
  };

  // Handle pay rent
  const handlePayRent = (leaseId, amount) => {
    if (leaseId && amount) {
      router.push(`/tenant/payments/pay?lease=${leaseId}&amount=${amount}`);
      toast('Redirecting to payment page');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#004087]"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <h3 className="text-lg font-semibold text-red-800">Unable to load dashboard</h3>
          </div>
          <p className="text-red-600 mb-4">Please try refreshing the page</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Stat cards
  const statCards = [
    {
      title: 'Active Leases',
      value: dashboardData.stats.activeLeases,
      icon: <Key className="h-6 w-6" />,
      color: 'bg-blue-50 text-blue-600',
      subtitle: 'Properties rented',
      link: '/tenant/leases'
    },
    {
      title: 'Upcoming Payments',
      value: formatCurrency(dashboardData.stats.upcomingPayments * 1200),
      icon: <DollarSign className="h-6 w-6" />,
      color: 'bg-purple-50 text-purple-600',
      subtitle: `${dashboardData.stats.upcomingPayments} due`,
      link: '/tenant/payments'
    },
    {
      title: 'Maintenance',
      value: dashboardData.stats.maintenanceRequests,
      icon: <Home className="h-6 w-6" />,
      color: 'bg-orange-50 text-orange-600',
      subtitle: 'Open requests',
      link: '/tenant/maintenance'
    },
    {
      title: 'Lease Ending',
      value: dashboardData.stats.leaseEndingSoon,
      icon: <Calendar className="h-6 w-6" />,
      color: 'bg-red-50 text-red-600',
      subtitle: 'In next 30 days',
      link: '/tenant/leases'
    }
  ];

  // Quick actions
  const quickActions = [
    { 
      title: 'Apply for Property', 
      icon: <PlusCircle className="h-5 w-5" />, 
      href: '/tenant/properties', 
      color: 'bg-[#004087] hover:bg-[#0250a8]',
      description: 'Find and apply'
    },
    { 
      title: 'Pay Rent', 
      icon: <CreditCard className="h-5 w-5" />, 
      href: '/tenant/payments/pay', 
      color: 'bg-[#004087] hover:bg-[#0250a8]',
      description: 'Make a payment',
      badge: dashboardData.upcomingPayments.length > 0 ? `${dashboardData.upcomingPayments.length}` : null
    },
    { 
      title: 'View Documents', 
      icon: <FileText className="h-5 w-5" />, 
      href: '/tenant/documents', 
      color: 'bg-[#004087] hover:bg-[#0250a8]',
      description: 'Lease & agreements',
      badge: dashboardData.stats.documents > 0 ? `${dashboardData.stats.documents}` : null
    },
    { 
      title: 'Contact Landlord', 
      icon: <MessageSquare className="h-5 w-5" />, 
      href: '/tenant/messages', 
      color: 'bg-[#004087] hover:bg-[#0250a8]',
      description: 'Send message'
    },
  ];

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
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                title="Refresh"
              >
                <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              {dashboardData.stats.overduePayments > 0 && (
                <button
                  onClick={() => router.push('/tenant/payments')}
                  className="relative p-2 text-red-600 hover:text-red-800"
                  title="Overdue Payments"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                    {dashboardData.stats.overduePayments}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#004087] to-[#004087] rounded-xl p-6 text-white mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold mb-2">Welcome back, {userInfo?.name || 'Tenant'}!</h2>
              <p className="opacity-90">
                {dashboardData.stats.upcomingPayments > 0 
                  ? `You have ${dashboardData.stats.upcomingPayments} upcoming payment${dashboardData.stats.upcomingPayments > 1 ? 's' : ''}`
                  : 'You have no upcoming payments'}
              </p>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{dashboardData.stats.activeLeases}</p>
                  <p className="text-sm opacity-80">Active Leases</p>
                </div>
                <div className="h-12 w-px bg-white/20"></div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{formatCurrency(dashboardData.stats.totalRentPaid)}</p>
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
                <div className={`${action.color} text-white rounded-xl p-5 hover:shadow-lg transition-shadow cursor-pointer relative`}>
                  {action.badge && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {action.badge}
                    </span>
                  )}
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
            {/* My Properties Section */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <Building className="h-5 w-5 text-gray-700" />
                  <h2 className="text-lg font-semibold text-gray-900">My Properties</h2>
                </div>
                <div className="flex items-center gap-3">
                  {dashboardData.properties.length > 0 && (
                    <Link 
                      href="/tenant/properties" 
                      className="text-[#004087] hover:text-[#0250a8] font-medium flex items-center text-sm"
                    >
                      View All <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  )}
                  <Link 
                    href="/tenant/properties" 
                    className="px-4 py-2 bg-[#004087] text-white rounded-lg hover:bg-[#0250a8] text-sm flex items-center gap-2"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Find Properties
                  </Link>
                </div>
              </div>
              
              {dashboardData.properties.length === 0 ? (
                <div className="text-center py-12">
                  <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No properties yet</h3>
                  <p className="text-gray-500 mb-6">Start by applying for a property to rent</p>
                  <Link 
                    href="/tenant/properties" 
                    className="inline-flex items-center px-6 py-3 bg-[#004087] text-white rounded-lg hover:bg-[#0250a8] font-medium"
                  >
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Browse Properties
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dashboardData.properties.map((property) => (
                    <div key={property.id || property.leaseId} className="border rounded-xl p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-gray-900">{property.name}</h3>
                          <p className="text-sm text-gray-500 flex items-center mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {property.address}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          property.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : property.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {property.status}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Monthly Rent</span>
                          <span className="font-semibold">{property.rent}</span>
                        </div>
                        {property.leaseEnd && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Lease Ends</span>
                            <span className="font-semibold">{formatDate(property.leaseEnd)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Landlord</span>
                          <span className="font-semibold">{property.landlord}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3 mt-5">
                        <button
                          onClick={() => handleViewLease(property.leaseId)}
                          className="flex-1 text-center py-2 border border-[#004087] text-[#004087] rounded-lg hover:bg-[#004087] hover:text-white transition-colors"
                        >
                          View Lease
                        </button>
                        {property.leaseId && property.rent && (
                          <button
                            onClick={() => handlePayRent(property.leaseId, parseFloat(property.rent.replace('$', '')))}
                            className="flex-1 text-center py-2 bg-[#004087] text-white rounded-lg hover:bg-[#0250a8] transition-colors"
                          >
                            Pay Rent
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming Payments Section */}
            {dashboardData.upcomingPayments.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-gray-700" />
                    <h2 className="text-lg font-semibold text-gray-900">Upcoming Payments</h2>
                  </div>
                  <Link 
                    href="/tenant/payments" 
                    className="text-[#004087] hover:text-[#0250a8] font-medium text-sm flex items-center"
                  >
                    View All <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {dashboardData.upcomingPayments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                          payment.status === 'overdue' ? 'bg-red-100' : 'bg-blue-100'
                        }`}>
                          <CreditCard className={`h-6 w-6 ${
                            payment.status === 'overdue' ? 'text-red-600' : 'text-blue-600'
                          }`} />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {payment.property}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                            {payment.dueDate && (
                              <span>Due: {formatDate(payment.dueDate)}</span>
                            )}
                            <span className="flex items-center">
                              <DollarSign className="h-3 w-3 mr-1" />
                              {formatCurrency(payment.amount)}
                            </span>
                            {payment.type && (
                              <span className="text-xs px-2 py-1 bg-gray-100 rounded capitalize">
                                {payment.type}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          payment.status === 'overdue' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {payment.status}
                        </span>
                        <button
                          onClick={() => handlePayRent(payment.leaseId, payment.amount)}
                          className="px-4 py-2 bg-[#004087] text-white rounded-lg hover:bg-[#0250a8] text-sm"
                        >
                          Pay Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Recent Activity & Stats */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-gray-700" />
                  <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                </div>
              </div>
              
              <div className="space-y-4">
                {dashboardData.recentActivities.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No recent activity</p>
                  </div>
                ) : (
                  dashboardData.recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                      <div className="flex-shrink-0 mt-1">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          {activity.icon}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{activity.action}</p>
                        <p className="text-sm text-gray-500 truncate">{activity.property}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="text-xs text-gray-500">{activity.date}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="h-5 w-5 text-gray-700" />
                <h2 className="text-lg font-semibold text-gray-900">Quick Stats</h2>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Total Properties</span>
                  <span className="font-medium">{dashboardData.properties.length}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-t">
                  <span className="text-sm text-gray-600">Active Leases</span>
                  <span className="font-medium">{dashboardData.stats.activeLeases}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-t">
                  <span className="text-sm text-gray-600">Total Documents</span>
                  <span className="font-medium">{dashboardData.stats.documents}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-t">
                  <span className="text-sm text-gray-600">Total Rent Value</span>
                  <span className="font-medium">{formatCurrency(dashboardData.stats.totalRentPaid)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}