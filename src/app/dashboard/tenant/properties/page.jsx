"use client";

import { useState, useEffect } from "react";
import { toast } from 'react-hot-toast';
import { Home, LayoutGrid, List } from "lucide-react";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Import Components
// import PropertyDetailsDialog from "@/components/dashboard/Tenant/properties/PropertyDetailsDialog";
// import ContactLandlordForm from "@/components/dashboard/tenant/ContactLandlordForm";
// import PropertyCard from "@/components/dashboard/Tenant/properties/PropertyCard";
// import PropertyListRow from "@/components/dashboard/Tenant/properties/PropertyListRow";

// Icons
import { Search, Eye, MessageSquare, Heart } from "lucide-react";
import ContactLandlordForm from "@/components/dashboard/Tenant/properties/ContactLandlordForm";
import PropertyDetailsDialog from "@/components/dashboard/Tenant/properties/PropertyDetailsDialog";
import PropertyListRow from "@/components/dashboard/Tenant/properties/PropertyListRow";
import PropertyCard from "@/components/dashboard/Tenant/properties/PropertyCard";

export default function TenantPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [favorites, setFavorites] = useState([]);
  const [sortBy, setSortBy] = useState("recent");
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  // Fetch properties data for tenant
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        const mockProperties = [
          {
            id: "PR-001",
            title: "Luxury Villa Punta Cana",
            description: "5 bedroom luxury villa with private pool and ocean view. Perfect for family vacations or group getaways.",
            location: "Punta Cana, Dominican Republic",
            address: "123 Ocean Drive, Punta Cana",
            price: 350,
            currency: "USD",
            period: "night",
            bedrooms: 5,
            bathrooms: 4,
            guests: 10,
            area: "3,500",
            unit: "sq ft",
            status: "available",
            rating: 4.8,
            reviews: 42,
            amenities: ["Pool", "WiFi", "AC", "Parking", "Kitchen", "Beach Access", "Gym"],
            images: [
              "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=800&auto=format&fit=crop"
            ],
            landlord: {
              name: "John Smith",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
              rating: 4.9,
              verified: true,
              responseRate: "95%",
              responseTime: "Within 2 hours"
            },
            leaseType: "Monthly",
            availableFrom: "2024-04-01",
            minStay: 30,
            maxStay: 365,
            deposit: 700,
            utilitiesIncluded: ["Water", "Electricity", "Internet"],
            petsAllowed: true,
            featured: true,
            createdAt: "2024-01-15"
          },
          {
            id: "PR-002",
            title: "Beachfront Condo Bavaro",
            description: "Modern 2-bedroom condo with direct beach access. Recently renovated with all modern amenities.",
            location: "Bavaro, Dominican Republic",
            address: "456 Beach Boulevard, Bavaro",
            price: 220,
            currency: "USD",
            period: "night",
            bedrooms: 2,
            bathrooms: 2,
            guests: 4,
            area: "1,200",
            unit: "sq ft",
            status: "available",
            rating: 4.5,
            reviews: 28,
            amenities: ["Beach Front", "WiFi", "AC", "Parking", "Kitchen", "Balcony", "TV"],
            images: [
              "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop"
            ],
            landlord: {
              name: "Maria Garcia",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
              rating: 4.7,
              verified: true,
              responseRate: "90%",
              responseTime: "Within 4 hours"
            },
            leaseType: "Flexible",
            availableFrom: "2024-03-20",
            minStay: 7,
            maxStay: 180,
            deposit: 440,
            utilitiesIncluded: ["Water", "Electricity"],
            petsAllowed: false,
            featured: false,
            createdAt: "2024-02-20"
          },
          {
            id: "PR-003",
            title: "Golf Course Villa Cap Cana",
            description: "Luxurious 6-bedroom villa on championship golf course with private chef service available.",
            location: "Cap Cana, Dominican Republic",
            address: "789 Golf View Road, Cap Cana",
            price: 450,
            currency: "USD",
            period: "night",
            bedrooms: 6,
            bathrooms: 5,
            guests: 12,
            area: "4,500",
            unit: "sq ft",
            status: "occupied",
            rating: 4.9,
            reviews: 56,
            amenities: ["Golf Course", "Pool", "WiFi", "AC", "Parking", "Kitchen", "Gym", "Spa", "Private Chef"],
            images: [
              "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop"
            ],
            landlord: {
              name: "Robert Johnson",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
              rating: 4.8,
              verified: true,
              responseRate: "98%",
              responseTime: "Within 1 hour"
            },
            leaseType: "Annual",
            availableFrom: "2024-06-01",
            minStay: 90,
            maxStay: 365,
            deposit: 900,
            utilitiesIncluded: ["Water", "Electricity", "Internet", "Cable"],
            petsAllowed: true,
            featured: true,
            createdAt: "2024-01-05"
          }
        ];

        setProperties(mockProperties);
      } catch (error) {
        toast.error("Failed to load properties");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Filter properties based on search and filters
  const filteredProperties = properties.filter(property => {
    const matchesSearch = searchQuery === "" ||
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filter === "all" || property.status === filter;

    return matchesSearch && matchesStatus;
  });

  // Sort properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      case 'beds': return b.bedrooms - a.bedrooms;
      default: return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  // Toggle favorite
  const toggleFavorite = (propertyId) => {
    if (favorites.includes(propertyId)) {
      setFavorites(favorites.filter(id => id !== propertyId));
      toast.success("Removed from favorites");
    } else {
      setFavorites([...favorites, propertyId]);
      toast.success("Added to favorites");
    }
  };

  // Handle contact landlord
  const handleContactLandlord = (property) => {
    toast.success(`Contact request sent to ${property.landlord.name}`);
    setContactDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#1F3A34]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#113B28]">
            Available Properties
          </h1>
          <CardDescription>
            Browse and find your perfect rental property
          </CardDescription>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm">
            <span className="font-semibold text-[#113B28]">{sortedProperties.length}</span> properties found
          </Badge>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search properties by title, location, or amenities..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Properties</SelectItem>
                  <SelectItem value="available">Available Now</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rating</SelectItem>
                  <SelectItem value="beds">Most Bedrooms</SelectItem>
                </SelectContent>
              </Select>



              <div className="flex border rounded-md overflow-hidden">
                {/* Grid View */}
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className="h-[35px] w-9 rounded-none"
                >
                  <LayoutGrid
                    className={`h-4 w-4 ${viewMode === "grid" ? "text-white" : "text-gray-600"
                      }`}
                  />
                </Button>

                {/* List View */}
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className="h-[35px] w-9 rounded-none"
                >
                  <List
                    className={`h-4 w-4 ${viewMode === "list" ? "text-white" : "text-gray-600"
                      }`}
                  />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Properties Grid/List */}
      {viewMode === "grid" ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProperties.length === 0 ? (
            <div className="col-span-3">
              <Card className="p-12 text-center">
                <Home className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <CardDescription className="mb-6 max-w-md mx-auto">
                  {searchQuery ? `No properties match "${searchQuery}". Try different keywords.` : 'No properties available matching your filters.'}
                </CardDescription>
                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setFilter('all');
                    setSortBy('recent');
                  }}
                >
                  Clear Filters
                </Button>
              </Card>
            </div>
          ) : (
            sortedProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                isFavorite={favorites.includes(property.id)}
                onToggleFavorite={toggleFavorite}
                onViewDetails={() => {
                  setSelectedProperty(property);
                  setDetailsDialogOpen(true);
                }}
                onContact={() => {
                  setSelectedProperty(property);
                  setContactDialogOpen(true);
                }}
              />
            ))
          )}
        </div>
      ) : (
        /* List View */
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Property</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedProperties.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Home className="h-12 w-12 text-gray-300 mb-4" />
                        <p className="text-gray-500">No properties found</p>
                        <p className="text-sm text-gray-400">
                          Try adjusting your search or filter
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedProperties.map((property) => (
                    <PropertyListRow
                      key={property.id}
                      property={property}
                      isFavorite={favorites.includes(property.id)}
                      onToggleFavorite={toggleFavorite}
                      onContactLandlord={handleContactLandlord}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Property Details Dialog */}
      {/* {selectedProperty && (
        <PropertyDetailsDialog
          property={selectedProperty}
          open={detailsDialogOpen}
          onOpenChange={setDetailsDialogOpen}
        />
      )} */}

      {/* Contact Landlord Dialog */}
      {/* {selectedProperty && (
        <ContactLandlordForm
          property={selectedProperty}
          open={contactDialogOpen}
          onOpenChange={setContactDialogOpen}
          onSubmit={handleContactLandlord}
        />
      )} */}
    </div>
  );
}