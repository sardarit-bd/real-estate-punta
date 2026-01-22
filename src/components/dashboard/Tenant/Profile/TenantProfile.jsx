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
import axios from 'axios';
import { ChangePassword } from './ChangePassword';
import { set } from 'zod';
import Loader from '@/components/common/Loader';

export default function TenantProfile() {
  const { user: authUser, updateProfile, getProfile } = useAuthContext();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [editMode, setEditMode] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [documents, setDocuments] = useState([]);


  useEffect(() => {
    async function fetchProfile() {
      if (authUser) {
        const profile = await getProfile();

        const transformedUser = {
          id: profile._id,
          name: profile.name,
          email: profile.email,
          phone: profile?.tenantInfo?.phone || '',
          avatar: profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`,
          joinDate: profile.createdAt ? new Date(profile.createdAt).toISOString() : new Date().toISOString(),
          status: 'active',
          address: profile?.tenantInfo?.address || '',
          city: profile?.tenantInfo?.city || '',
          country: profile?.tenantInfo?.country || '',
          verified: profile?.verified,
          documents: profile?.tenantInfo?.documents || [],
        };
        setUser(transformedUser);
        setDocuments(transformedUser.documents);

        setImagePreview(
          transformedUser.avatar ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${authUser.name}`
        );
      }
    }

    fetchProfile();
  }, [authUser]);

  const handleSaveProfile = async (formData) => {
    setLoading(true);

    try {
      let avatarUrl = user.avatar;

      if (imageFile) {
        const fd = new FormData();
        fd.append("image", imageFile);

        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload/image`,
          fd,
          { withCredentials: true }
        );

        avatarUrl = res.data.data.url;
      }

      const payload = {
        name: formData.name,
        phone: formData.phone,
        avatar: avatarUrl,
        address: formData.address || '',
        city: formData.city || '',
        country: formData.country || '',

      }

      await updateProfile(payload);
      const updatedProfile = await getProfile();

      const transformedUser = {
        id: updatedProfile._id,
        name: updatedProfile.name,
        email: updatedProfile.email,
        phone: updatedProfile?.tenantInfo?.phone || '',
        avatar: avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${updatedProfile.name}`,
        joinDate: updatedProfile.createdAt ? new Date(updatedProfile.createdAt).toISOString() : new Date().toISOString(),
        status: 'active',
        address: updatedProfile?.tenantInfo?.address || '',
        city: updatedProfile?.tenantInfo?.city || '',
        country: updatedProfile?.tenantInfo?.country || '',
      };

      setUser(transformedUser);
      setEditMode(false);
      setImageFile(null);
    } catch (error) {
      toast.error("Profile update failed");
    } finally {
      setLoading(false);
    }
  };


  const handleUploadDocument = async (newDocument) => {
    setLoading(true);
    try {
      // Update documents state
      await updateProfile({
        documents: [...documents, newDocument]
      });
      setDocuments(prev => [...prev, newDocument]);
    } catch (error) {
      toast.error('Failed to upload document');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <Loader />
  }

  return (
    <div className="min-h-screen  p-4 md:p-6">
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
                  src={imagePreview}
                  alt={user.name}
                  className="w-24 h-24 rounded-full mx-auto border-4 border-white shadow-lg object-cover"
                />

                {editMode && (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="avatar-upload"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;

                        if (!file.type.startsWith("image/")) {
                          toast.error("Only image files allowed");
                          return;
                        }

                        if (file.size > 5 * 1024 * 1024) {
                          toast.error("Max 5MB allowed");
                          return;
                        }
                        setImageFile(file);
                        setImagePreview(URL.createObjectURL(file));
                      }}

                    />


                    <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-0 right-0 p-2 bg-[#004087] text-white rounded-full cursor-pointer hover:bg-[#0250a8]"
                    >
                      <Camera className="h-4 w-4" />
                    </label>
                  </>
                )}
              </div>
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mt-2">
                <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {user?.verified ? "Verified" : "Not Verified"}
              </span>

              {!user?.verified && (
                <p className="text-xs text-gray-500 mt-1">
                  {documents?.length > 0
                    ? "Documents submitted for verification"
                    : "Upload documents to verify your account"}
                </p>
              )}
            </div>

            {/* Stats */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Member Since</span>
                <span className="font-medium">{new Date(user.joinDate).getFullYear()}</span>
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

          <ChangePassword />

        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border">
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


              {activeTab === 'documents' && (
                <DocumentsInfo
                  documents={documents || []}
                  onUpload={handleUploadDocument}
                />
              )}


            </div>
          </div>
        </div>
      </div>
    </div>
  );
}