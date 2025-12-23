"use client";

import { useState } from "react";
import { MapPin, Star, Bed, Bath, Users, Heart, Eye, MessageSquare, Building, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import PropertyDetailsDialog from "./PropertyDetailsDialog";
import ContactLandlordForm from "./ContactLandlordForm";

export default function PropertyCard({ property, isFavorite, onToggleFavorite, onViewDetails, onContact }) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
        {/* Property Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <Badge
              variant={property.status === 'available' ? "default" : "secondary"}
              className={property.status === 'available' ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"}
            >
              {property.status === 'available' ? 'Available Now' : 'Occupied'}
            </Badge>
          </div>
          <div className="absolute top-3 right-3 flex gap-2">
            {property.featured && (
              <Badge className="bg-amber-500 hover:bg-amber-600">
                Featured
              </Badge>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 bg-white/90 backdrop-blur-sm hover:bg-white"
              onClick={() => onToggleFavorite(property.id)}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            </Button>
          </div>
          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex justify-between items-center">
              <Badge className="bg-black/70 backdrop-blur-sm text-white hover:bg-black/70">
                ${property.price}<span className="text-xs">/{property.period}</span>
              </Badge>
              <Badge className="bg-black/70 backdrop-blur-sm text-white hover:bg-black/70">
                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 mr-1" />
                {property.rating} ({property.reviews})
              </Badge>
            </div>
          </div>
        </div>

        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg mb-1">{property.title}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {property.location}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-3">
          {/* Property Details */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center gap-1">
                <Bed className="h-4 w-4 text-gray-500" />
                <span className="font-semibold">{property.bedrooms}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">Beds</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center gap-1">
                <Bath className="h-4 w-4 text-gray-500" />
                <span className="font-semibold">{property.bathrooms}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">Baths</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center gap-1">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="font-semibold">{property.guests}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">Guests</div>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{property.description}</p>

          {/* Amenities */}
          <div className="flex flex-wrap gap-1 mb-4">
            {property.amenities.slice(0, 3).map((amenity, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {amenity}
              </Badge>
            ))}
            {property.amenities.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{property.amenities.length - 3} more
              </Badge>
            )}
          </div>

          {/* Landlord Info */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={property.landlord.avatar} />
                <AvatarFallback>
                  <Building className="h-4 w-4" />
                </AvatarFallback>
                {property.landlord.verified && (
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-2 w-2 text-white" />
                  </div>
                )}
              </Avatar>
              <div>
                <div className="text-sm font-medium">{property.landlord.name}</div>
                <div className="text-xs text-gray-500">Landlord</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-medium">{property.landlord.responseRate} response rate</div>
              <div className="text-xs text-gray-500">{property.landlord.responseTime}</div>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <div className="flex gap-2 w-full">
            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
              <DialogTrigger asChild>
                <Button variant="default" className="flex-1" onClick={onViewDetails}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </DialogTrigger>
              <DialogContent
                className=" w-[95vw] sm:max-w-[600px] md:max-w-[800px] lg:max-w-[1000px] xl:max-w-[1200px] max-h-[90vh] overflow-y-auto p-4 md:p-6"
              >
                <DialogHeader className="pb-4 border-b">
                  <DialogTitle className="text-xl md:text-2xl">{property.title}</DialogTitle>
                  <DialogDescription className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {property.location}
                  </DialogDescription>
                </DialogHeader>
                <PropertyDetailsDialog property={property} />
              </DialogContent>
            </Dialog>

            <Dialog open={contactOpen} onOpenChange={setContactOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex-1" onClick={onContact}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Contact Landlord</DialogTitle>
                  <DialogDescription>
                    Send a message to {property.landlord.name} about {property.title}
                  </DialogDescription>
                </DialogHeader>
                <ContactLandlordForm property={property} />
              </DialogContent>
            </Dialog>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}