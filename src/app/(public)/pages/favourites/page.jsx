"use client";

import { useState, useEffect } from "react";
import PropertyCard from "@/components/cards/Property";
import { usePropertyStore } from "@/store/propertyStore";
import Link from "next/link";
import { Heart, Trash2, ChevronLeft } from "lucide-react";
import TenantFavouritesPage from "@/app/dashboard/tenant/favourites/page";

// export default function FavouritesPage() {
//     const properties = usePropertyStore((s) => s.properties);
//     const [favouriteIds, setFavouriteIds] = useState([]);
//     const [favouriteProperties, setFavouriteProperties] = useState([]);
//     const [showConfirmModal, setShowConfirmModal] = useState(false);

//     useEffect(() => {
//         loadFavourites();
//     }, [properties]);

//     const loadFavourites = () => {
//         // Load favourites from localStorage
//         const ids = JSON.parse(localStorage.getItem("favouriteProperties") || "[]");
//         setFavouriteIds(ids);
        
//         // Filter properties based on favourite IDs
//         const favProps = properties.filter(prop => ids.includes(prop.id));
//         setFavouriteProperties(favProps);
//     };

//     const clearAllFavourites = () => {
//         localStorage.removeItem("favouriteProperties");
//         setFavouriteIds([]);
//         setFavouriteProperties([]);
//         setShowConfirmModal(false);
//         window.dispatchEvent(new Event("favourites-updated"));
//     };

//     if (favouriteProperties.length === 0) {
//         return (
//             <div className="max-w-7xl mx-auto px-5 py-16 text-center">
//                 <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
//                     <Heart size={40} className="text-gray-400" />
//                 </div>
//                 <h2 className="text-2xl font-semibold text-gray-800 mb-3">
//                     No Favourites Yet
//                 </h2>
//                 <p className="text-gray-600 mb-8">
//                     Start adding properties to your favourites by clicking the heart icon
//                 </p>
//                 <Link
//                     href="/pages/properties"
//                     className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition inline-flex items-center"
//                 >
//                     <ChevronLeft size={20} className="mr-2" />
//                     Browse Properties
//                 </Link>
//             </div>
//         );
//     }

//     return (
//         <>
//             <div className="max-w-7xl mx-auto px-5 py-16">
//                 {/* Header with Actions */}
//                 <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
//                     <div>
//                         <div className="flex items-center gap-3 mb-2">
//                             <h1 className="text-3xl font-bold text-gray-900">
//                                 Your Favourites
//                             </h1>
//                             <span className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
//                                 {favouriteProperties.length}
//                             </span>
//                         </div>
//                         <p className="text-gray-600">
//                             {favouriteProperties.length} propert{favouriteProperties.length === 1 ? 'y' : 'ies'} saved
//                         </p>
//                     </div>

//                     <div className="flex items-center gap-3">
//                         <Link
//                             href="/pages/properties"
//                             className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center"
//                         >
//                             <ChevronLeft size={18} className="mr-2" />
//                             Back to Properties
//                         </Link>
//                         <button
//                             onClick={() => setShowConfirmModal(true)}
//                             className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center"
//                         >
//                             <Trash2 size={18} className="mr-2" />
//                             Clear All
//                         </button>
//                     </div>
//                 </div>

//                 {/* Favourites Grid */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//                     {favouriteProperties.map((item) => (
//                         <div key={item.id} className="relative group">
//                             <Link
//                                 href={`/pages/properties/${item.id}`}
//                                 className="block"
//                             >
//                                 <PropertyCard
//                                     id={item.id}
//                                     image={item.image}
//                                     title={item.title}
//                                     price={item.price}
//                                     address={item.address}
//                                     beds={item.beds}
//                                     baths={item.baths}
//                                     sqft={item.sqft}
//                                     isFeatured={item.isFeatured}
//                                     isForSale={item.type === "sale"}
//                                 />
//                             </Link>
//                         </div>
//                     ))}
//                 </div>

//                 {/* Quick Actions Bar (Sticky on mobile) */}
//                 <div className="mt-12 md:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30">
//                     <div className="flex items-center gap-3 bg-white rounded-full shadow-lg px-6 py-3 border">
//                         <span className="text-sm font-medium text-gray-700">
//                             {favouriteProperties.length} items
//                         </span>
//                         <button
//                             onClick={() => setShowConfirmModal(true)}
//                             className="px-4 py-2 bg-red-600 text-white text-sm rounded-full hover:bg-red-700 transition"
//                         >
//                             Clear All
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Confirmation Modal */}
//             {showConfirmModal && (
//                 <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
//                     <div className="bg-white rounded-2xl max-w-md w-full p-6">
//                         <div className="flex items-center gap-3 mb-4">
//                             <div className="p-2 bg-red-100 rounded-full">
//                                 <Trash2 size={24} className="text-red-600" />
//                             </div>
//                             <h3 className="text-xl font-semibold text-gray-900">
//                                 Clear All Favourites?
//                             </h3>
//                         </div>
                        
//                         <p className="text-gray-600 mb-6">
//                             This will remove all {favouriteProperties.length} properties from your favourites. This action cannot be undone.
//                         </p>
                        
//                         <div className="flex gap-3">
//                             <button
//                                 onClick={() => setShowConfirmModal(false)}
//                                 className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={clearAllFavourites}
//                                 className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
//                             >
//                                 Clear All
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// }

export default function page(){
    return <div className="container max-w-7xl py-10 mx-auto">
        <TenantFavouritesPage />
    </div>
}