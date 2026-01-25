"use client"

import Image from "next/image";
import { citiesData } from "@/data/cities";
import PropertyCard from "@/components/cards/PropertyCard";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import PropertyResults from "@/app/(public)/pages/properties/PropertyResults";

export default function CityPage({ params }) {
  const [slug, setSlug] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    params.then(p => setSlug(p.slug));
  }, [params]);

  useEffect(() => {
    if (!slug) return;

    const fetchFeaturedProperties = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/properties?limit=50`
        );

        const data = await res.json();

        if (data.success) {
          const filtered = data?.data?.filter(p => p.city.toLowerCase() === slug.replace("-", ' '))
          setProperties(filtered);
        }
      } catch (error) {
        console.error("Failed to load featured properties", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, [slug]);

  if (!slug) return null;

  const city = citiesData.find((c) => c.slug === slug);

  if (!city) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
        <div className="text-center max-w-md">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 mb-6">
              <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-3 tracking-tight">City Not Found</h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              We couldn't locate the city you're searching for. Please check the spelling or try another location.
            </p>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <p className="text-gray-500 text-sm">
              Try searching with a different name or nearby city
            </p>
          </div>
        </div>
      </div>
    );
  }

  const totalProperties = properties?.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[400px] overflow-hidden">
        <Image
          src={city.img}
          fill
          className="object-cover brightness-50"
          alt={city.name}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="relative z-10 h-full flex flex-col justify-end max-w-7xl mx-auto px-4 pb-10">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            {city.name}
          </h1>
          <p className="text-gray-200 text-lg max-w-2xl">
            {city.description}
          </p>
          <div className="flex items-center gap-6 mt-6">
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-white font-semibold">
                {totalProperties} Properties Available
              </span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span>United States</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Properties Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Available Properties
              </h2>
              <p className="text-gray-600 mt-2">
                Browse {totalProperties} properties in {city.name}
              </p>
            </div>

            {/* Sort Options */}
            {/* <div className="flex items-center gap-4">
              <Select>
                <SelectTrigger className="w-[220px] border-gray-300">
                  <SelectValue placeholder="Sort by: Price (Low to High)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="low-to-high">Price (Low to High)</SelectItem>
                    <SelectItem value="high-to-low">Price (High to Low)</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="size">Size (Largest First)</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <button className="px-4 py-2 border border-gray-300 text-black rounded-lg hover:shadow-md transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                Filter
              </button>
            </div> */}

          </div>

          {/* Properties Grid */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties?.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div> */}
          <PropertyResults filtered={properties} />
        </div>
      </div>
    </div>
  );
}