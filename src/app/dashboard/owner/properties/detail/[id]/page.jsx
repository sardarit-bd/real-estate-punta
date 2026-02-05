'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Star,
    MapPin,
    Bed,
    Square,
    Calendar,
    Check,
    Wifi,
    Car,
    Snowflake,
    Droplets,
    Tv,
    Microwave,
    Coffee,
    Dumbbell,
    Waves,
    Shield,
    Lock,
    Phone,
    Mail,
    Share2,
    Heart,
    Eye,
    Edit,
    Trash2,
    Home,
    ChevronLeft,
    ChevronRight,
    Users,
    DoorOpen,
    Wind,
    Utensils,
    ShowerHead,
    Bath as BathIcon,
    AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function PropertyDetailsPage() {
    const { t } = useTranslation();
    const params = useParams();
    const router = useRouter();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [showAllAmenities, setShowAllAmenities] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const propertyId = params.id;

    useEffect(() => {
        const fetchPropertyDetails = async () => {
            try {
                setLoading(true);
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/properties/${propertyId}`
                );

                if (res.data.success) {
                    setProperty(res.data.data);
                } else {
                    setError(t('dashboard.owner.propertyDetails.propertyNotFound'));
                }
            } catch (err) {
                console.error('Failed to fetch property details', err);
                setError(t('dashboard.owner.propertyDetails.loadError'));
            } finally {
                setLoading(false);
            }
        };

        if (propertyId) {
            fetchPropertyDetails();
        }
    }, [propertyId, t]);

    // Amenity icons mapping
    const amenityIcons = {
        wifi: <Wifi className="h-5 w-5" />,
        parking: <Car className="h-5 w-5" />,
        ac: <Snowflake className="h-5 w-5" />,
        heating: <Droplets className="h-5 w-5" />,
        tv: <Tv className="h-5 w-5" />,
        kitchen: <Microwave className="h-5 w-5" />,
        coffee_maker: <Coffee className="h-5 w-5" />,
        gym: <Dumbbell className="h-5 w-5" />,
        pool: <Waves className="h-5 w-5" />,
        security: <Shield className="h-5 w-5" />,
        elevator: <Lock className="h-5 w-5" />,
        balcony: <Eye className="h-5 w-5" />,
        garden: <Home className="h-5 w-5" />,
        beach_access: <Waves className="h-5 w-5" />,
        concierge: <Users className="h-5 w-5" />,
        spa: <Droplets className="h-5 w-5" />,
        bbq_area: <Utensils className="h-5 w-5" />,
        tennis_court: <Car className="h-5 w-5" />,
        washer: <ShowerHead className="h-5 w-5" />,
        dryer: <Wind className="h-5 w-5" />,
    };

    const handleDeleteProperty = async () => {
        setDeleting(true);
        try {
            await axios.delete(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/properties/${propertyId}`,
                {
                    withCredentials: true
                }
            );

            alert(t('dashboard.owner.propertyDetails.deleteSuccess'));
            router.push('/dashboard/owner/properties');
        } catch (err) {
            console.error('Failed to delete property', err);
            alert(t('dashboard.owner.propertyDetails.deleteError'));
        } finally {
            setDeleting(false);
            setShowDeleteModal(false);
        }
    };

    // const handleShare = () => {
    //     if (navigator.share) {
    //         navigator.share({
    //             title: property?.title,
    //             text: property?.description,
    //             url: window.location.href,
    //         });
    //     } else {
    //         navigator.clipboard.writeText(window.location.href);
    //         alert(t('propertyDetails.linkCopied'));
    //     }
    // };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 md:p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse space-y-6">
                        {/* Back button skeleton */}
                        <div className="h-10 w-32 bg-gray-200 rounded"></div>

                        {/* Image gallery skeleton */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div className="lg:col-span-2 h-96 bg-gray-200 rounded-xl"></div>
                            <div className="grid grid-cols-2 gap-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-44 bg-gray-200 rounded-lg"></div>
                                ))}
                            </div>
                        </div>

                        {/* Content skeleton */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="h-10 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-32 bg-gray-200 rounded"></div>
                            </div>
                            <div className="h-64 bg-gray-200 rounded-xl"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !property) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {error || t('dashboard.owner.propertyDetails.propertyNotFound')}
                    </h1>
                    <p className="text-gray-600 mb-6">
                        {t('dashboard.owner.propertyDetails.propertyRemoved')}
                    </p>
                    <Link
                        href="/dashboard/owner/properties"
                        className="inline-flex items-center px-6 py-3 bg-[#004087] text-white rounded-lg hover:bg-[#004797] transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        {t('dashboard.owner.        propertyDetails.backToProperties')}
                    </Link>
                </div>
            </div>
        );
    }

    // Get all images including cover
    const allImages = property.images || [];
    const visibleAmenities = showAllAmenities
        ? property.amenities
        : property.amenities?.slice(0, 6);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <div className="flex items-center mb-4">
                            <div className="p-2 bg-red-100 rounded-lg mr-3">
                                <AlertTriangle className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                {t('dashboard.owner.propertyDetails.deleteProperty')}
                            </h3>
                        </div>

                        <p className="text-gray-600 mb-6">
                            {t('dashboard.owner.propertyDetails.deleteConfirmation', { title: property.title })}
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                disabled={deleting}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                {t('common.cancel')}
                            </button>
                            <button
                                onClick={handleDeleteProperty}
                                disabled={deleting}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                            >
                                {deleting ? (
                                    <>
                                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        {t('dashboard.owner.propertyDetails.deleting')}
                                    </>
                                ) : (
                                    t('dashboard.owner.propertyDetails.deleteProperty')
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-4 md:p-8">
                {/* Header with back button and actions */}
                <div className="mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <Link
                            href="/dashboard/owner/properties"
                            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            {t('dashboard.owner.propertyDetails.backToProperties')}
                        </Link>

                        <div className="flex items-center gap-3">
                            {/* <button
                                onClick={handleShare}
                                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <Share2 className="h-4 w-4 mr-2" />
                                {t('propertyDetails.share')}
                            </button> */}

                            <Link
                                href={`/dashboard/owner/properties/edit/${propertyId}`}
                                className="flex items-center px-4 py-2 bg-[#004087] text-white rounded-lg hover:bg-[#004797] transition-colors"
                            >
                                <Edit className="h-4 w-4 mr-2" />
                                {t('dashboard.owner.propertyDetails.editProperty')}
                            </Link>

                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="flex items-center px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                {t('dashboard.owner.propertyDetails.delete')}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Property Status Badges */}
                <div className="flex flex-wrap gap-3 mb-6">
                    {property.featured && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                            <Star className="h-3 w-3 mr-1 fill-yellow-500" />
                            {t('dashboard.owner.propertyDetails.featured')}
                        </span>
                    )}

                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${property.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                        }`}>
                        <div className={`h-2 w-2 rounded-full mr-2 ${property.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                            }`}></div>
                        {property.status === 'active' ? t('dashboard.owner.propertyDetails.active') : t('dashboard.owner.propertyDetails.inactive')}
                    </span>

                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        <DoorOpen className="h-3 w-3 mr-1" />
                        {property.listingType === 'rent' ? t('dashboard.owner.propertyDetails.forRent') : t('dashboard.owner.propertyDetails.forSale')}
                    </span>

                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                        <Home className="h-3 w-3 mr-1" />
                        {property.type}
                    </span>
                </div>

                {/* Image Gallery */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
                    {/* Main Image */}
                    <div className="lg:col-span-2">
                        <div className="relative h-96 md:h-[500px] bg-gray-200 rounded-2xl overflow-hidden group">
                            <img
                                src={allImages[activeImageIndex]?.url || '/placeholder.jpg'}
                                alt={property.title}
                                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />

                            {/* Navigation arrows */}
                            {allImages.length > 1 && (
                                <>
                                    <button
                                        onClick={() => setActiveImageIndex(prev =>
                                            prev === 0 ? allImages.length - 1 : prev - 1
                                        )}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white shadow-lg transition-all hover:scale-110"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => setActiveImageIndex(prev =>
                                            prev === allImages.length - 1 ? 0 : prev + 1
                                        )}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white shadow-lg transition-all hover:scale-110"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Thumbnails - Fixed Height Solution */}
                    <div className="grid grid-cols-2 gap-4 h-fit">
                        {allImages.slice(0, 4).map((img, index) => (
                            <button
                                key={img._id}
                                onClick={() => setActiveImageIndex(index)}
                                className={`relative w-full aspect-square rounded-xl overflow-hidden transition-all duration-300 ${activeImageIndex === index
                                    ? 'ring-2 ring-[#004087] ring-offset-2'
                                    : 'hover:scale-[1.02]'
                                    }`}
                            >
                                <img
                                    src={img.url}
                                    alt={`${t('propertyDetails.property')} ${index + 1}`}
                                    className="h-full w-full object-cover"
                                />
                                {img.isCover && (
                                    <span className="absolute top-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                                        {t('dashboard.owner.propertyDetails.cover')}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Property Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Title and Price */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {property.title}
                            </h1>
                            <div className="flex items-center text-gray-600 mb-4">
                                <MapPin className="h-5 w-5 mr-2 flex-shrink-0" />
                                <span className="text-lg">{property.address}, {property.city}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-bold text-gray-900">
                                        ${property.price}
                                    </span>
                                    {property.listingType === 'rent' && (
                                        <span className="text-gray-600">
                                            /{property.pricePeriod === 'night' ? t('dashboard.owner.propertyDetails.perNight') : property.pricePeriod}
                                        </span>
                                    )}
                                </div>

                                <button
                                    onClick={() => setIsFavorite(!isFavorite)}
                                    className={`p-3 rounded-full ${isFavorite
                                        ? 'bg-red-50 text-red-500'
                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                        } transition-colors`}
                                >
                                    <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500' : ''}`} />
                                </button>
                            </div>
                        </div>
                        {/* Description */}
                        <div className="bg-white rounded-2xl shadow-sm border p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                {t('dashboard.owner.propertyDetails.description')}
                            </h2>
                            <p className="text-gray-600 whitespace-pre-line">{property.description}</p>
                        </div>

                        {/* Amenities */}
                        <div className="bg-white rounded-2xl shadow-sm border p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">
                                {t('dashboard.owner.propertyDetails.amenities')}
                            </h2>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {visibleAmenities?.map((amenity, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="p-2 bg-white rounded-lg mr-3">
                                            {amenityIcons[amenity] || (
                                                <Check className="h-4 w-4 text-green-500" />
                                            )}
                                        </div>

                                        <span className="text-gray-700">
                                            {t(`dashboard.owner.amenities.${amenity}`, {
                                                defaultValue: amenity.replace(/_/g, ' ')
                                            })}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {property.amenities?.length > 6 && (
                                <button
                                    onClick={() => setShowAllAmenities(!showAllAmenities)}
                                    className="mt-6 w-full py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    {showAllAmenities
                                        ? t('dashboard.owner.propertyDetails.showLess')
                                        : t('dashboard.owner.propertyDetails.showAllAmenities', {
                                            count: property.amenities.length
                                        })}
                                </button>
                            )}
                        </div>


                        {/* Location */}
                        <div className="bg-white rounded-2xl shadow-sm border p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                {t('dashboard.owner.propertyDetails.location')}
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {t('dashboard.owner.propertyDetails.address')}
                                        </p>
                                        <p className="text-gray-600">{property.address}, {property.city}</p>
                                    </div>
                                </div>

                                {/* You can add a map here */}
                                <div className="h-64 bg-gray-200 rounded-xl flex items-center justify-center">
                                    <div className="text-center">
                                        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                        <p className="text-gray-600">{t('propertyDetails.mapPlaceholder')}</p>
                                        <p className="text-sm text-gray-500">{t('propertyDetails.mapIntegration')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Owner Actions & Info */}
                    <div className="space-y-6">
                        {/* Owner Actions Card */}
                        <div className="bg-white rounded-2xl shadow-sm border p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">
                                {t('dashboard.owner.propertyDetails.propertyActions')}
                            </h3>

                            <div className="grid grid-cols-1 gap-3">
                                <Link
                                    href={`/dashboard/owner/properties/edit/${propertyId}`}
                                    className="flex items-center justify-center px-4 py-3 bg-[#004087] text-white rounded-lg hover:bg-[#004797] transition-colors"
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    {t('dashboard.owner.propertyDetails.editPropertyDetails')}
                                </Link>
                                <button
                                    onClick={() => setShowDeleteModal(true)}
                                    className="flex items-center justify-center w-full px-4 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    {t('dashboard.owner.propertyDetails.deleteProperty')}
                                </button>
                            </div>
                        </div>

                        {/* Property Info Card */}
                        <div className="bg-white rounded-2xl shadow-sm border p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">
                                {t('dashboard.owner.propertyDetails.propertyInformation')}
                            </h3>

                            <div className="space-y-4">
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">{t('dashboard.owner.propertyDetails.propertyId')}</span>
                                    <span className="font-medium">{property._id}</span>
                                </div>

                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">{t('dashboard.owner.propertyDetails.createdOn')}</span>
                                    <span className="font-medium">
                                        {new Date(property.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">{t('dashboard.owner.propertyDetails.lastUpdated')}</span>
                                    <span className="font-medium">
                                        {new Date(property.updatedAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">{t('dashboard.owner.propertyDetails.status')}</span>
                                    <span className={`font-medium ${property.status === 'active' ? 'text-green-600' : 'text-gray-600'
                                        }`}>
                                        {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                                    </span>
                                </div>

                                <div className="flex justify-between py-2">
                                    <span className="text-gray-600">{t('dashboard.owner.propertyDetails.featured')}</span>
                                    <span className={`font-medium ${property.featured ? 'text-yellow-600' : 'text-gray-600'
                                        }`}>
                                        {property.featured ? t('common.yes') : t('common.no')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Additional Info at Bottom */}
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-1 gap-6">
                            <div className="bg-white rounded-2xl shadow-sm border p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">
                                    {t('dashboard.owner.propertyDetails.availabilityPricing')}
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-700">{t('dashboard.owner.propertyDetails.minimumStay')}</span>
                                        <span className="font-semibold">
                                            {property.availability?.minimumStay || 1} {t('dashboard.owner.propertyDetails.nights')}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-700">{t('dashboard.owner.propertyDetails.securityDeposit')}</span>
                                        <span className="font-semibold">${property.price * 2}</span>
                                    </div>

                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-700">{t('dashboard.owner.propertyDetails.cleaningFee')}</span>
                                        <span className="font-semibold">$75</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}