"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import toast, { Toaster } from "react-hot-toast";
import { Bath, Bed, CheckCircle, DollarSign, Home, MapPin, Square, Star, StarOff, Trash2, Users, X, XCircle } from "lucide-react";

export default function PropertyModal({
  property,
  onClose,
  onApprove,
  onReject,
  onDelete,
  onFeature,
}) {
  const [status, setStatus] = useState(property.status);
  const [featured, setFeatured] = useState(property.featured);

  const handleApprove = () => {
    setStatus("approved");
    onApprove(property.id);
    toast.success("Property approved!");
  };

  const handleReject = () => {
    setStatus("rejected");
    onReject(property.id);
    toast.error("Property rejected!");
  };

  const handleFeature = () => {
    setFeatured(!featured);
    onFeature(property.id);
    toast.success(featured ? "Property unfeatured!" : "Property featured!");
  };

  const handleDelete = () => {
    onDelete(property.id);
    toast.error("Property deleted!");
  };

  const detailList = [
    { icon: <MapPin size={18} />, label: "City", value: property.city },
    { icon: <Users size={18} />, label: "Owner", value: property.owner },
    { icon: <Home size={18} />, label: "Type", value: property.type },
    { icon: <DollarSign size={18} />, label: "Price", value: `$${property.price.toLocaleString()}` },
    { icon: <Bed size={18} />, label: "Bedrooms", value: property.bedrooms },
    { icon: <Bath size={18} />, label: "Baths", value: property.baths },
    { icon: <Square size={18} />, label: "Sqft", value: property.sqft },
    { icon: <Star size={18} />, label: "Featured", value: featured ? "Yes" : "No" },
    { icon: <CheckCircle size={18} />, label: "Status", value: status },
  ];

  return (
    <>
      <Toaster position="top-right" />
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl relative"
        >
          {/* CLOSE BUTTON */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-700 hover:text-black z-20"
          >
            <X size={30} />
          </button>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* LEFT: IMAGE */}
            <div className="relative">
              <img
                src={property.image}
                className="w-full h-full object-cover md:rounded-l-3xl rounded-t-3xl"
              />
              <div className="absolute bottom-4 left-4 bg-black/50 text-white px-4 py-1 rounded-full text-sm">
                ${property.price.toLocaleString()}
              </div>
            </div>

            {/* RIGHT: DETAILS */}
            <div className="p-8 overflow-y-auto max-h-[80vh]">
              <h2 className="text-2xl font-bold text-[#05314A]">
                {property.title}
              </h2>
              <p className="text-gray-600 mt-1">{property.address}</p>

              {/* DETAILS GRID */}
              <div className="grid grid-cols-2 gap-4 mt-6 text-sm text-gray-700">
                {detailList.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-gray-500">{item.icon}</span>
                    <strong>{item.label}:</strong> {item.value}
                  </div>
                ))}
              </div>

              {/* APPROVE + REJECT BUTTONS */}
              <div className="grid grid-cols-2 gap-3 mt-8">
                <button
                  onClick={handleApprove}
                  className={`py-3 rounded-xl flex items-center justify-center gap-2 font-semibold transition ${
                    status !== "approved"
                      ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <CheckCircle size={18} />
                  Approve
                </button>

                <button
                  onClick={handleReject}
                  className={`py-3 rounded-xl flex items-center justify-center gap-2 font-semibold transition ${
                    status !== "rejected"
                      ? "bg-red-100 text-red-700 hover:bg-red-200"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <XCircle size={18} />
                  Reject
                </button>
              </div>

              {/* FEATURE + DELETE */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button
                  onClick={handleFeature}
                  className="py-3 rounded-xl bg-[#E7C464] text-[#05314A] font-semibold flex items-center justify-center gap-2"
                >
                  {featured ? <StarOff size={18} /> : <Star size={18} />}
                  {featured ? "Unfeature" : "Feature"}
                </button>

                <button
                  onClick={handleDelete}
                  className="py-3 rounded-xl bg-red-100 text-red-700 font-semibold hover:bg-red-200 flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              </div>

              {/* CLOSE BUTTON */}
              <button
                onClick={onClose}
                className="w-full mt-8 bg-[#05314A] text-white py-3 rounded-xl font-semibold hover:bg-[#042836]"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
