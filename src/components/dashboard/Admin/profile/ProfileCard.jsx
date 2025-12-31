import { Camera, X, Calendar, CheckCircle } from 'lucide-react';

export default function ProfileCard({ 
  userData, 
  formData, 
  isEditing, 
  imagePreview, 
  setImageFile, 
  setImagePreview,
  setFormData,
  errors 
}) {
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(userData.profileImage);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="text-center">
        {/* Profile Image */}
        <div className="relative inline-block mb-4">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <img
              src={imagePreview}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          
          {isEditing && (
            <>
              <label className="absolute bottom-2 right-2 p-2 bg-[#1F3A34] text-white rounded-full cursor-pointer hover:bg-[#2a4d45] transition-colors">
                <Camera className="h-4 w-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              
              {imagePreview !== userData.profileImage && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </>
          )}
        </div>

        {errors.image && (
          <p className="text-sm text-red-600 mt-2">{errors.image}</p>
        )}

        <h2 className="text-xl font-bold text-gray-900">
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className={`w-full text-center text-xl font-bold border-b pb-1 focus:outline-none focus:border-[#1F3A34] ${
                errors.name ? 'border-red-300' : 'border-transparent'
              }`}
            />
          ) : (
            userData.name
          )}
        </h2>
        
        {errors.name && (
          <p className="text-sm text-red-600 mt-1">{errors.name}</p>
        )}

        <p className="text-gray-600 mt-1">
          {isEditing ? (
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
              placeholder="Company name"
              className="w-full text-center text-gray-600 border-b pb-1 focus:outline-none focus:border-[#1F3A34] border-transparent"
            />
          ) : (
            userData.company || 'Property Owner'
          )}
        </p>

        <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-1" />
          Member since {formatDate(userData.joinDate)}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-6 border-t">
        <h3 className="font-medium text-gray-900 mb-3">Account Status</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Verified Email</span>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Account Type</span>
            <span className="font-medium text-[#1F3A34]">Property Owner</span>
          </div>
        </div>
      </div>
    </div>
  );
}