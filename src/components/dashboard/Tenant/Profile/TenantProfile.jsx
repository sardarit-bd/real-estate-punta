'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Home,
  Edit,
  Camera,
  CheckCircle,
  FileText,
  ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthContext } from '@/providers/AuthProvider';
import { PersonalInfo } from './PersonalInfo';
import { PropertiesInfo } from './PropertiesInfo';
import { DocumentsInfo } from './DocumentsInfo';
import { PreferencesInfo } from './PreferencesInfo';

export default function TenantProfile() {
  const { user: authUser, updateProfile } = useAuthContext();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (authUser) {
      // Transform backend user data to frontend format
      const transformedUser = {
        id: authUser._id,
        name: authUser.name,
        email: authUser.email,
        phone: authUser.profile?.phone || '',
        company: authUser.profile?.company || '',
        avatar: authUser.profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${authUser.name}`,
        joinDate: authUser.createdAt ? new Date(authUser.createdAt).toISOString() : new Date().toISOString(),
        status: 'active',
        location: {
          address: authUser.profile?.address?.street || '',
          city: authUser.profile?.address?.city || '',
          state: '', // Add if you have state in backend
          zip: '',   // Add if you have zip in backend
          country: authUser.profile?.address?.country || '',
        },
        // Sample data (you should fetch these from backend)
        emergencyContact: {
          name: 'Jane Doe',
          phone: '+1 (555) 987-6543',
          relationship: 'Spouse'
        },
        preferences: {
          notifications: true,
          emailUpdates: true,
          smsAlerts: false,
          autoPay: true
        },
        documents: [
          { id: 1, name: 'Lease Agreement', type: 'pdf', date: '2024-01-15' },
          { id: 2, name: 'ID Proof', type: 'jpg', date: '2024-01-10' },
        ],
        properties: [],
        paymentMethods: [],
      };
      setUser(transformedUser);
    }
  }, [authUser]);

  const handleSaveProfile = async (formData) => {
    setLoading(true);
    try {
      // Format data according to backend schema
      const payload = {
        name: formData.name,
        profile: {
          phone: formData.phone,
          company: formData.company || '',
          address: {
            street: formData.location?.address || '',
            city: formData.location?.city || '',
            country: formData.location?.country || '',
          },
        },
      };

      await updateProfile(payload);
      
      // Update local state
      setUser(prev => ({
        ...prev,
        ...formData
      }));
      
      setEditMode(false);
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadDocument = async (file) => {
    setLoading(true);
    try {
      // Implement actual file upload logic here
      const formData = new FormData();
      formData.append('file', file);
      
      // Example upload endpoint
      // await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload`, formData, {
      //   withCredentials: true,
      //   headers: { 'Content-Type': 'multipart/form-data' }
      // });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Document uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload document');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading profile...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600">Manage your account and settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            {/* Profile Summary */}
            <div className="text-center mb-6">
              <div className="relative inline-block mb-4">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-24 h-24 rounded-full mx-auto border-4 border-white shadow-lg"
                />
                <button className="absolute bottom-0 right-0 p-2 bg-[#004087] text-white rounded-full hover:bg-[#0250a8]">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mt-2">
                <CheckCircle className="h-3 w-3 mr-1" />
                Active Tenant
              </span>
            </div>

            {/* Stats */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Member Since</span>
                <span className="font-medium">{new Date(user.joinDate).getFullYear()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Properties</span>
                <span className="font-medium">{user.properties?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Documents</span>
                <span className="font-medium">{user.documents?.length || 0}</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
              {[
                { id: 'personal', label: 'Personal Info', icon: User },
                { id: 'documents', label: 'Documents', icon: FileText },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${activeTab === item.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <div className="flex items-center">
                    <item.icon className={`h-5 w-5 mr-3 ${activeTab === item.id ? 'text-blue-600' : 'text-gray-500'}`} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            {/* Tab Header */}
            <div className="border-b">
              <div className="flex justify-between items-center p-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {activeTab === 'personal' && 'Personal Information'}
                    {activeTab === 'properties' && 'My Properties'}
                    {activeTab === 'documents' && 'Documents'}
                    {activeTab === 'preferences' && 'Preferences'}
                  </h2>
                  <p className="text-gray-600">
                    {activeTab === 'personal' && 'Update your personal details'}
                    {activeTab === 'properties' && 'View and manage your rented properties'}
                    {activeTab === 'documents' && 'Manage your documents and files'}
                    {activeTab === 'preferences' && 'Account preferences and notifications'}
                  </p>
                </div>
                {activeTab === 'personal' && (
                  <button
                    onClick={() => setEditMode(!editMode)}
                    disabled={loading}
                    className="px-4 py-2 bg-[#004087] text-white rounded-lg hover:bg-[#0250a8] flex items-center disabled:opacity-50"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {editMode ? 'Cancel Edit' : 'Edit Profile'}
                  </button>
                )}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'personal' && (
                <PersonalInfo
                  user={user}
                  editMode={editMode}
                  onSave={handleSaveProfile}
                  loading={loading}
                />
              )}

              {activeTab === 'properties' && (
                <PropertiesInfo properties={user.properties || []} />
              )}

              {activeTab === 'documents' && (
                <DocumentsInfo
                  documents={user.documents || []}
                  onUpload={handleUploadDocument}
                />
              )}

              {activeTab === 'preferences' && (
                <PreferencesInfo
                  preferences={user.preferences || {}}
                  onUpdate={handleSaveProfile}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}