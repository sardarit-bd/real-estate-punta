"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function PropertyCard({ property }) {
  const router = useRouter();

  return (
    <div 
      onClick={() => router.push(`/properties/${property.id}`)}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl"
    >
      {/* Property Image */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={property.image}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          alt={property.title}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Price Tag */}
        <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full shadow-md">
          <span className="font-bold text-blue-600">
            ${property.price.toLocaleString()}
          </span>
        </div>
        
        {/* Bed/Bath Info */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" />
              <path fillRule="evenodd" d="M3 8a1 1 0 011-1h12a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 3a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">{property.beds} bed</span>
          </div>
          <div className="w-1 h-1 bg-gray-300 rounded-full" />
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 4a1 1 0 011-1h8a1 1 0 011 1v1a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2V4zm2 2a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 4a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">{property.baths} bath</span>
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
          {property.title}
        </h3>
        
        <p className="text-gray-600 mb-4">
          {property.size} • Prime Location
        </p>

        {/* Features */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-gray-700">Ready to Move</span>
            </div>
          </div>
          
          <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 group">
            View Details
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}