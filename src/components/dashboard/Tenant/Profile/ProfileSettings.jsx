'use client';

import React, { useState } from 'react';
import { 
  Bell, 
  Globe, 
  Eye, 
  Palette,
  Moon,
  Smartphone,
  Headphones,
  HelpCircle,
  FileText,
  Shield,
  Download,
  Upload
} from 'lucide-react';

export default function ProfileSettings() {
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'en',
    fontSize: 'medium',
    timezone: 'America/New_York',
    autoSave: true,
    showOnlineStatus: true,
    dataUsage: 'balanced'
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
      
      <div className="space-y-8">
        {/* Appearance */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Palette className="h-5 w-5 mr-2" />
            Appearance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
              <select
                value={settings.theme}
                onChange={(e) => handleSettingChange('theme', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System Default</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
              <select
                value={settings.fontSize}
                onChange={(e) => handleSettingChange('fontSize', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>
        </div>

        {/* Language & Region */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Language & Region
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="bn">Bengali</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
              <select
                value={settings.timezone}
                onChange={(e) => handleSettingChange('timezone', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
              </select>
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Eye className="h-5 w-5 mr-2" />
            Privacy
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Show Online Status</p>
                <p className="text-sm text-gray-600">Let others see when you're online</p>
              </div>
              <button
                onClick={() => handleSettingChange('showOnlineStatus', !settings.showOnlineStatus)}
                className={`w-12 h-6 rounded-full transition-colors ${settings.showOnlineStatus ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${settings.showOnlineStatus ? 'translate-x-7' : 'translate-x-1'}`}></div>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Auto-save Documents</p>
                <p className="text-sm text-gray-600">Automatically save uploaded documents</p>
              </div>
              <button
                onClick={() => handleSettingChange('autoSave', !settings.autoSave)}
                className={`w-12 h-6 rounded-full transition-colors ${settings.autoSave ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${settings.autoSave ? 'translate-x-7' : 'translate-x-1'}`}></div>
              </button>
            </div>
          </div>
        </div>

        {/* Data Usage */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Usage</h3>
          <div className="space-y-3">
            {[
              { value: 'low', label: 'Low', description: 'Save data, slower loading' },
              { value: 'balanced', label: 'Balanced', description: 'Recommended for most users' },
              { value: 'high', label: 'High', description: 'Best experience, uses more data' }
            ].map((option) => (
              <label key={option.value} className="flex items-center p-3 border rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="dataUsage"
                  value={option.value}
                  checked={settings.dataUsage === option.value}
                  onChange={(e) => handleSettingChange('dataUsage', e.target.value)}
                  className="mr-3"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{option.label}</p>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Export & Import */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="flex items-center justify-center p-4 border rounded-lg hover:bg-gray-50">
              <Download className="h-5 w-5 mr-2" />
              Export All Data
            </button>
            <button className="flex items-center justify-center p-4 border rounded-lg hover:bg-gray-50">
              <Upload className="h-5 w-5 mr-2" />
              Import Data
            </button>
          </div>
        </div>

        {/* Help & Support */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <HelpCircle className="h-5 w-5 mr-2" />
            Help & Support
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border rounded-lg hover:bg-gray-50">
              <Headphones className="h-5 w-5 mx-auto mb-2" />
              <p className="font-medium text-gray-900">Contact Support</p>
            </button>
            <button className="p-4 border rounded-lg hover:bg-gray-50">
              <FileText className="h-5 w-5 mx-auto mb-2" />
              <p className="font-medium text-gray-900">Help Center</p>
            </button>
            <button className="p-4 border rounded-lg hover:bg-gray-50">
              <Shield className="h-5 w-5 mx-auto mb-2" />
              <p className="font-medium text-gray-900">Privacy Policy</p>
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-6 border-t">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Save All Changes
          </button>
        </div>
      </div>
    </div>
  );
}