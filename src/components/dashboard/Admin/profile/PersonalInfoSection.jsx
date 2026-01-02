import { User, Mail, Phone, Building } from 'lucide-react';

export default function PersonalInfoSection({ 
  formData, 
  isEditing, 
  errors, 
  setFormData, 
  setErrors 
}) {
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div>
      <h3 className="font-medium text-gray-900 mb-4 flex items-center">
        <User className="h-5 w-5 mr-2" />
        Personal Information
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1F3A34] focus:border-transparent ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
            />
          ) : (
            <div className="px-4 py-3 bg-gray-50 rounded-lg">
              {formData.name}
            </div>
          )}
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1F3A34] focus:border-transparent ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
            />
          ) : (
            <div className="px-4 py-3 bg-gray-50 rounded-lg flex items-center">
              <Mail className="h-4 w-4 text-gray-400 mr-2" />
              {formData.email}
            </div>
          )}
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          {isEditing ? (
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1F3A34] focus:border-transparent ${
                errors.phone ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="+1 (809) 555-0123"
            />
          ) : (
            <div className="px-4 py-3 bg-gray-50 rounded-lg flex items-center">
              <Phone className="h-4 w-4 text-gray-400 mr-2" />
              {formData.phone}
            </div>
          )}
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>

        {/* Company */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company
          </label>
          {isEditing ? (
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F3A34] focus:border-transparent"
              placeholder="Your company name"
            />
          ) : (
            <div className="px-4 py-3 bg-gray-50 rounded-lg flex items-center">
              <Building className="h-4 w-4 text-gray-400 mr-2" />
              {formData.company || 'Not specified'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}