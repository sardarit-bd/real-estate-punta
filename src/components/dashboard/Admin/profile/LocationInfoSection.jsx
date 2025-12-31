import { MapPin, Home } from 'lucide-react';
import CustomSelect from '@/components/dashboard/Admin/CustomSelect';

export default function LocationInfoSection({ formData, isEditing, setFormData }) {
  
  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 
    'France', 'Spain', 'Italy', 'Dominican Republic', 'Mexico', 'Brazil'
  ];

  const dominicanCities = [
    'Punta Cana', 'Santo Domingo', 'Puerto Plata', 'La Romana',
    'Santiago', 'Bavaro', 'Cap Cana', 'Juanillo', 'Macao',
    'Cabeza de Toro', 'Cortecito', 'Uvero Alto'
  ];

  const countryOptions = countries.map(country => ({
    value: country,
    label: country
  }));

  const cityOptions = dominicanCities.map(city => ({
    value: city,
    label: city
  }));

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <h3 className="font-medium text-gray-900 mb-4 flex items-center">
        <MapPin className="h-5 w-5 mr-2" />
        Location Information
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          {isEditing ? (
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F3A34] focus:border-transparent"
              placeholder="Street address"
            />
          ) : (
            <div className="px-4 py-3 bg-gray-50 rounded-lg flex items-center">
              <Home className="h-4 w-4 text-gray-400 mr-2" />
              {formData.address}
            </div>
          )}
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City
          </label>
          {isEditing ? (
            <CustomSelect
              value={formData.city || ''}
              options={[{ value: '', label: 'Select City' }, ...cityOptions]}
              onChange={(value) => handleSelectChange('city', value)}
              className="w-full"
              variant="admin"
            />
          ) : (
            <div className="px-4 py-3 bg-gray-50 rounded-lg">
              {formData.city}
            </div>
          )}
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country
          </label>
          {isEditing ? (
            <CustomSelect
              value={formData.country || ''}
              options={[{ value: '', label: 'Select Country' }, ...countryOptions]}
              onChange={(value) => handleSelectChange('country', value)}
              className="w-full"
              variant="admin"
            />
          ) : (
            <div className="px-4 py-3 bg-gray-50 rounded-lg">
              {formData.country}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}