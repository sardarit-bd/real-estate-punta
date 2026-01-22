"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SignatureView from "@/components/dashboard/Owner/leases/LeaseForm/SignatureView";
import { ArrowLeft, Loader2 } from "lucide-react";
import { leaseService } from "@/services/lease.service";

export default function TenantSignLeasePage() {
  const { id } = useParams();
  const router = useRouter();

  const [lease, setLease] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLease();
  }, [id]);

  const fetchLease = async () => {
    try {
      setLoading(true);
      const res = await leaseService.getLeaseById(id);

      if (res.success) {
        setLease(res.data);
      } else {
        setError("Lease not found");
      }
    } catch (err) {
      setError(err.message || "Failed to load lease");
    } finally {
      setLoading(false);
    }
  };

  const handleSigned = async ({
    signatureDataUrl,
    signatureMode,
    typedSignature,
  }) => {
    try {
      await leaseService.signLease(id, {
        signatureDataUrl,
        signatureMode,
        typedSignature,
      });

      alert("Lease signed successfully");
      router.push(`/dashboard/tenant/leases/${id}`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to sign lease");
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#1F3A34]" />
      </div>
    );
  }

  if (error || !lease) {
    return <p className="p-6 text-red-600">{error || "Lease not found"}</p>;
  }

  return (
    <div className="p-6">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 border px-3 py-2 rounded-md"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <SignatureView
        data={{
          propertyAddress: lease.property?.address,
          monthlyRent: lease.rentAmount,
          startDate: lease.startDate,
          endDate: lease.endDate,
          securityDeposit: lease.securityDeposit,
        }}
        onSign={handleSigned}
        loading={false}
      />
    </div>
  );
}
