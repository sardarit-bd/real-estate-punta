"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MapPin, BedDouble, Bath, Square, Phone, Mail, StepBack, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { leaseService } from "@/services/lease.service";
import toast from "react-hot-toast";
import Loader from "../common/Loader";

export default function PropertyDetails({ property, user }) {
    const router = useRouter();
    const [myLease, setMyLease] = useState(false)
    if (!property) {
        return (
            <Loader />
        );
    }

    const {
        _id: id,
        title,
        price,
        pricePeriod,
        type,
        address,
        description,
        listingType,
        bedrooms,
        bathrooms,
        area,
        images = [],
        owner,
    } = property;

    useEffect(() => {
        if (!user) return;

        const fetchLease = async () => {
            const res = await leaseService.getMyLeases({ role: "tenant" });
            const lease = res.data?.data?.find(
                (l) => l.property?._id === id && l.status !== "cancelled"
            );
            setMyLease(!!lease);
        };

        fetchLease();
    }, [id, user]);


    const requestHandler = async () => {
        if (!user) {
            router.push("/pages/login");
            return;
        }

        try {
            const payload = { property: property._id, tenant: user._id, landlord: owner._id };
            const res = await leaseService.createLease(payload)

            if (res.data?.success) {
                toast.success("Request is sent to Landlord.")
            } else {
                toast.error(res?.data?.message || "Failed to send.")
            }
            console.log(res)

        } catch (err) {
            toast.error(err?.response?.data?.message || "Request failed");
        }
    };


    const agent = {
        name: owner?.name || "Not Assigned",
        phone: owner?.phone || "N/A",
        email: owner?.email || "N/A",
        image: owner?.avatar || "/agent-placeholder.png",
    };

    const gallery =
        images.length > 0
            ? images.map((img) => img.url).filter(Boolean)
            : ["/placeholder.jpg"];

    // Slider settings for bottom section
    const [thumbIndex, setThumbIndex] = useState(0);
    const thumbNext = () => setThumbIndex((prev) => Math.min(prev + 1, gallery.length - 4));
    const thumbPrev = () => setThumbIndex((prev) => Math.max(prev - 1, 0));
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % gallery.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
    };

    // Button logic
    const isLoggedIn = !!user;
    const isTenant = user?.role === "tenant";
    const hasLease = myLease;

    // Determine button text based on conditions
    let buttonText = "";
    if (!isLoggedIn) {
        buttonText = "Login to Request";
    } else if (!user?.verified) {
        buttonText = "Verify your Account";
    } else if (hasLease) {
        buttonText = "Requested";
    } else if (listingType === "rent") {
        buttonText = "Request to Rent";
    } else {
        buttonText = "Request to Buy";
    }

    const isButtonDisabled = !isLoggedIn || !user?.verified || !isTenant || hasLease;

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

            <div className="grid md:grid-cols-2 gap-10 lg:gap-14 items-start">

                <div className="relative w-full h-[300px] sm:h-[400px] md:h-[480px] lg:h-[520px] rounded-2xl overflow-hidden shadow-md bg-gray-100">
                    <Image
                        src={gallery[currentIndex]}
                        alt={title}
                        fill
                        className="object-cover transition-all duration-300"
                    />
                </div>

                <div className="flex flex-col space-y-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-[#1F2328] leading-tight">
                            {title}
                        </h1>
                        <p className="mt-3 text-[#004087] text-2xl md:text-3xl font-semibold">
                            ${price} {listingType === "rent" && pricePeriod ? `/${pricePeriod}` : "One-time"}
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600 text-base">
                        <MapPin size={20} />
                        <span>{address}</span>
                    </div>

                    {/* Action Button - Placed after price and address for good visibility */}
                    <button
                        disabled={isButtonDisabled}
                        className={`w-full py-3.5 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${hasLease || !user?.verified
                            ? "bg-gray-400 text-white cursor-not-allowed"
                            : !isLoggedIn
                                ? "bg-[#014087] hover:bg-[#014087]/90 text-white"
                                : isTenant
                                    ? "bg-[#004087] hover:bg-[#003366] text-white"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                        onClick={() => {
                            if (!isLoggedIn) {
                                // Redirect to login
                                router.push("/pages/login");
                            } else if (isTenant && !hasLease) {
                                // Handle request action
                                requestHandler()
                            }
                        }}
                    >
                        {buttonText}
                        {!isLoggedIn && !hasLease && " (Login Required)"}
                        {isLoggedIn && !isTenant && !hasLease && " (Tenants Only)"}
                        {hasLease && " (Already Requested)"}
                    </button>

                    <div className="bg-white border rounded-xl p-5 md:p-6 shadow-sm">
                        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900">
                            Key Details
                        </h2>

                        <div className="grid grid-cols-2 gap-5 text-gray-700">
                            <div className="flex items-center gap-3">
                                <BedDouble size={24} className="text-gray-500" />
                                <div>
                                    <p className="font-semibold">{bedrooms}</p>
                                    <p className="text-sm text-gray-500">Bedrooms</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Bath size={24} className="text-gray-500" />
                                <div>
                                    <p className="font-semibold">{bathrooms}</p>
                                    <p className="text-sm text-gray-500">Bathrooms</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Square size={24} className="text-gray-500" />
                                <div>
                                    <p className="font-semibold">{area} sqft</p>
                                    <p className="text-sm text-gray-500">Area</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Home size={24} className="text-gray-500" />
                                <span className="text-lg font-semibold capitalize text-gray-800">
                                    <p className="font-semibold">{type}</p>
                                    <p className="text-sm text-gray-500">Type</p>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="relative mt-4 py-2 px-2 bg-white/40 backdrop-blur-sm rounded-xl border shadow-sm select-none">

                        {/* Prev Button */}
                        <button
                            onClick={thumbPrev}
                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md border hover:bg-gray-100 transition hover:scale-110 z-20"
                        >
                            <StepBack className="w-4 h-4 text-gray-700" />
                        </button>

                        {/* Thumbnails Slider */}
                        <div className="overflow-hidden">
                            <div
                                className="flex gap-4 p-3 transition-transform duration-300 ease-out"
                                style={{ transform: `translateX(-${thumbIndex * 100}px)` }}
                            >
                                {gallery.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentIndex(i)}
                                        className={`min-w-[95px] h-24 rounded-xl overflow-hidden border shadow-sm transition-all duration-200 
                        ${currentIndex === i
                                                ? "ring-2 ring-[#004087] scale-105"
                                                : "hover:scale-105 hover:shadow-md"
                                            }`}
                                    >
                                        <Image
                                            src={img || "/placeholder.jpg"}
                                            alt={`Thumb ${i}`}
                                            width={100}
                                            height={100}
                                            className="object-cover"
                                        />

                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Next Button */}
                        <button
                            onClick={thumbNext}
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md border hover:bg-gray-100 transition hover:scale-110 z-20"
                        >
                            <StepBack className="w-4 h-4 text-gray-700 rotate-180" />
                        </button>
                    </div>

                </div>
            </div>

            <div className="bg-white border rounded-xl p-5 md:p-7 shadow-sm">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed">{description}</p>
            </div>

            <div className="map">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d8976.524870225803!2d-68.41150214321561!3d18.495511638412378!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8ea890ba67c733c1%3A0x7a0111a8ec90305b!2sCap%20Cana%2C%2023000%20Punta%20Cana%2C%20Dominican%20Republic!5e1!3m2!1sen!2sbd!4v1764738996752!5m2!1sen!2sbd"
                    height="450"
                    className="w-full rounded-xl"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>

            <div className="bg-white border rounded-xl p-5 md:p-7 shadow-sm">
                <h2 className="text-2xl font-semibold text-gray-900 mb-5">Contact Agent</h2>

                <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                    <Image
                        src={agent.image}
                        alt="Agent"
                        width={90}
                        height={90}
                        className="rounded-full object-cover shadow"
                    />

                    <div>
                        <h3 className="text-lg md:text-xl font-semibold">{agent.name}</h3>

                        <div className="flex items-center gap-3 mt-2 text-gray-600">
                            <Phone size={18} />
                            <span>{agent.phone}</span>
                        </div>

                        <div className="flex items-center gap-3 mt-1 text-gray-600">
                            <Mail size={18} />
                            <span>{agent.email}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}