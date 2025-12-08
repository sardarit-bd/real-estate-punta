// app/pages/favourites/page.jsx
"use client";

import { useState, useEffect } from "react";
import PropertyCard from "@/components/cards/Property";
import { usePropertyStore } from "@/store/propertyStore";
import Link from "next/link";
import { Heart } from "lucide-react";

export default function FavouritesPage() {
    const properties = usePropertyStore((s) => s.properties);
    const [favouriteIds, setFavouriteIds] = useState([]);
    const [favouriteProperties, setFavouriteProperties] = useState([]);

    useEffect(() => {
        // Load favourites from localStorage
        const ids = JSON.parse(localStorage.getItem("favouriteProperties") || "[]");
        setFavouriteIds(ids);
        
        // Filter properties based on favourite IDs
        const favProps = properties.filter(prop => ids.includes(prop.id));
        setFavouriteProperties(favProps);
    }, [properties]);

    if (favouriteProperties.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-5 py-16 text-center">
                <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <Heart size={40} className="text-gray-400" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                    No Favourites Yet
                </h2>
                <p className="text-gray-600 mb-8">
                    Start adding properties to your favourites by clicking the heart icon
                </p>
                <Link
                    href="/pages/properties"
                    className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition"
                >
                    Browse Properties
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-5 py-16">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Your Favourites
                </h1>
                <p className="text-gray-600">
                    {favouriteProperties.length} propert{favouriteProperties.length === 1 ? 'y' : 'ies'} saved
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {favouriteProperties.map((item) => (
                    <Link
                        key={item.id}
                        href={`/pages/properties/${item.id}`}
                        className="block"
                    >
                        <PropertyCard
                            id={item.id}
                            image={item.image}
                            title={item.title}
                            price={item.price}
                            address={item.address}
                            beds={item.beds}
                            baths={item.baths}
                            sqft={item.sqft}
                            isFeatured={item.isFeatured}
                            isForSale={item.type === "sale"}
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
}