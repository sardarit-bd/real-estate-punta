"use client";

import Link from "next/link";
import { CheckCircle, CreditCard, CalendarDays, Package } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { Suspense, useEffect, useState } from "react";
import axios from "axios";


export function PaymentSuccessPage() {
    const searchParam = useSearchParams()
    const sessionId = searchParam.get("session_id")
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch session data when sessionId is available
    useEffect(() => {
        const fetchMyProperties = async () => {
            try {
                setLoading(true);
                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment/lease-verify`,
                    { sessionId },
                    {
                        withCredentials: true
                    }
                );
                console.log('Payment verification response:', res.data);
                setData(res.data);
            } catch (error) {
                console.error('Failed to fetch properties', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMyProperties();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center brandBg px-6 py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center brandBg px-6 py-16">
            {/* ✅ Card container */}
            <div className="bg-white text-gray-900 rounded-2xl shadow-2xl max-w-lg w-full p-8 text-center">
                {/* Success Icon */}
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />

                {/* Title */}
                <h1 className="text-3xl font-semibold mb-2 brandColor">
                    Payment Successful 🎉
                </h1>
                <p className="text-gray-600 mb-8">
                    Thank you for your purchase! Your order has been confirmed and payment
                    was successful.
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <Link
                        href="/dashboard/owner/properties"
                        className="flex-1 bg-[var(--color-primary)] text-white font-medium py-3 rounded-full hover:opacity-90 transition"
                    >
                        View Properties
                    </Link>
                   
                </div>

                {/* Footer */}
                <div className="mt-6 text-sm text-gray-500 flex items-center justify-center gap-1">
                    <Package className="w-4 h-4" />
                    Thank you for your purchase!
                </div>
            </div>
        </div>
    );
}

export default function Page(){
    return <Suspense fallback={<div>Loading...</div>}><PaymentSuccessPage /></Suspense>
};