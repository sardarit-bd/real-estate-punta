"use client";

import { useState } from "react";
import { MapPin, Star, Bed, Bath, Users, Heart, Eye, MessageSquare, Calendar, Phone, Share2, ChevronDown, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import PropertyDetailsDialog from "./PropertyDetailsDialog";
import ContactLandlordForm from "./ContactLandlordForm";
import { toast } from "react-hot-toast";
import { TableCell } from "@/components/ui/table";

export default function PropertyListRow({ property, isFavorite, onToggleFavorite, onContactLandlord }) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const handleScheduleTour = () => {
    toast.success(`Tour scheduled for ${property.title}`);
  };

  return (
    <>
      <tr className="hover:bg-gray-50/50">
        <TableCell>
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 rounded-lg">
              <AvatarImage src={property.images[0]} alt={property.title} />
              <AvatarFallback className="rounded-lg">
                <Building className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-[#113B28]">
                {property.title}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-medium">{property.rating}</span>
                <span className="text-xs text-gray-500">({property.reviews})</span>
              </div>
            </div>
          </div>
        </TableCell>

        <TableCell>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="text-sm">{property.location}</span>
          </div>
        </TableCell>

        <TableCell>
          <div className="font-semibold text-gray-800">
            ${property.price}
            <span className="text-sm font-normal text-gray-500">/{property.period}</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {property.leaseType} lease
          </div>
        </TableCell>

        <TableCell>
          <div className="text-sm">
            <div className="flex items-center gap-2">
              <Bed className="h-3 w-3 text-gray-500" />
              <span>{property.bedrooms} bed</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Bath className="h-3 w-3 text-gray-500" />
              <span>{property.bathrooms} bath</span>
            </div>
          </div>
        </TableCell>

        <TableCell>
          <Badge
            variant={property.status === 'available' ? "default" : "secondary"}
            className={property.status === 'available' ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"}
          >
            {property.status === 'available' ? 'Available Now' : 'Occupied'}
          </Badge>
          <div className="text-xs text-gray-500 mt-1">
            From {formatDate(property.availableFrom)}
          </div>
        </TableCell>

        <TableCell className="text-right">
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleFavorite(property.id)}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            </Button>

            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent
                className=" w-[95vw] sm:max-w-[600px] md:max-w-[800px] lg:max-w-[1000px] xl:max-w-[1200px] max-h-[90vh] overflow-y-auto p-4 md:p-6"
              >
                <div className="p-6">
                  <DialogHeader className="pb-4">
                    <DialogTitle className="sr-only">Property Details</DialogTitle>
                  </DialogHeader>
                  <PropertyDetailsDialog property={property} />
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={contactOpen} onOpenChange={setContactOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Contact Landlord</DialogTitle>
                  <DialogDescription>
                    Send a message to {property.landlord.name}
                  </DialogDescription>
                </DialogHeader>
                <ContactLandlordForm property={property} />
              </DialogContent>
            </Dialog>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleScheduleTour}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Tour
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Property
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Phone className="h-4 w-4 mr-2" />
                  Call Landlord
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TableCell>
      </tr>
    </>
  );
}

// import { TableCell } from "@/components/ui/table";
// import { Building } from "lucide-react";