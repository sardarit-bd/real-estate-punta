"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { leaseService } from "@/services/lease.service";

export default function TenantLeaseViewPage() {
  const { id } = useParams();
  const router = useRouter();

  const [lease, setLease] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showChangeModal, setShowChangeModal] = useState(false);
  const [changeText, setChangeText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchLease();
  }, [id]);

  const fetchLease = async () => {
    try {
      setLoading(true);
      const res = await leaseService.getLeaseById(id);
      if (res?.success) {
        setLease(res.data);
      } else {
        setError("Lease not found");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch lease details");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestChanges = async () => {
    if (!changeText.trim()) return;

    try {
      setSubmitting(true);
      const res = await leaseService.requestChanges(lease._id, changeText);

      if (res.success) {
        alert("Change request sent to landlord");
        setShowChangeModal(false);
        setChangeText("");
        fetchLease();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to request changes");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error || !lease) {
    return (
      <div className="p-6">
        <p className="text-red-600">{error || "Lease not found"}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 border rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 border px-3 py-2 rounded-md"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* Header */}
      <h1 className="text-2xl font-semibold mb-2">
        Lease Agreement: {lease.property?.title || "N/A"}
      </h1>
      <p className="text-gray-600 mb-6 flex items-center gap-1">
        <MapPin size={16} />
        {lease.property?.address || "Address not available"}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lease Info */}
          <div className="bg-white border rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Lease Information</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Status</p>
                <p className="font-medium capitalize">
                  {lease.status?.replace(/_/g, " ")}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Rent</p>
                <p className="font-medium">
                  ${lease.rentAmount ?? 0} / {lease.rentFrequency || "—"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Security Deposit</p>
                <p className="font-medium">${lease.securityDeposit ?? 0}</p>
              </div>
              <div>
                <p className="text-gray-500">Lease Duration</p>
                <p className="font-medium flex items-center gap-1">
                  <Calendar size={16} />
                  {lease.startDate
                    ? new Date(lease.startDate).toLocaleDateString()
                    : "—"}{" "}
                  →{" "}
                  {lease.endDate
                    ? new Date(lease.endDate).toLocaleDateString()
                    : "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Property */}
          <div className="bg-white border rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Property Details</h2>
            <p className="font-medium">{lease.property?.title}</p>
            <p className="text-sm text-gray-600">{lease.property?.address}</p>
            <p className="text-sm text-gray-600">
              {lease.property?.city}, {lease.property?.state}{" "}
              {lease.property?.zipCode}
            </p>

            {lease.property?.amenities?.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {lease.property.amenities.map((a, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-gray-100 rounded-md text-xs"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Payment Rules */}
          {(lease.lateFee || lease.gracePeriod) && (
            <div className="bg-white border rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Payment Rules</h2>
              <div className="text-sm space-y-2">
                {lease.lateFee && (
                  <p>
                    <span className="font-medium">Late Fee:</span> $
                    {lease.lateFee}
                  </p>
                )}
                {lease.gracePeriod && (
                  <p>
                    <span className="font-medium">Grace Period:</span>{" "}
                    {lease.gracePeriod} days
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Utilities & Maintenance */}
          {(lease.utilities?.includedInRent?.length > 0 ||
            lease.utilities?.paidByTenant?.length > 0 ||
            lease.maintenanceTerms) && (
            <div className="bg-white border rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">
                Utilities & Maintenance
              </h2>

              {/* Included in Rent */}
              {lease.utilities?.includedInRent?.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Included in Rent</p>
                  <div className="flex flex-wrap gap-2">
                    {lease.utilities.includedInRent.map((utility, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                      >
                        {utility}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Paid by Tenant */}
              {lease.utilities?.paidByTenant?.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Paid by Tenant</p>
                  <div className="flex flex-wrap gap-2">
                    {lease.utilities.paidByTenant.map((utility, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        {utility}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Maintenance Terms */}
              {lease.maintenanceTerms && (
                <div>
                  <p className="text-sm font-medium mb-2">Maintenance</p>
                  <p className="text-sm text-gray-700">
                    {lease.maintenanceTerms}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {/* Landlord */}
          <div className="bg-white border rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Landlord</h2>
            <p className="font-medium">{lease.landlord?.name || "N/A"}</p>
            <p className="text-sm flex items-center gap-2 mt-2">
              <Mail size={14} /> {lease.landlord?.email || "—"}
            </p>
            <p className="text-sm flex items-center gap-2 mt-1">
              <Phone size={14} /> {lease.landlord?.phone || "—"}
            </p>
          </div>

          {/* Lease Terms */}
          {lease.description && (
            <div className="bg-white border rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-2">Lease Terms</h2>
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {lease.description}
              </p>
            </div>
          )}

          {/* Signatures */}
          <div className="bg-white border rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Signatures</h2>
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <p className="font-medium mb-1">Landlord</p>
                {lease.signatures?.landlord?.signedAt
                  ? `Signed on ${new Date(
                      lease.signatures.landlord.signedAt,
                    ).toLocaleDateString()}`
                  : "Pending signature"}
              </div>
              <div>
                <p className="font-medium mb-1">Tenant (You)</p>
                {lease.signatures?.tenant?.signedAt
                  ? `Signed on ${new Date(
                      lease.signatures.tenant.signedAt,
                    ).toLocaleDateString()}`
                  : "Pending signature"}
              </div>
            </div>
          </div>
          
          {/* Request Changes */}
          {lease.status === "sent_to_tenant" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h3 className="font-semibold mb-2">
                Need changes before signing?
              </h3>
              <button
                onClick={() => setShowChangeModal(true)}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg"
              >
                Request Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Change Modal */}
      {showChangeModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-3">Request Changes</h3>

            <textarea
              rows={4}
              value={changeText}
              onChange={(e) => setChangeText(e.target.value)}
              className="w-full border rounded-lg p-3 mb-4"
              placeholder="Describe the changes you want..."
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowChangeModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                disabled={!changeText.trim() || submitting}
                onClick={handleRequestChanges}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg disabled:opacity-50"
              >
                {submitting ? "Sending..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
