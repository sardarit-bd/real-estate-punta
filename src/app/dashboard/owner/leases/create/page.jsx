'use client';

import LeaseForm from "@/components/dashboard/Owner/leases/LeaseForm/LeaseForm";
import { useAuth } from "@/hooks/userAuth";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { leaseService } from "@/services/lease.service";

export default function CreateLeasePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const handleSuccess = async (leaseData) => {
    try {
      setLoading(true);
      setError(null);

      // Create lease using API
      const response = await leaseService.createLease({
        property: leaseData.propertyId,
        title: leaseData.title,
        description: leaseData.description,
        startDate: leaseData.startDate,
        endDate: leaseData.endDate,
        rentAmount: leaseData.monthlyRent,
        securityDeposit: leaseData.securityDeposit,
        terms: {
          utilitiesIncluded: leaseData.utilitiesIncluded,
          utilitiesTenantPaid: leaseData.utilitiesTenantPaid,
          occupants: leaseData.occupants,
          noticeDays: leaseData.noticeDays,
          additionalTerms: leaseData.additionalTerms
        }
      });

      if (response.success) {
        // Navigate to the new lease details
        router.push(`/dashboard/owner/leases/${response.data._id}`);
      } else {
        setError(response.message || 'Failed to create lease');
      }
    } catch (err) {
      console.error('Error creating lease:', err);
      setError(err.response?.data?.message || err.message || 'Failed to create lease');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/dashboard/owner/leases');
  };

  const landlordData = {
    name: user?.name || 'John Smith',
    email: user?.email || 'john@example.com',
    role: user?.role || 'owner'
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1F3A34]"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="mb-6 flex items-center gap-2 border border-gray-300 p-2 rounded-md text-[#1F3A34] hover:text-[#2a4d45]"
        disabled={loading}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to All Leases
      </button>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <LeaseForm
        propertyData={selectedProperty}
        landlordData={landlordData}
        mode="create"
        onSuccess={handleSuccess}
        loading={loading}
      />
    </div>
  );
}