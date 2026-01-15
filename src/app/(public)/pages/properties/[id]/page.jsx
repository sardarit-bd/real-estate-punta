"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import PropertyDetails from "@/components/properties/PropertyDetails";

export default function PropertyDetailsPage({ params }) {
    const { id } = use(params);

    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/properties/${id}`
                );
                const data = await res.json();

                if (data.success) {
                    setProperty(data.data);
                }
            } catch (err) {
                console.error("Failed to fetch property", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [id]);

    if (loading) {
        return <div className="text-center py-20">Loading property...</div>;
    }

    if (!property) {
        return <div className="text-center py-20">Property not found.</div>;
    }

    return <PropertyDetails property={property} />;
}
