'use client';

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import LeaseForm from "@/components/dashboard/Owner/leases/LeaseForm/LeaseForm";
import { leaseService } from "@/services/lease.service";

export default function EditLeasePage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [lease, setLease] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLease();
  }, [params.id]);

  const fetchLease = async () => {
    try {
      setLoading(true);
      const response = await leaseService.getLeaseById(params.id);

      console.log('Full lease response:', response);

      if (response.success) {
        console.log('Lease data received:', {
          rentAmount: response.data.rentAmount,
          propertyPrice: response.data.property?.price,
          fullLease: response.data
        });
        setLease(response.data);
      } else {
        setError(response.message || 'Lease not found');
      }
    } catch (err) {
      console.error('Error fetching lease:', err);
      setError(err.response?.data?.message || 'Failed to fetch lease');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = (updatedData) => {
    router.push(`/dashboard/owner/leases/${params.id}`);
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-[#1F3A34]" />
      </div>
    );
  }

  if (error || !lease) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-[#004087]">Lease Not Found</h1>
        <p className="text-gray-600 mt-2">{error || 'The requested lease does not exist.'}</p>
        <button
          onClick={() => router.push('/dashboard/owner/leases')}
          className="mt-4 px-4 py-2 bg-[#004087] text-white rounded-lg"
        >
          Back to Leases
        </button>
      </div>
    );
  }

  // Calculate the monthly rent value - priority order:
  // 1. lease.rentAmount (the actual rent for this lease)
  // 2. lease.property.price (the property's base price)
  // 3. empty string as fallback
  const monthlyRent =
    lease.rentAmount !== undefined && lease.rentAmount !== null
      ? lease.rentAmount.toString()
      : lease.property?.price !== undefined && lease.property?.price !== null
        ? lease.property.price.toString()
        : "";

  console.log('Calculated monthlyRent for form:', {
    leaseRentAmount: lease.rentAmount,
    propertyPrice: lease.property?.price,
    finalValue: monthlyRent
  });

  // Prepare initial data for form
  const formInitialData = {
    id: lease._id,
    title: lease.title || '',
    description: lease.description || '',
    propertyAddress: lease.property?.address || '',
    propertyId: lease.property?._id || '',
    tenantId: lease.tenant?._id || '',
    landlordName: lease.landlord?.name || '',
    tenantName: lease.tenant?.name || '',
    startDate: lease.startDate ? new Date(lease.startDate).toISOString().split('T')[0] : '',
    endDate: lease.endDate ? new Date(lease.endDate).toISOString().split('T')[0] : '',
    monthlyRent: monthlyRent,
    paymentDay: lease.terms?.paymentDay?.toString() || '1',
    securityDeposit: lease.securityDeposit?.toString() || '',
    paymentMethod: lease.terms?.paymentMethod || 'bank_transfer',
    utilitiesIncluded:
      lease.utilities?.includedInRent ||
      lease.terms?.utilitiesIncluded ||
      [],

    utilitiesTenantPaid:
      lease.utilities?.paidByTenant ||
      lease.terms?.utilitiesTenantPaid ||
      [],

    maintenanceTerms:
      lease.maintenanceTerms ||
      lease.terms?.maintenanceTerms ||
      "",

    occupants: lease.terms?.occupants || '',
    noticeDays: lease.terms?.noticeDays?.toString() || '30',
    additionalTerms: lease.terms?.additionalTerms || lease.description || '',
    leaseType: lease.terms?.leaseType || 'fixed_term',
  };

  const handleResolveChange = async (index) => {
    try {
      const response = await leaseService.updateLease(lease._id, {
        resolveChangeIndex: index
      });

      if (response.success) {
        alert("Change request resolved");
        fetchLease();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to resolve change");
    }
  };


  return (
    <div className="p-6">
      <button
        onClick={handleBack}
        className="mb-6 flex items-center gap-2 border border-gray-300 p-2 rounded-md text-[#1F3A34]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Lease Details
      </button>
      <LeaseForm
        propertyData={{
          id: lease.property?._id,
          address: lease.property?.address,
          price: lease.rentAmount || lease.property?.price
        }}
        tenantData={{
          id: lease.tenant?._id,
          name: lease.tenant?.name,
          email: lease.tenant?.email
        }}
        landlordData={{
          id: lease.landlord?._id,
          name: lease.landlord?.name,
          email: lease.landlord?.email
        }}
        mode="edit"
        initialData={formInitialData}
        onSuccess={handleSuccess}
      />
    </div>
  );
}