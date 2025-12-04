"use client";

import { MapPin, DollarSign, Bed, Bath, Layers, Star, StarOff, Eye } from "lucide-react";
import { motion } from "framer-motion";

export default function PropertyCard({ property, onView, onFeature }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl shadow-xl bg-white overflow-hidden border hover:-translate-y-1 transition"
    >
      {/* IMAGE */}
      <div className="relative">
        <img src={property.image} className="h-52 w-full object-cover" />

        {/* Featured Badge */}
        {property.featured && (
          <div className="absolute top-3 right-3 bg-[#E7C464] text-[#05314A] px-3 py-1 rounded-xl font-semibold">
            Featured
          </div>
        )}
      </div>

      {/* DETAILS */}
      <div className="p-6">
        <h2 className="text-xl font-bold text-[#05314A]">{property.title}</h2>
        <p className="flex items-center gap-1 text-gray-600 text-sm mt-1">
          <MapPin size={16} /> {property.address}
        </p>

        {/* METRICS */}
        <div className="grid grid-cols-4 gap-2 text-xs mt-4">
          <div className="p-3 bg-gray-100 rounded-xl text-center">
            <Bed size={16} className="mx-auto mb-1" />
            {property.bedrooms} Beds
          </div>

          <div className="p-3 bg-gray-100 rounded-xl text-center">
            <Bath size={16} className="mx-auto mb-1" />
            {property.baths} Bath
          </div>

          <div className="p-3 bg-gray-100 rounded-xl text-center">
            <Layers size={16} className="mx-auto mb-1" />
            {property.sqft} sqft
          </div>

          <div className="p-3 bg-gray-100 rounded-xl text-center">
            <DollarSign size={16} className="mx-auto mb-1" />
            {property.price.toLocaleString()}
          </div>
        </div>

        {/* STATUS */}
        <div className="mt-4">
          <span
            className={`px-3 py-1 text-xs rounded-full font-semibold ${
              property.status === "approved"
                ? "bg-emerald-100 text-emerald-700"
                : property.status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {property.status}
          </span>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => onView(property)}
            className="px-4 py-2 rounded-xl bg-[#05314A] text-white flex items-center gap-1 text-sm"
          >
            <Eye size={16} /> View
          </button>

          <button
            onClick={() => onFeature(property.id)}
            className="px-4 py-2 rounded-xl bg-[#E7C464] text-[#05314A] flex items-center gap-1 text-sm"
          >
            {property.featured ? <StarOff size={16} /> : <Star size={16} />}
            {property.featured ? "Unfeature" : "Feature"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
