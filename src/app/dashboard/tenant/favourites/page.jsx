"use client";

import { useState, useEffect } from "react";
import { Heart, Trash2, ChevronLeft } from "lucide-react";
import Link from "next/link";
import PropertyCard from "@/components/cards/Property";
import { usePropertyStore } from "@/store/propertyStore";
import { useAuth } from "@/hooks/userAuth";

export default function TenantFavouritesPage() {
  const { user, loading } = useAuth();
  const properties = usePropertyStore((s) => s.properties);

  const [favouriteProperties, setFavouriteProperties] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // 🔐 Tenant-only guard
  // if (!loading && (!user || user.role !== "tenant")) {
  //   return (
  //     <div className="py-20 text-center text-gray-600">
  //       This page is available for tenants only.
  //     </div>
  //   );
  // }

  useEffect(() => {
    loadFavourites();

    const handleUpdate = () => loadFavourites();
    window.addEventListener("favourites-updated", handleUpdate);

    return () =>
      window.removeEventListener("favourites-updated", handleUpdate);
  }, [properties]);

  const loadFavourites = () => {
    const ids = JSON.parse(
      localStorage.getItem("favouriteProperties") || "[]"
    );
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/properties/fetchByIds`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids: ids }),
    })
      .then(res => res.json())
      .then(data => {
        console.log("Fetched blogs:", data);
         setFavouriteProperties(data);
      })
      .catch(err => console.error(err));
  };

  const clearAllFavourites = () => {
    localStorage.removeItem("favouriteProperties");
    setFavouriteProperties([]);
    setShowConfirmModal(false);
    window.dispatchEvent(new Event("favourites-updated"));
  };

  if (favouriteProperties.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-5 py-16 text-center">
        <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Heart size={40} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-semibold text-[#004087] mb-3">
          No Favourites Yet
        </h2>
        <p className="text-gray-600 mb-8">
          Start adding properties to your favourites
        </p>
        <Link
          href="/pages/properties"
          className="px-6 py-3 bg-[#004087] text-white rounded-full font-medium inline-flex items-center"
        >
          <ChevronLeft size={18} className="mr-2" />
          Browse Properties
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Favourites
            </h1>
            <p className="text-gray-600 mt-1">
              {favouriteProperties.length} properties saved
            </p>
          </div>

          <button
            onClick={() => setShowConfirmModal(true)}
            className="flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700"
          >
            <Trash2 size={18} />
            Clear All
          </button>
        </div>

        {/* Grid */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
                {favouriteProperties.map((item) => {
                    const coverImage =
                        item.images?.find(img => img.isCover)?.url ||
                        item.images?.[0]?.url ||
                        "/placeholder.jpg";

                    return (
                        <Link
                            key={item._id}
                            href={`/pages/properties/${item._id}`}
                        >
                            <PropertyCard
                                id={item._id}
                                image={coverImage}
                                title={item.title}
                                price={item.price}
                                address={item.address}
                                beds={item.bedrooms}
                                baths={item.bathrooms}
                                sqft={item.area}
                                isFeatured={item.featured}
                                isForSale={item.listingType === "sale"}
                            />
                        </Link>
                    );
                })}

            </div>
      </div>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">
              Clear all favourites?
            </h3>
            <p className="text-gray-600 mb-6">
              This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 border rounded-lg py-2"
              >
                Cancel
              </button>
              <button
                onClick={clearAllFavourites}
                className="flex-1 bg-red-600 text-white rounded-lg py-2"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
