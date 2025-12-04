"use client";

import CustomSelect from "@/components/dashboard/Admin/CustomSelect";
import PropertyCard from "@/components/dashboard/Admin/PropertyCard";
import PropertyModal from "@/components/dashboard/Admin/PropertyModal";
import { useState } from "react";


const initialProperties = [
  {
    id: 1,
    title: "Luxury Beachfront Villa",
    city: "punta cana",
    type: "sale",
    price: 450000,
    bedrooms: 4,
    baths: 3,
    sqft: 2800,
    featured: true,
    status: "approved",
    image: "/images/1.jpg",
    owner: "John Carter",
    address: "Cap Cana, Punta Cana",
  },
  {
    id: 2,
    title: "Ocean View Apartment",
    city: "bavaro",
    type: "rent",
    price: 2500,
    bedrooms: 2,
    baths: 2,
    sqft: 1300,
    featured: false,
    status: "pending",
    image: "/images/2.png",
    owner: "Sarah Wilson",
    address: "Bávaro Beach Side",
  },
];

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState(initialProperties);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

   const [openStatus, setOpenStatus]= useState(false);
   const [openType, setOpenStype] = useState(false)

  // ACTION HANDLERS
  const approve = (id) =>
    setProperties((p) => p.map((x) => (x.id === id ? { ...x, status: "approved" } : x)));

  const reject = (id) =>
    setProperties((p) => p.map((x) => (x.id === id ? { ...x, status: "rejected" } : x)));

  const deleteProperty = (id) =>
    setProperties((p) => p.filter((x) => x.id !== id));

  const toggleFeatured = (id) =>
    setProperties((p) => p.map((x) => (x.id === id ? { ...x, featured: !x.featured } : x)));

  // FILTERED
  const filtered = properties.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    const matchType = typeFilter === "all" || p.type === typeFilter;

    return matchSearch && matchStatus && matchType;
  });

  return (
    <section className="px-6 py-10">
      <h1 className="text-3xl font-bold text-[#05314A] mb-8">Manage Properties</h1>

      {/* FILTERS */}
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <input
          className="w-full px-4 py-2 border rounded-xl shadow-sm focus:ring-[#E7C464]/50"
          placeholder="Search properties..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <CustomSelect
          value={statusFilter}
          onChange={setStatusFilter}
          options={["all", "approved", "pending", "rejected"]}
        />

        <CustomSelect
          value={typeFilter}
          onChange={setTypeFilter}
          options={["all", "rent", "sale"]}
        />
      </div>

      {/* SHOWCASE LAYOUT */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onView={() => setSelectedProperty(property)}
            onFeature={toggleFeatured}
          />
        ))}
      </div>

      {/* MODAL */}
      {selectedProperty && (
        <PropertyModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onApprove={approve}
          onReject={reject}
          onDelete={deleteProperty}
          onFeature={toggleFeatured}
        />
      )}
    </section>
  );
}
