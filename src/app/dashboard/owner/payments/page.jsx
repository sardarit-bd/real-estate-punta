'use client';

import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  CreditCard, 
  Calendar, 
  Download, 
  Eye, 
  Receipt, 
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Search,
  BarChart3,
  CreditCard as Card,
  PlusCircle,
  AlertCircle
} from 'lucide-react';
import CustomSelect from '@/components/dashboard/Admin/CustomSelect';

export default function OwnerPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPaid: 0,
    totalDue: 0,
    featuredCount: 0,
    pendingPayments: 0
  });
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [showFilters, setShowFilters] = useState(true);

  // Status options
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' }
  ];

  // Date range options
  const dateOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'Last 30 Days' },
    { value: 'year', label: 'Last Year' }
  ];

  // Mock data - Replace with actual API calls
  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        const mockPayments = [
          {
            id: 'PAY-2024-001',
            property: 'Luxury Beachfront Villa',
            propertyId: 1,
            amount: 24.99,
            currency: 'USD',
            type: 'featured_listing',
            status: 'completed',
            date: '2024-01-15',
            dueDate: '2024-02-15',
            transactionId: 'txn_1OjLk2Lwd7x8RqMk1jQv4X7a',
            paymentMethod: 'card_ending_in_4242',
            invoiceUrl: '/invoices/inv_001.pdf',
            receiptUrl: '/receipts/rec_001.pdf'
          },
          {
            id: 'PAY-2024-002',
            property: 'Golf Course Villa',
            propertyId: 3,
            amount: 24.99,
            currency: 'USD',
            type: 'featured_listing',
            status: 'completed',
            date: '2024-01-05',
            dueDate: '2024-02-05',
            transactionId: 'txn_1OjLk3Lwd7x8RqMk1jQv4X7b',
            paymentMethod: 'card_ending_in_4242',
            invoiceUrl: '/invoices/inv_002.pdf',
            receiptUrl: '/receipts/rec_002.pdf'
          },
          {
            id: 'PAY-2024-003',
            property: 'Penthouse with Private Pool',
            propertyId: 6,
            amount: 24.99,
            currency: 'USD',
            type: 'featured_listing',
            status: 'pending',
            date: '2024-01-20',
            dueDate: '2024-01-27',
            transactionId: null,
            paymentMethod: 'card_ending_in_4242',
            invoiceUrl: '/invoices/inv_003.pdf',
            receiptUrl: null
          },
          {
            id: 'PAY-2024-004',
            property: 'Luxury Beachfront Villa',
            propertyId: 1,
            amount: 24.99,
            currency: 'USD',
            type: 'featured_listing',
            status: 'failed',
            date: '2023-12-15',
            dueDate: '2023-12-22',
            transactionId: 'txn_1OjLk4Lwd7x8RqMk1jQv4X7c',
            paymentMethod: 'card_ending_in_4242',
            invoiceUrl: '/invoices/inv_004.pdf',
            receiptUrl: null
          },
          {
            id: 'PAY-2023-012',
            property: 'Modern Condo with Ocean View',
            propertyId: 2,
            amount: 24.99,
            currency: 'USD',
            type: 'featured_listing',
            status: 'completed',
            date: '2023-12-10',
            dueDate: '2024-01-10',
            transactionId: 'txn_1OjLk5Lwd7x8RqMk1jQv4X7d',
            paymentMethod: 'card_ending_in_4242',
            invoiceUrl: '/invoices/inv_005.pdf',
            receiptUrl: '/receipts/rec_005.pdf'
          },
          {
            id: 'PAY-2023-011',
            property: 'Luxury Beachfront Villa',
            propertyId: 1,
            amount: 24.99,
            currency: 'USD',
            type: 'featured_listing',
            status: 'completed',
            date: '2023-11-15',
            dueDate: '2023-12-15',
            transactionId: 'txn_1OjLk6Lwd7x8RqMk1jQv4X7e',
            paymentMethod: 'card_ending_in_4242',
            invoiceUrl: '/invoices/inv_006.pdf',
            receiptUrl: '/receipts/rec_006.pdf'
          }
        ];

        setPayments(mockPayments);
        setFilteredPayments(mockPayments);
        
        // Calculate stats
        const completedPayments = mockPayments.filter(p => p.status === 'completed');
        const pendingPayments = mockPayments.filter(p => p.status === 'pending');
        const featuredProperties = [...new Set(completedPayments.map(p => p.propertyId))];
        
        setStats({
          totalPaid: completedPayments.reduce((sum, p) => sum + p.amount, 0),
          totalDue: pendingPayments.reduce((sum, p) => sum + p.amount, 0),
          featuredCount: featuredProperties.length,
          pendingPayments: pendingPayments.length
        });
        
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setLoading(false);
    }
  };

  // Filter payments
  useEffect(() => {
    let result = [...payments];

    // Search filter
    if (searchTerm) {
      result = result.filter(payment =>
        payment.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(payment => payment.status === statusFilter);
    }

    // Date range filter
    if (dateRange !== 'all') {
      const now = new Date();
      const cutoff = new Date();
      
      switch (dateRange) {
        case 'today':
          cutoff.setDate(now.getDate() - 1);
          break;
        case 'week':
          cutoff.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoff.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          cutoff.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      result = result.filter(payment => new Date(payment.date) >= cutoff);
    }

    setFilteredPayments(result);
  }, [searchTerm, statusFilter, dateRange, payments]);

  // Get status color and icon
  const getStatusInfo = (status) => {
    switch (status) {
      case 'completed':
        return {
          color: 'bg-green-100 text-green-800',
          icon: <CheckCircle className="h-4 w-4" />,
          label: 'Completed'
        };
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          icon: <Clock className="h-4 w-4" />,
          label: 'Pending'
        };
      case 'failed':
        return {
          color: 'bg-red-100 text-red-800',
          icon: <XCircle className="h-4 w-4" />,
          label: 'Failed'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: <Clock className="h-4 w-4" />,
          label: 'Unknown'
        };
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  // Download invoice
  const handleDownloadInvoice = (payment) => {
    console.log('Downloading invoice:', payment.id);
    // Implement actual download logic
  };

  // View receipt
  const handleViewReceipt = (payment) => {
    console.log('Viewing receipt:', payment.id);
    // Implement receipt view logic
  };

  // Retry payment
  const handleRetryPayment = (payment) => {
    console.log('Retrying payment:', payment.id);
    // Implement retry logic
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateRange('all');
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
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
              <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
              <p className="text-gray-600">View and manage your property payments</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Paid</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(stats.totalPaid)}
                </p>
                <p className="text-green-600 text-sm mt-2">All time payments</p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Amount Due</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(stats.totalDue)}
                </p>
                <p className="text-yellow-600 text-sm mt-2">
                  {stats.pendingPayments} pending payment(s)
                </p>
              </div>
              <div className="p-2 bg-yellow-50 rounded-lg">
                <CreditCard className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Featured Properties</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.featuredCount}</p>
                <p className="text-blue-600 text-sm mt-2">Active featured listings</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Payment History</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{payments.length}</p>
                <p className="text-purple-600 text-sm mt-2">Total transactions</p>
              </div>
              <div className="p-2 bg-purple-50 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Summary */}
        <div className="bg-gradient-to-r from-[#004087] to-[#004fa8] rounded-xl p-6 text-white mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Featured Listing Summary</h2>
              <p className="text-gray-200">
                Your properties get 3x more views with featured listings
              </p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-300">Monthly Cost</p>
                  <p className="text-2xl font-bold">$24.99/property</p>
                </div>
                <div>
                  <p className="text-sm text-gray-300">Next Payment Due</p>
                  <p className="text-2xl font-bold">Jan 15, 2024</p>
                </div>
              </div>
            </div>
            <div className="mt-6 lg:mt-0">
              <button className="px-6 py-3 bg-white text-[#1F3A34] rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Manage Featured Listings
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Payment History</h2>
            
            <div className="flex items-center space-x-3">
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search payments by property name, ID, or transaction..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F3A34] focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <CustomSelect
                  value={statusFilter}
                  options={statusOptions}
                  onChange={setStatusFilter}
                  className="w-full"
                  variant="compact"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <CustomSelect
                  value={dateRange}
                  options={dateOptions}
                  onChange={setDateRange}
                  className="w-full"
                  variant="compact"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold">{filteredPayments.length}</span> of{' '}
              <span className="font-semibold">{payments.length}</span> payments
            </p>
            
            {filteredPayments.length === 0 && payments.length > 0 && (
              <p className="text-sm text-yellow-600">
                No payments found with current filters
              </p>
            )}
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {filteredPayments.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Payment ID</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Property</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Amount</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Date</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Status</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredPayments.map((payment) => {
                      const statusInfo = getStatusInfo(payment.status);
                      
                      return (
                        <tr key={payment.id} className="hover:bg-gray-50">
                          <td className="py-4 px-6">
                            <div>
                              <p className="font-medium text-gray-900">{payment.id}</p>
                              <p className="text-xs text-gray-500">{payment.transactionId || 'No transaction ID'}</p>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <p className="font-medium text-gray-900">{payment.property}</p>
                            <p className="text-sm text-gray-600">Featured Listing</p>
                          </td>
                          <td className="py-4 px-6">
                            <p className="font-bold text-gray-900">
                              {formatCurrency(payment.amount, payment.currency)}
                            </p>
                          </td>
                          <td className="py-4 px-6">
                            <div>
                              <p className="text-gray-900">Paid: {formatDate(payment.date)}</p>
                              <p className="text-sm text-gray-600">
                                Due: {formatDate(payment.dueDate)}
                              </p>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                              {statusInfo.icon}
                              <span className="ml-1">{statusInfo.label}</span>
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-2">
                              {payment.receiptUrl && (
                                <button
                                  onClick={() => handleViewReceipt(payment)}
                                  className="flex items-center px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                                >
                                  <Receipt className="h-4 w-4 mr-1" />
                                  Receipt
                                </button>
                              )}
                              
                              <button
                                onClick={() => handleDownloadInvoice(payment)}
                                className="flex items-center px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Invoice
                              </button>
                              
                              {payment.status === 'failed' && (
                                <button
                                  onClick={() => handleRetryPayment(payment)}
                                  className="flex items-center px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded"
                                >
                                  <CreditCard className="h-4 w-4 mr-1" />
                                  Retry
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden divide-y">
                {filteredPayments.map((payment) => {
                  const statusInfo = getStatusInfo(payment.status);
                  
                  return (
                    <div key={payment.id} className="p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{payment.property}</h3>
                          <p className="text-sm text-gray-600">Payment ID: {payment.id}</p>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                          {statusInfo.icon}
                          <span className="ml-1">{statusInfo.label}</span>
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Amount</p>
                          <p className="font-bold text-gray-900">
                            {formatCurrency(payment.amount, payment.currency)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Date</p>
                          <p className="text-gray-900">{formatDate(payment.date)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {payment.receiptUrl && (
                            <button
                              onClick={() => handleViewReceipt(payment)}
                              className="flex items-center px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <Receipt className="h-4 w-4 mr-1" />
                              Receipt
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleDownloadInvoice(payment)}
                            className="flex items-center px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Invoice
                          </button>
                        </div>
                        
                        {payment.status === 'failed' && (
                          <button
                            onClick={() => handleRetryPayment(payment)}
                            className="flex items-center px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded"
                          >
                            Retry
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="p-12 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <CreditCard className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
              <p className="text-gray-600 mb-6">
                {payments.length === 0 
                  ? "You haven't made any payments yet." 
                  : "Try adjusting your search or filters."}
              </p>
              {payments.length === 0 && (
                <button
                  onClick={() => console.log('Make first payment')}
                  className="inline-flex items-center px-4 py-2 bg-[#004087] text-white rounded-lg hover:bg-[#004797]"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Make Your First Payment
                </button>
              )}
            </div>
          )}
        </div>

        {/* Payment Analytics */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-1 gap-6">  
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Payment Reminders
            </h3>
            
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-medium text-blue-800">Upcoming Payment</p>
                <p className="text-sm text-blue-700 mt-1">
                  Luxury Beachfront Villa - Due on Jan 15, 2024
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}