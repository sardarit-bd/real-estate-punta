'use client';

import React from 'react';
import {
  Home,
  DollarSign,
  Eye,
  Star,
  TrendingUp,
  PlusCircle,
  Download
} from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function OwnerDashboard() {
  const { t } = useTranslation();

  const { data, isLoading } = useQuery({
    queryKey: ['owner-dashboard'],
    queryFn: async () => {
      const res = await axios.get(
        `${API_BASE}/api/dashboard/owner-summary`,
        { withCredentials: true }
      );
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1F3A34]" />
      </div>
    );
  }

  const stats = {
    totalProperties: data?.stats.totalProperties,
    activeProperties: data?.stats.activeListings,
    totalRevenue: data?.stats.monthlyRevenue,
    featuredProperties: data?.stats.featuredProperties,
  };

  const statCards = [
    {
      title: t('dashboard.owner.stats.totalProperties'),
      value: stats.totalProperties,
      icon: <Home className="h-6 w-6" />,
      color: 'bg-blue-50 text-blue-600',
      change: t('dashboard.owner.changes.thisMonth', { defaultValue: '+0 this month' }),
    },
    {
      title: t('dashboard.owner.stats.activeListings'),
      value: stats.activeProperties,
      icon: <Eye className="h-6 w-6" />,
      color: 'bg-green-50 text-green-600',
      change: t('dashboard.owner.changes.activeRate', { defaultValue: '0% active rate' }),
    },
    {
      title: t('dashboard.owner.stats.totalRevenue'),
      value: `$${stats.totalRevenue}`,
      icon: <DollarSign className="h-6 w-6" />,
      color: 'bg-purple-50 text-purple-600',
      change: t('dashboard.owner.changes.revenue', { defaultValue: '+$0 this month' }),
    },
    {
      title: t('dashboard.owner.stats.featuredProperties'),
      value: stats.featuredProperties,
      icon: <Star className="h-6 w-6" />,
      color: 'bg-yellow-50 text-yellow-600',
      change: t('dashboard.owner.changes.moreViews', { defaultValue: 'Get more views' }),
    },
  ];

  const quickActions = [
    {
      title: t('dashboard.owner.actions.addProperty'),
      icon: <PlusCircle className="h-5 w-5" />,
      href: '/owner/properties/add',
      color: 'bg-[#1F3A34] hover:bg-[#2a4d45]',
    },
    {
      title: t('dashboard.owner.actions.viewProperties'),
      icon: <Home className="h-5 w-5" />,
      href: '/owner/properties',
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      title: t('dashboard.owner.actions.paymentHistory'),
      icon: <DollarSign className="h-5 w-5" />,
      href: '/owner/payments',
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      title: t('dashboard.owner.actions.analytics'),
      icon: <TrendingUp className="h-5 w-5" />,
      href: '/owner/analytics',
      color: 'bg-purple-600 hover:bg-purple-700',
    },
  ];

  const recentProperties = data?.recentProperties || [];
  const recentPayments = data?.recentPayments || [];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {t('dashboard.owner.title')}
          </h1>
          <p className="text-gray-600">
            {t('dashboard.owner.subtitle')}
          </p>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
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
                <h2 className="text-lg font-semibold text-gray-900">
                  {t('dashboard.owner.sections.recentProperties')}
                </h2>
                {/* <Link
                  href="/owner/properties"
                  className="text-[#1F3A34] hover:text-[#2a4d45] font-medium"
                >
                  {t('dashboard.owner.sections.viewAll')} →
                </Link> */}
              </div>

              <div className="space-y-4">
                {recentProperties.map((property) => (
                  <div
                    key={property.id || property._id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Home className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {property.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <span>
                            {property.displayPrice || property.price}
                          </span>
                          {property.views && (
                            <span className="flex items-center">
                              <Eye className="h-3 w-3 mr-1" />
                              {property.views} {t('dashboard.owner.labels.views')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          property.status?.toLowerCase() === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {property.status}
                      </span>

                      {property.featured && (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                          {t('dashboard.owner.labels.featured')}
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
                <h2 className="text-lg font-semibold text-gray-900">
                  {t('dashboard.owner.sections.recentPayments')}
                </h2>
                {/* <Link
                  href="/owner/payments"
                  className="text-[#1F3A34] hover:text-[#2a4d45] font-medium"
                >
                  {t('dashboard.owner.sections.viewAll')} →
                </Link> */}
              </div>

              <div className="space-y-4">
                {recentPayments.map((payment) => (
                  <div
                    key={payment.id || payment._id}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {payment.property}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {payment.date}
                        </p>
                      </div>
                      <span className="font-bold text-gray-900">
                        {payment.amount}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          payment.status?.toLowerCase() === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {payment.status}
                      </span>
                      <button className="text-sm text-[#1F3A34] hover:text-[#2a4d45] font-medium">
                        {t('dashboard.owner.labels.receipt')}
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
