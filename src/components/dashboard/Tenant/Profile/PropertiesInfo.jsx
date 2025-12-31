import { Home, MapPin } from "lucide-react";

export function PropertiesInfo({ properties }) {
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