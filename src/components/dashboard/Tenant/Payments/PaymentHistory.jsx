'use client';

import React, { useState } from 'react';
import { Calendar, Filter, Download, Eye, TrendingUp, BarChart } from 'lucide-react';

export default function PaymentHistory({ transactions = [] }) {
  const [timeRange, setTimeRange] = useState('3months');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const filterTransactions = () => {
    const now = new Date();
    let filtered = [...transactions];

    switch (timeRange) {
      case 'month':
        filtered = filtered.filter(t => {
          const transDate = new Date(t.date);
          return transDate.getMonth() === now.getMonth() && 
                 transDate.getFullYear() === now.getFullYear();
        });
        break;
      case '3months':
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        filtered = filtered.filter(t => new Date(t.date) >= threeMonthsAgo);
        break;
      case 'year':
        filtered = filtered.filter(t => new Date(t.date).getFullYear() === selectedYear);
        break;
    }

    return filtered;
  };

  const getMonthlySummary = () => {
    const monthlyData = {};
    const filtered = filterTransactions();
    
    filtered.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = {
          total: 0,
          rent: 0,
          utilities: 0,
          other: 0,
          count: 0
        };
      }
      
      monthlyData[monthYear].total += transaction.amount;
      monthlyData[monthYear].count++;
      
      if (transaction.type === 'rent') {
        monthlyData[monthYear].rent += transaction.amount;
      } else if (transaction.type === 'utility') {
        monthlyData[monthYear].utilities += transaction.amount;
      } else {
        monthlyData[monthYear].other += transaction.amount;
      }
    });

    return Object.entries(monthlyData)
      .map(([monthYear, data]) => ({
        monthYear,
        ...data
      }))
      .sort((a, b) => b.monthYear.localeCompare(a.monthYear));
  };

  const monthlySummary = getMonthlySummary();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatMonthYear = (monthYear) => {
    const [year, month] = monthYear.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Amount', 'Status', 'Type', 'Reference'];
    const csvContent = [
      headers.join(','),
      ...transactions.map(t => [
        t.date,
        t.category,
        t.amount,
        t.status,
        t.type,
        t.reference
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment-history-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Payment History</h2>
            <p className="text-gray-600">Track and analyze your payment patterns</p>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="month">This Month</option>
              <option value="3months">Last 3 Months</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>
            
            <button
              onClick={exportToCSV}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="p-6 border-b">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Paid</p>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(monthlySummary.reduce((sum, month) => sum + month.total, 0))}
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Average Monthly</p>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(monthlySummary.length > 0 ? 
                monthlySummary.reduce((sum, month) => sum + month.total, 0) / monthlySummary.length : 
                0)}
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Transactions</p>
            <p className="text-xl font-bold text-gray-900">
              {monthlySummary.reduce((sum, month) => sum + month.count, 0)}
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-gray-600">On-time Rate</p>
            <p className="text-xl font-bold text-gray-900">100%</p>
          </div>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart className="h-5 w-5 mr-2" />
          Monthly Breakdown
        </h3>
        
        <div className="space-y-4">
          {monthlySummary.map((monthData) => (
            <div key={monthData.monthYear} className="p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-900">
                  {formatMonthYear(monthData.monthYear)}
                </h4>
                <span className="font-bold text-gray-900">
                  {formatCurrency(monthData.total)}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Rent:</span>
                  <span className="font-medium">{formatCurrency(monthData.rent)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Utilities:</span>
                  <span className="font-medium">{formatCurrency(monthData.utilities)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Other:</span>
                  <span className="font-medium">{formatCurrency(monthData.other)}</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Transactions:</span>
                    <span className="font-medium">{monthData.count}</span>
                  </div>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="mt-3">
                <div className="flex h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-500" 
                    style={{ width: `${(monthData.rent / monthData.total) * 100}%` }}
                  ></div>
                  <div 
                    className="bg-green-500" 
                    style={{ width: `${(monthData.utilities / monthData.total) * 100}%` }}
                  ></div>
                  <div 
                    className="bg-purple-500" 
                    style={{ width: `${(monthData.other / monthData.total) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Rent</span>
                  <span>Utilities</span>
                  <span>Other</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}