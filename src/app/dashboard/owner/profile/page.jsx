'use client';

import AccountHeader from '@/components/dashboard/Admin/profile/AccountHeader';
import DangerZone from '@/components/dashboard/Admin/profile/DangerZone';
import LoadingSkeleton from '@/components/dashboard/Admin/profile/LoadingSkeleton';
import LocationInfoSection from '@/components/dashboard/Admin/profile/LocationInfoSection';
import PersonalInfoSection from '@/components/dashboard/Admin/profile/PersonalInfoSection';
import ProfileCard from '@/components/dashboard/Admin/profile/ProfileCard';
import SecurityCard from '@/components/dashboard/Admin/profile/SecurityCard';
import api from '@/lib/api';
import { useState, useEffect } from 'react';

export default function AccountPage() {
  const [userData, setUserData] = useState({});
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  /* ================= FETCH PROFILE ================= */
  const fetchUserData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/auth/me');
      const u = res.data.data;

      const mappedUser = {
        name: u.name,
        email: u.email,
        role: u.role,
        joinDate: u.createdAt,

        phone: u.profile?.phone || '',
        bio: u.profile?.bio || '',
        company: u.profile?.company || '',
        website: u.profile?.website || '',
        profileImage: u.profile?.avatar || '/avatar-placeholder.png',

        address: u.profile?.address?.street || '',
        city: u.profile?.address?.city || '',
        country: u.profile?.address?.country || '',
      };

      setUserData(mappedUser);
      setFormData(mappedUser);
      setImagePreview(mappedUser.profileImage);
    } catch (err) {
      console.error('Profile fetch failed', err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= CANCEL ================= */
  const handleCancel = () => {
    setFormData(userData);
    setImagePreview(userData.profileImage);
    setImageFile(null);
    setIsEditing(false);
    setErrors({});
  };

  /* ================= UPDATE PROFILE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setSuccessMessage('');

    try {
      const payload = {
        name: formData.name,
        profile: {
          phone: formData.phone,
          bio: formData.bio,
          company: formData.company,
          website: formData.website,
          avatar: imagePreview, // later replace with cloudinary url
          address: {
            street: formData.address,
            city: formData.city,
            country: formData.country,
          },
        },
      };

      const res = await api.patch('/auth/users/me', payload);
      const u = res.data.data;

      const updatedUser = {
        name: u.name,
        email: u.email,
        role: u.role,
        joinDate: u.createdAt,

        phone: u.profile?.phone || '',
        bio: u.profile?.bio || '',
        company: u.profile?.company || '',
        website: u.profile?.website || '',
        profileImage: u.profile?.avatar || '/avatar-placeholder.png',

        address: u.profile?.address?.street || '',
        city: u.profile?.address?.city || '',
        country: u.profile?.address?.country || '',
      };

      setUserData(updatedUser);
      setFormData(updatedUser);
      setImagePreview(updatedUser.profileImage);

      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
    } catch (err) {
      setErrors({
        submit:
          err.response?.data?.message ||
          'Profile update failed. Please try again.',
      });
    } finally {
      setSaving(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen">
      <AccountHeader
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        saving={saving}
        handleCancel={handleCancel}
        successMessage={successMessage}
        errors={errors}
      />

      <div className="p-6">
        <form id="profile-form" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT */}
            <div className="lg:col-span-1 space-y-6">
              <ProfileCard
                userData={userData}
                formData={formData}
                isEditing={isEditing}
                imagePreview={imagePreview}
                setImageFile={setImageFile}
                setImagePreview={setImagePreview}
                setFormData={setFormData}
                errors={errors}
                setErrors={setErrors}
              />
              <SecurityCard />
            </div>

            {/* RIGHT */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border">
                <div className="px-6 py-4 border-b">
                  <h2 className="text-lg font-semibold">
                    Profile Information
                  </h2>
                </div>

                <div className="p-6 space-y-8">
                  <PersonalInfoSection
                    formData={formData}
                    isEditing={isEditing}
                    errors={errors}
                    setFormData={setFormData}
                    setErrors={setErrors}
                  />

                  <LocationInfoSection
                    formData={formData}
                    isEditing={isEditing}
                    setFormData={setFormData}
                  />
                </div>
              </div>

              {!isEditing && <DangerZone />}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
