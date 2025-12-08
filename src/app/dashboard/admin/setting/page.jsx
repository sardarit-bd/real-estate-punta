'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Upload,
  Video,
  User,
  Mail,
  Lock,
  Save,
  Play,
  Trash2,
  Eye,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

export default function AdminSettingsPage() {
  // Admin data
  const [adminData, setAdminData] = useState({
    name: '',
    email: '',
    role: 'admin'
  });

  // Video state
  const [instructionVideo, setInstructionVideo] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState('');
  
  // Form states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Load admin data
  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        const mockAdminData = {
          name: 'Admin User',
          email: 'admin@puntacana.com',
          role: 'admin',
          instructionVideo: 'https://example.com/admin-instructions.mp4'
        };
        
        setAdminData(mockAdminData);
        setInstructionVideo(mockAdminData.instructionVideo);
        setVideoPreview(mockAdminData.instructionVideo);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setLoading(false);
    }
  };

  // Handle video upload
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('video/')) {
      setErrors(prev => ({ ...prev, video: 'Please upload a video file' }));
      return;
    }

    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, video: 'Video size should be less than 50MB' }));
      return;
    }

    setVideoFile(file);
    
    // Create preview URL
    const videoURL = URL.createObjectURL(file);
    setVideoPreview(videoURL);
    
    // Clear video error
    if (errors.video) {
      setErrors(prev => ({ ...prev, video: '' }));
    }
  };

  // Remove video
  const removeVideo = () => {
    if (videoPreview && videoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(videoPreview);
    }
    setVideoFile(null);
    setVideoPreview('');
    setInstructionVideo(null);
  };

  // Handle admin info update
  const handleAdminUpdate = async (e) => {
    e.preventDefault();
    
    setSaving(true);
    setSuccessMessage('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccessMessage('Admin information updated successfully!');
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

    } catch (error) {
      console.error('Error updating admin:', error);
      setErrors({ submit: 'Failed to update. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  // Handle video upload submission
  const handleVideoSubmit = async () => {
    if (!videoFile && !videoPreview) {
      setErrors(prev => ({ ...prev, video: 'Please select a video file' }));
      return;
    }

    setUploading(true);
    setErrors({});

    try {
      // Simulate video upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real app, upload to server and get URL
      const uploadedVideoUrl = videoPreview;
      setInstructionVideo(uploadedVideoUrl);
      
      setSuccessMessage('Instruction video uploaded successfully!');
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

    } catch (error) {
      console.error('Error uploading video:', error);
      setErrors({ video: 'Failed to upload video. Please try again.' });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded-xl"></div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Settings</h1>
              <p className="text-gray-600">Manage admin profile and platform settings</p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-6">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <p className="text-green-800 font-medium">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <div className="mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
                <p className="text-red-800">{errors.submit}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Admin Information */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Admin Information
            </h2>

            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 inline mr-1" />
                  Name
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    defaultValue={adminData.name}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F3A34] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Email
                </label>
                <div className="flex items-center">
                  <input
                    type="email"
                    defaultValue={adminData.email}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F3A34] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <div className="px-4 py-2 bg-gray-50 rounded-lg">
                  <span className="font-medium text-[#1F3A34]">
                    {adminData.role.charAt(0).toUpperCase() + adminData.role.slice(1)}
                  </span>
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleAdminUpdate}
                disabled={saving}
                className="w-full flex items-center justify-center px-4 py-3 bg-[#1F3A34] text-white rounded-lg hover:bg-[#2a4d45] disabled:opacity-50 transition-colors"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>

              {/* Password Change */}
              <div className="pt-6 border-t">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Lock className="h-5 w-5 mr-2" />
                  Security
                </h3>
                <button
                  onClick={() => console.log('Change password')}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>

          {/* Instruction Video Upload */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Video className="h-5 w-5 mr-2" />
              Instruction Video
            </h2>

            <div className="space-y-6">
              {/* Video Upload Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Video Instructions
                </label>
                
                <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  errors.video ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-[#1F3A34]'
                }`}>
                  <input
                    type="file"
                    id="video-upload"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                  
                  <label
                    htmlFor="video-upload"
                    className="cursor-pointer flex flex-col items-center justify-center"
                  >
                    <div className="p-3 bg-blue-50 rounded-full mb-4">
                      <Upload className="h-8 w-8 text-blue-600" />
                    </div>
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      Click to upload video
                    </p>
                    <p className="text-gray-600 mb-4">
                      Upload an instructional video for platform users
                    </p>
                    <button
                      type="button"
                      className="px-6 py-2 bg-[#1F3A34] text-white rounded-lg hover:bg-[#2a4d45]"
                    >
                      Select Video File
                    </button>
                  </label>
                </div>
                
                {errors.video && (
                  <p className="mt-2 text-sm text-red-600">{errors.video}</p>
                )}
                
                <p className="mt-2 text-sm text-gray-500">
                  Maximum file size: 50MB. Supported formats: MP4, MOV, AVI, WMV
                </p>
              </div>

              {/* Video Preview */}
              {(videoPreview || instructionVideo) && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Video Preview
                  </label>
                  
                  <div className="relative rounded-lg overflow-hidden bg-gray-900">
                    <video
                      src={videoPreview || instructionVideo}
                      className="w-full h-48 object-contain"
                      controls
                    >
                      Your browser does not support the video tag.
                    </video>
                    
                    <div className="absolute top-3 right-3 flex space-x-2">
                      <button
                        onClick={() => window.open(videoPreview || instructionVideo, '_blank')}
                        className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                        title="Open in new tab"
                      >
                        <Eye className="h-4 w-4 text-gray-700" />
                      </button>
                      <button
                        onClick={removeVideo}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        title="Remove video"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <Play className="h-4 w-4 mr-1" />
                      <span>Click to play video</span>
                    </div>
                    {videoFile && (
                      <span>{videoFile.name}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Upload Button */}
              {(videoFile || videoPreview) && (
                <button
                  onClick={handleVideoSubmit}
                  disabled={uploading}
                  className="w-full flex items-center justify-center px-4 py-3 bg-[#1F3A34] text-white rounded-lg hover:bg-[#2a4d45] disabled:opacity-50 transition-colors"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading Video...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Instruction Video
                    </>
                  )}
                </button>
              )}

              {/* Current Video Info */}
              {instructionVideo && !videoFile && !videoPreview.startsWith('blob:') && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="font-medium text-blue-800">Current Instruction Video</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Video is live and available to users
                  </p>
                  <button
                    onClick={() => window.open(instructionVideo, '_blank')}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Current Video →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
       

        {/* Danger Zone */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-red-200">
          <div className="px-6 py-4 border-b border-red-200">
            <h3 className="font-semibold text-red-800">Danger Zone</h3>
            <p className="text-sm text-red-600 mt-1">
              These actions are irreversible
            </p>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="font-medium text-gray-900">Reset Platform Data</p>
                <p className="text-sm text-gray-600 mt-1">
                  Remove all user data and properties (except admin)
                </p>
              </div>
              <button
                onClick={() => console.log('Reset platform')}
                className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap"
              >
                Reset Platform
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}