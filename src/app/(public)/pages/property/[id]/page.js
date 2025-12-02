"use client";

import { useEffect, useState } from "react";
import { usePropertyStore } from "@/store/propertyStore";
import PropertyDetails from "@/components/properties/PropertyDetails";
import { use } from "react";

export default function PropertyDetailsPage({ params }) {
    const { id } = use(params);
    const getPropertyById = usePropertyStore((s) => s.getPropertyById);
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const found = getPropertyById(id);
        if (found) {
            setProperty(found);
        }
        setLoading(false);
    }, [id, getPropertyById]);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-5 py-20 text-center text-gray-600">
                Loading property details...
            </div>
        );
    }

    if (!property) {
        return (
            <div className="max-w-7xl mx-auto px-5 py-20 text-center text-gray-600">
                Property not found.
            </div>
        );
    }

    return <PropertyDetails property={property} />;
}
