"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function PropertyDetailsDialog({ property, open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-2xl">{property.title}</DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            {property.location}
          </DialogDescription>
        </DialogHeader>
        <PropertyDetailsContent property={property} />
      </DialogContent>
    </Dialog>
  );
}