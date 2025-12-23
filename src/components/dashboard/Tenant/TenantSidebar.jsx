'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  FileText,
  MessageSquare,
  Settings,
  Bell,
  User,
  HelpCircle,
  LogOut,
  Wrench,
  CreditCard,
} from 'lucide-react';

const tenantNavItems = [
  {
    title: 'Dashboard',
    href: '/dashboard/tenant',
    icon: <Home className="h-5 w-5" />
  },
  {
    title: 'My Properties',
    href: '/dashboard/tenant/properties',
    icon: <Home className="h-5 w-5" />
  },
  {
    title: 'Payments',
    href: '/dashboard/tenant/payments',
    icon: <CreditCard className="h-5 w-5" />
  },
  {
    title: 'Leases',
    href: '/dashboard/tenant/leases',
    icon: <FileText className="h-5 w-5" />
  },
  {
    title: 'Maintenance',
    href: '/dashboard/tenant/maintenance',
    icon: <Wrench className="h-5 w-5" />
  },
  {
    title: 'Messages',
    href: '/dashboard/tenant/messages',
    icon: <MessageSquare className="h-5 w-5" />
  },
  {
    title: 'Documents',
    href: '/dashboard/tenant/documents',
    icon: <FileText className="h-5 w-5" />
  },
  {
    title: 'Notifications',
    href: '/dashboard/tenant/notifications',
    icon: <Bell className="h-5 w-5" />
  },
  {
    title: 'Profile',
    href: '/dashboard/tenant/profile',
    icon: <User className="h-5 w-5" />
  },
  {
    title: 'Settings',
    href: '/dashboard/tenant/settings',
    icon: <Settings className="h-5 w-5" />
  },
];

export default function TenantSidebar() {
  const pathname = usePathname();

  return (
    <div className="h-full w-64 bg-white border-r flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-[#1F3A34]">Tenant Portal</h1>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {tenantNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-[#1F3A34] text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <span className={isActive ? 'text-white' : 'text-gray-500'}>
                  {item.icon}
                </span>
                <span className="font-medium">{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>


      {/* Bottom Section */}
      <div className="p-4 border-t">
        <Link
          href="/dashboard/tenant/help"
          className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          <HelpCircle className="h-5 w-5" />
          <span className="font-medium">Help & Support</span>
        </Link>
        
        <button
          className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg w-full mt-2"
          onClick={() => {/* Add logout logic */}}
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}