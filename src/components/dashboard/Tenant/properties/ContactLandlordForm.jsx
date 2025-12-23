"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function ContactLandlordForm({ property, onSubmit, onCancel }) {
  const [message, setMessage] = useState("");
  const [contactMethod, setContactMethod] = useState("message");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(property);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-2">
      <div className="space-y-4">
        <Label className="text-base">Contact Method</Label>
        <RadioGroup
          value={contactMethod}
          onValueChange={setContactMethod}
          className="grid grid-cols-1 md:grid-cols-3 gap-3"
        >
          <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
            <RadioGroupItem value="message" id="message" />
            <Label htmlFor="message" className="cursor-pointer flex-1">
              <div className="font-medium">Message</div>
              <div className="text-sm text-gray-500">Send a direct message</div>
            </Label>
          </div>
          <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
            <RadioGroupItem value="call" id="call" />
            <Label htmlFor="call" className="cursor-pointer flex-1">
              <div className="font-medium">Phone Call</div>
              <div className="text-sm text-gray-500">Request a phone call</div>
            </Label>
          </div>
          <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
            <RadioGroupItem value="tour" id="tour" />
            <Label htmlFor="tour" className="cursor-pointer flex-1">
              <div className="font-medium">Schedule Tour</div>
              <div className="text-sm text-gray-500">Book a property tour</div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-3">
        <Label htmlFor="message" className="text-base">Your Message</Label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Hi ${property.landlord.name}, I'm interested in "${property.title}" located at ${property.location}. Could you please provide more details about availability and viewing options?`}
          className="w-full min-h-[150px] p-4 border rounded-lg focus:ring-2 focus:ring-[#113B28] focus:border-transparent"
          required
        />
        <div className="text-sm text-gray-500">
          Your contact information will be shared with the landlord
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-[#113B28] hover:bg-[#0c2a1e]">
          Send Message
        </Button>
      </div>
    </form>
  );
}