"use client";

import { MapPin, Star, Bed, Bath, Users, Calendar, Clock, Tag, Building, CheckCircle, Phone, MessageSquare, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function PropertyDetailsDialog({ property }) {
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const calculateMonthlyPrice = (dailyPrice) => dailyPrice * 30;

  return (
    <div className="space-y-8 py-2">
      {/* Header Section */}
      <div className="border-b pb-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-[#113B28] mb-2">
              {property.title}
            </h1>
            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>{property.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                <span>+1 234 567 8900</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-100 text-green-800">
              {property.status === 'available' ? 'Available Now' : 'Occupied'}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              {property.rating} ({property.reviews})
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Description & Amenities */}
        <div className="lg:col-span-2 space-y-8">
          {/* Property Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {property.images.slice(1, 3).map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${property.title} ${index + 2}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-2xl font-bold text-[#113B28] mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed">{property.description}</p>
          </div>

          {/* Amenities */}
          <div>
            <h2 className="text-2xl font-bold text-[#113B28] mb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {property.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Cards */}
        <div className="space-y-6">
          {/* Pricing Card */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-3 bg-gray-50">
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Pricing Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="flex justify-between items-center py-2 border-b">
                <div className="text-gray-600">Daily Rate</div>
                <div className="font-bold text-lg">${property.price}/{property.period}</div>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <div className="text-gray-600">Monthly Rent</div>
                <div className="font-bold text-lg">{formatCurrency(calculateMonthlyPrice(property.price))}</div>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <div className="text-gray-600">Security Deposit</div>
                <div className="font-bold text-lg">{formatCurrency(property.deposit)}</div>
              </div>
              <div className="flex justify-between items-center pt-2">
                <div className="font-bold text-lg">Total Move-in Cost</div>
                <div className="font-bold text-xl text-[#113B28]">
                  {formatCurrency(calculateMonthlyPrice(property.price) + property.deposit)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Details Card */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-3 bg-gray-50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building className="h-5 w-5 text-purple-600" />
                Property Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#113B28] mb-1">{property.bedrooms}</div>
                  <div className="text-sm text-gray-600">Bedrooms</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#113B28] mb-1">{property.bathrooms}</div>
                  <div className="text-sm text-gray-600">Bathrooms</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#113B28] mb-1">{property.guests}</div>
                  <div className="text-sm text-gray-600">Max Guests</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#113B28] mb-1">{property.area}</div>
                  <div className="text-sm text-gray-600">Area ({property.unit})</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Availability Card */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-3 bg-gray-50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Availability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-500 flex-shrink-0" />
                <div>
                  <div className="text-sm text-gray-600">Available from</div>
                  <div className="font-semibold">{formatDate(property.availableFrom)}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gray-500 flex-shrink-0" />
                <div>
                  <div className="text-sm text-gray-600">Minimum stay</div>
                  <div className="font-semibold">{property.minStay} days</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Tag className="h-5 w-5 text-gray-500 flex-shrink-0" />
                <div>
                  <div className="text-sm text-gray-600">Lease type</div>
                  <div className="font-semibold">{property.leaseType}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button className="flex-1 bg-[#113B28] hover:bg-[#0c2a1e]">
              <Phone className="h-4 w-4 mr-2" />
              Call Now
            </Button>
            <Button variant="outline" className="flex-1">
              <MessageSquare className="h-4 w-4 mr-2" />
              Message
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}