'use client';

import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Filter,
  Search,
  CreditCard,
  Banknote,
  TrendingUp,
  Wallet,
  History,
  Bell
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function TenantPayments() {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalPaid: 0,
    dueAmount: 0,
    upcomingPayments: 0,
    paymentHistory: []
  });
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 'bank', name: 'Bank Transfer', icon: Banknote, isDefault: true },
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
    { id: 'mobile', name: 'Mobile Banking', icon: Wallet },
    { id: 'cash', name: 'Cash', icon: DollarSign }
  ]);

  // Sample data - In real app, fetch from API
  useEffect(() => {
    const sampleTransactions = [
      {
        id: 1,
        date: '2024-03-15',
        amount: 1500,
        type: 'rent',
        status: 'paid',
        dueDate: '2024-03-01',
        paymentMethod: 'bank',
        reference: 'TX-001234',
        property: '123 Main St, Apt 4B',
        category: 'Monthly Rent'
      },
      {
        id: 2,
        date: '2024-03-10',
        amount: 120,
        type: 'utility',
        status: 'paid',
        dueDate: '2024-03-05',
        paymentMethod: 'card',
        reference: 'TX-001235',
        property: '123 Main St, Apt 4B',
        category: 'Electricity Bill'
      },
      {
        id: 3,
        date: '2024-04-01',
        amount: 1500,
        type: 'rent',
        status: 'pending',
        dueDate: '2024-04-01',
        paymentMethod: 'bank',
        reference: 'TX-001236',
        property: '123 Main St, Apt 4B',
        category: 'Monthly Rent'
      },
      {
        id: 4,
        date: '2024-02-15',
        amount: 1500,
        type: 'rent',
        status: 'paid',
        dueDate: '2024-02-01',
        paymentMethod: 'bank',
        reference: 'TX-001233',
        property: '123 Main St, Apt 4B',
        category: 'Monthly Rent'
      },
      {
        id: 5,
        date: '2024-04-05',
        amount: 80,
        type: 'utility',
        status: 'upcoming',
        dueDate: '2024-04-05',
        paymentMethod: 'mobile',
        reference: 'TX-001237',
        property: '123 Main St, Apt 4B',
        category: 'Water Bill'
      },
      {
        id: 6,
        date: '2024-03-01',
        amount: 500,
        type: 'security',
        status: 'paid',
        dueDate: '2024-02-15',
        paymentMethod: 'bank',
        reference: 'TX-001200',
        property: '123 Main St, Apt 4B',
        category: 'Security Deposit'
      }
    ];

    const statsData = {
      totalPaid: 4700,
      dueAmount: 1580,
      upcomingPayments: 1580,
      paymentHistory: sampleTransactions.filter(t => t.status === 'paid')
    };

    setTransactions(sampleTransactions);
    setStats(statsData);
  }, []);

  const filteredTransactions = transactions.filter(transaction => {
    if (filter !== 'all' && transaction.status !== filter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        transaction.reference.toLowerCase().includes(query) ||
        transaction.property.toLowerCase().includes(query) ||
        transaction.category.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const handleMakePayment = async (transaction) => {
    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update transaction status
      const updatedTransactions = transactions.map(t => 
        t.id === transaction.id ? { ...t, status: 'paid', date: new Date().toISOString().split('T')[0] } : t
      );
      
      setTransactions(updatedTransactions);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalPaid: prev.totalPaid + transaction.amount,
        dueAmount: prev.dueAmount - transaction.amount,
        upcomingPayments: prev.upcomingPayments - transaction.amount,
        paymentHistory: [...prev.paymentHistory, { ...transaction, status: 'paid', date: new Date().toISOString().split('T')[0] }]
      }));
      
      toast.success(`Payment of $${transaction.amount} completed successfully!`);
      setSelectedPayment(null);
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetReminder = (transaction) => {
    toast.success(`Reminder set for payment due on ${transaction.dueDate}`);
  };

  const handleDownloadReceipt = (transaction) => {
    // Simulate receipt download
    const receiptContent = `
      Payment Receipt
      =================
      Reference: ${transaction.reference}
      Date: ${transaction.date}
      Amount: $${transaction.amount}
      Property: ${transaction.property}
      Category: ${transaction.category}
      Status: ${transaction.status}
      Payment Method: ${paymentMethods.find(p => p.id === transaction.paymentMethod)?.name}
      
      Thank you for your payment!
    `;
    
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Receipt-${transaction.reference}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Receipt downloaded successfully!');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'upcoming': return <Calendar className="h-4 w-4" />;
      case 'overdue': return <AlertCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Dashboard</h1>
        <p className="text-gray-600">Manage your rent and utility payments</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Paid</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalPaid)}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Lifetime payment amount</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Due Amount</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(stats.dueAmount)}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Amount due for payment</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Upcoming Payments</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats.upcomingPayments)}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Due in next 30 days</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Payment History</p>
              <p className="text-2xl font-bold text-purple-600">{stats.paymentHistory.length}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <History className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Total transactions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Payment Methods & Quick Actions */}
        <div className="lg:col-span-2">
          {/* Search and Filter */}
          <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions by reference, property..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <select
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Payments</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="overdue">Overdue</option>
                </select>
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </button>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Date</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Description</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Amount</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{formatDate(transaction.date)}</p>
                          <p className="text-xs text-gray-500">Due: {formatDate(transaction.dueDate)}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{transaction.category}</p>
                          <p className="text-sm text-gray-500">{transaction.property}</p>
                          <p className="text-xs text-gray-400">Ref: {transaction.reference}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-bold text-gray-900">{formatCurrency(transaction.amount)}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                          {getStatusIcon(transaction.status)}
                          <span className="ml-1 capitalize">{transaction.status}</span>
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          {transaction.status !== 'paid' && (
                            <button
                              onClick={() => handleMakePayment(transaction)}
                              className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                            >
                              Pay Now
                            </button>
                          )}
                          {transaction.status === 'paid' && (
                            <button
                              onClick={() => handleDownloadReceipt(transaction)}
                              className="px-3 py-1 border border-gray-300 text-sm rounded-lg hover:bg-gray-50 flex items-center"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Receipt
                            </button>
                          )}
                          {transaction.status === 'upcoming' && (
                            <button
                              onClick={() => handleSetReminder(transaction)}
                              className="px-3 py-1 border border-blue-300 text-blue-600 text-sm rounded-lg hover:bg-blue-50 flex items-center"
                            >
                              <Bell className="h-3 w-3 mr-1" />
                              Remind
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredTransactions.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">No transactions found</div>
                <button
                  onClick={() => { setFilter('all'); setSearchQuery(''); }}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>

          {/* Payment Methods Section */}
          <div className="mt-6 bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Methods</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`p-4 border rounded-lg ${method.isDefault ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="p-2 bg-white rounded-lg mr-3">
                        <method.icon className="h-5 w-5 text-gray-700" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{method.name}</p>
                        {method.isDefault && (
                          <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded">Default</span>
                        )}
                      </div>
                    </div>
                    {!method.isDefault && (
                      <button className="text-sm text-blue-600 hover:text-blue-700">
                        Set as Default
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700">
              + Add New Payment Method
            </button>
          </div>
        </div>

        {/* Right Column - Quick Actions & Insights */}
        <div className="space-y-6">
          {/* Quick Pay Section */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Pay</h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Next Payment Due</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(1500)}</p>
                <p className="text-sm text-gray-500">Monthly Rent - Due Apr 1</p>
                <button
                  onClick={() => {
                    const nextRent = transactions.find(t => t.type === 'rent' && t.status === 'pending');
                    if (nextRent) handleMakePayment(nextRent);
                  }}
                  className="mt-3 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Pay Now
                </button>
              </div>

              {/* <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Auto Pay</p>
                <p className="font-medium text-gray-900">Set up automatic payments</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm text-gray-600">Status: Inactive</span>
                  <button className="px-4 py-1 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
                    Enable
                  </button>
                </div>
              </div> */}
            </div>
          </div>

          {/* Insights */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Payment Insights
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">On-time payments</p>
                <span className="font-medium text-green-600">100%</span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">Average payment time</p>
                <span className="font-medium text-blue-600">2 days early</span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">Payment streak</p>
                <span className="font-medium text-purple-600">6 months</span>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600 mb-2">Monthly Breakdown</p>
                <div className="space-y-2">
                  {['Jan', 'Feb', 'Mar', 'Apr'].map((month, index) => (
                    <div key={month} className="flex items-center">
                      <span className="w-12 text-sm text-gray-600">{month}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 rounded-full h-2" 
                          style={{ width: `${100 - (index * 20)}%` }}
                        ></div>
                      </div>
                      <span className="w-12 text-right text-sm font-medium">
                        ${1500 - (index * 100)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {stats.paymentHistory.slice(0, 3).map((payment) => (
                <div key={payment.id} className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{payment.category}</p>
                    <p className="text-xs text-gray-500">{formatDate(payment.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{formatCurrency(payment.amount)}</p>
                    <p className="text-xs text-green-600">Paid</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
              View All Activity
            </button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Payment</h3>
            <div className="space-y-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Amount to pay</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(selectedPayment.amount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Select payment method</p>
                <select className="w-full px-4 py-2 border rounded-lg">
                  {paymentMethods.map(method => (
                    <option key={method.id} value={method.id}>{method.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setSelectedPayment(null)}
                className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleMakePayment(selectedPayment)}
                disabled={loading}
                className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Confirm Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}