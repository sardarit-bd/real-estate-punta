'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Home,
  Edit,
  Camera,
  CheckCircle,
  AlertCircle,
  FileText,
  ChevronRight,
  Download,
  Upload,
  Key,
  Star,
  LogOut
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function TenantProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [editMode, setEditMode] = useState(false);

  // Sample user data
  useEffect(() => {
    const userData = {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      joinDate: '2023-06-15',
      status: 'active',
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
        { id: 3, name: 'Payment Receipt March', type: 'pdf', date: '2024-03-15' }
      ],
      properties: [
        {
          id: 1,
          address: '123 Main St, Apt 4B',
          city: 'New York',
          state: 'NY',
          zip: '10001',
          type: 'Apartment',
          rent: 1500,
          leaseStart: '2024-01-01',
          leaseEnd: '2024-12-31',
          landlord: 'Jane Smith'
        }
      ],
      paymentMethods: [
        { id: 1, type: 'bank', last4: '4321', isDefault: true },
        { id: 2, type: 'card', last4: '8765', isDefault: false }
      ]
    };
    
    setUser(userData);
  }, []);

  const handleSaveProfile = async (updatedData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setUser(prev => ({ ...prev, ...updatedData }));
      setEditMode(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadDocument = async (file) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Document uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload document');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (oldPass, newPass) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Password changed successfully!');
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
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
                  <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
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
                  <span className="font-medium">{user.properties.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Documents</span>
                  <span className="font-medium">{user.documents.length}</span>
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
                      {activeTab === 'security' && 'Security'}
                      {activeTab === 'preferences' && 'Preferences'}
                      {activeTab === 'emergency' && 'Emergency Contact'}
                    </h2>
                    <p className="text-gray-600">
                      {activeTab === 'personal' && 'Update your personal details'}
                      {activeTab === 'properties' && 'View and manage your rented properties'}
                      {activeTab === 'documents' && 'Manage your documents and files'}
                      {activeTab === 'security' && 'Security and password settings'}
                      {activeTab === 'preferences' && 'Account preferences and notifications'}
                      {activeTab === 'emergency' && 'Emergency contact information'}
                    </p>
                  </div>
                  {activeTab === 'personal' && (
                    <button
                      onClick={() => setEditMode(!editMode)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
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
                  <PropertiesInfo properties={user.properties} />
                )}
                
                {activeTab === 'documents' && (
                  <DocumentsInfo 
                    documents={user.documents}
                    onUpload={handleUploadDocument}
                  />
                )}
                
                {activeTab === 'security' && (
                  <SecurityInfo onChangePassword={handleChangePassword} />
                )}
                
                {activeTab === 'preferences' && (
                  <PreferencesInfo 
                    preferences={user.preferences}
                    onUpdate={handleSaveProfile}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Personal Information Component
function PersonalInfo({ user, editMode, onSave, loading }) {
  const [formData, setFormData] = useState({ ...user });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const fields = [
    { name: 'name', label: 'Full Name', icon: User, type: 'text' },
    { name: 'email', label: 'Email Address', icon: Mail, type: 'email' },
    { name: 'phone', label: 'Phone Number', icon: Phone, type: 'tel' },
    { name: 'address', label: 'Current Address', icon: MapPin, type: 'text' },
    { name: 'dateOfBirth', label: 'Date of Birth', icon: Calendar, type: 'date' }
  ];

  return (
    <div>
      {editMode ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                </label>
                <div className="relative">
                  <field.icon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Additional Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              About Me
            </label>
            <textarea
              name="bio"
              value={formData.bio || ''}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tell us a little about yourself..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.map((field) => (
              <div key={field.name} className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="p-2 bg-white rounded-lg mr-4">
                  <field.icon className="h-5 w-5 text-gray-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{field.label}</p>
                  <p className="font-medium text-gray-900">
                    {user[field.name] || 'Not provided'}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Info Display */}
          {user.bio && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">About Me</h3>
              <p className="text-gray-700">{user.bio}</p>
            </div>
          )}

          {/* Verification Status */}
          {/* <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-3">Verification Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-green-600 mr-2" />
                  <span>Email Verified</span>
                </div>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-green-600 mr-2" />
                  <span>Phone Verified</span>
                </div>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 text-yellow-600 mr-2" />
                  <span>ID Verification</span>
                </div>
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </div> */}
        </div>
      )}
    </div>
  );
}

// Properties Information Component
function PropertiesInfo({ properties }) {
  return (
    <div className="space-y-6">
      {properties.map((property) => (
        <div key={property.id} className="border rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Home className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">{property.address}</h3>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {property.type}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Monthly Rent</p>
                    <p className="font-bold text-gray-900">${property.rent}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Lease Start</p>
                    <p className="font-medium text-gray-900">
                      {new Date(property.leaseStart).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Lease End</p>
                    <p className="font-medium text-gray-900">
                      {new Date(property.leaseEnd).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Landlord</p>
                    <p className="font-medium text-gray-900">{property.landlord}</p>
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  {property.city}, {property.state} {property.zip}
                </div>
              </div>

              <div className="flex gap-2">
                <button className="px-4 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50">
                  View Details
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Contact Landlord
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 border-t">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Lease Progress</span>
              <span className="font-medium text-gray-900">6 months completed</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-green-500 rounded-full h-2"
                style={{ width: '50%' }}
              ></div>
            </div>
          </div>
        </div>
      ))}

      {/* Add Property Button */}
      <button className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700">
        + Add Another Property
      </button>
    </div>
  );
}

// Documents Information Component
function DocumentsInfo({ documents, onUpload }) {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    await onUpload(file);
    setUploading(false);
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'jpg': return '🖼️';
      case 'png': return '🖼️';
      case 'doc': return '📝';
      default: return '📁';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <input
          type="file"
          id="document-upload"
          className="hidden"
          onChange={handleFileUpload}
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        />
        <label htmlFor="document-upload" className="cursor-pointer">
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">
            {uploading ? 'Uploading...' : 'Click to upload documents'}
          </p>
          <p className="text-sm text-gray-500">
            PDF, JPG, PNG, DOC up to 10MB
          </p>
        </label>
      </div>

      {/* Documents List */}
      <div>
        <h3 className="font-medium text-gray-900 mb-4">Your Documents</h3>
        <div className="space-y-3">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center">
                <span className="text-2xl mr-4">{getFileIcon(doc.type)}</span>
                <div>
                  <p className="font-medium text-gray-900">{doc.name}</p>
                  <p className="text-sm text-gray-500">
                    Uploaded {new Date(doc.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-500 hover:text-gray-700">
                  <Download className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-500 hover:text-red-600">
                  <AlertCircle className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Document Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Lease Agreement', count: 1, color: 'bg-blue-100' },
          { label: 'ID Proof', count: 1, color: 'bg-green-100' },
          { label: 'Payment Receipts', count: 3, color: 'bg-purple-100' },
          { label: 'Other Documents', count: 0, color: 'bg-gray-100' }
        ].map((category) => (
          <div key={category.label} className={`p-4 ${category.color} rounded-lg`}>
            <p className="font-medium text-gray-900">{category.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{category.count}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Security Information Component
function SecurityInfo({ onChangePassword }) {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    await onChangePassword(passwords.current, passwords.new);
    setShowChangePassword(false);
    setPasswords({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="space-y-6">
      {/* Password */}
      <div className="border rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-medium text-gray-900">Password</h3>
            <p className="text-sm text-gray-600">Last changed 30 days ago</p>
          </div>
          <button
            onClick={() => setShowChangePassword(!showChangePassword)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Change Password
          </button>
        </div>

        {showChangePassword && (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4 pt-4 border-t">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={passwords.current}
                onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={passwords.new}
                onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwords.confirm}
                onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowChangePassword(false)}
                className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Update Password
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Two-Factor Authentication */}
      <div className="border rounded-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
            <p className="text-sm text-gray-600">Add an extra layer of security</p>
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Enable 2FA
          </button>
        </div>
      </div>

      {/* Login Activity */}
      <div className="border rounded-lg p-6">
        <h3 className="font-medium text-gray-900 mb-4">Recent Login Activity</h3>
        <div className="space-y-3">
          {[
            { device: 'Chrome on Windows', location: 'New York, US', time: '2 hours ago' },
            { device: 'Safari on iPhone', location: 'New York, US', time: '1 day ago' },
            { device: 'Firefox on Mac', location: 'New York, US', time: '3 days ago' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{activity.device}</p>
                <p className="text-sm text-gray-600">{activity.location}</p>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          View All Activity
        </button>
      </div>

      {/* Account Deletion */}
      <div className="border border-red-200 bg-red-50 rounded-lg p-6">
        <h3 className="font-medium text-red-900 mb-2">Delete Account</h3>
        <p className="text-red-700 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          Delete Account
        </button>
      </div>
    </div>
  );
}

// Preferences Information Component
function PreferencesInfo({ preferences, onUpdate }) {
  const [localPrefs, setLocalPrefs] = useState(preferences);

  const handleToggle = (key) => {
    const updated = { ...localPrefs, [key]: !localPrefs[key] };
    setLocalPrefs(updated);
    onUpdate({ preferences: updated });
  };

  const notificationOptions = [
    { key: 'notifications', label: 'Push Notifications', description: 'Receive app notifications' },
    { key: 'emailUpdates', label: 'Email Updates', description: 'Receive email newsletters' },
    { key: 'smsAlerts', label: 'SMS Alerts', description: 'Important alerts via SMS' },
    { key: 'autoPay', label: 'Auto Pay', description: 'Automatically pay rent each month' }
  ];

  return (
    <div className="space-y-6">
      {/* Notification Preferences */}
      <div>
        <h3 className="font-medium text-gray-900 mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          {notificationOptions.map((option) => (
            <div key={option.key} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{option.label}</p>
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>
              <button
                onClick={() => handleToggle(option.key)}
                className={`w-12 h-6 rounded-full transition-colors ${localPrefs[option.key] ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${localPrefs[option.key] ? 'translate-x-7' : 'translate-x-1'}`}></div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Communication Preferences */}
      <div className="border rounded-lg p-6">
        <h3 className="font-medium text-gray-900 mb-4">Communication Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input type="radio" id="email" name="communication" defaultChecked className="mr-3" />
            <label htmlFor="email" className="flex-1">
              <p className="font-medium text-gray-900">Email Communication</p>
              <p className="text-sm text-gray-600">Receive all updates via email</p>
            </label>
          </div>
          <div className="flex items-center">
            <input type="radio" id="mixed" name="communication" className="mr-3" />
            <label htmlFor="mixed" className="flex-1">
              <p className="font-medium text-gray-900">Mixed Communication</p>
              <p className="text-sm text-gray-600">Email for updates, SMS for urgent alerts</p>
            </label>
          </div>
          <div className="flex items-center">
            <input type="radio" id="minimal" name="communication" className="mr-3" />
            <label htmlFor="minimal" className="flex-1">
              <p className="font-medium text-gray-900">Minimal Communication</p>
              <p className="text-sm text-gray-600">Only essential notifications</p>
            </label>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="border rounded-lg p-6">
        <h3 className="font-medium text-gray-900 mb-4">Privacy Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Profile Visibility</p>
              <p className="text-sm text-gray-600">Who can see your profile</p>
            </div>
            <select className="px-4 py-2 border rounded-lg">
              <option>Only Landlords</option>
              <option>All Users</option>
              <option>Private</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Data Sharing</p>
              <p className="text-sm text-gray-600">Share data for analytics</p>
            </div>
            <button className="w-12 h-6 bg-gray-300 rounded-full">
              <div className="w-5 h-5 bg-white rounded-full transform translate-x-1"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


