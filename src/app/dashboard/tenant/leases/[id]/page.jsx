"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  FileText,
  AlertCircle,
  Clock,
  Download,
  MessageCircle,
  XCircle,
  Eye,
  FileQuestion,
  Lock,
  ChevronRight,
  Send,
  Loader2
} from "lucide-react";
import { leaseService } from "@/services/lease.service";
import toast from "react-hot-toast";

export default function TenantLeaseViewPage() {
  const { id } = useParams();
  const router = useRouter();

  const [lease, setLease] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showChangeModal, setShowChangeModal] = useState(false);
  const [changeText, setChangeText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    fetchLease();
  }, [id]);

  const fetchLease = async () => {
    try {
      setLoading(true);
      const res = await leaseService.getLeaseById(id);
      if (res?.success) {
        console.log("Lease Data:", res.data);
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

  const handleSignLease = async () => {
    try {
      router.push(`/dashboard/tenant/leases/${lease._id}/sign`);
    } catch (err) {
      console.error("Error navigating to sign page:", err);
    }
  };

  const handleSendToOwnerForSignature = async () => {
    try {
      setSubmitting(true);

      await leaseService.sendToLandlordForSignature(
        lease._id,
        "I have reviewed the lease and it's ready for your signature. Please sign when convenient."
      );

      toast.success("Lease sent to landlord for signature successfully.");
      fetchLease();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send lease to landlord");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelRequest = async () => {
    if (confirm("Are you sure you want to cancel this rental request?")) {
      try {
        const res = await leaseService.cancelLease(lease._id, "Cancelled by tenant");
        if (res.success) {
          toast.success("Request cancelled successfully");
          fetchLease();
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to cancel request");
      }
    }
  };

  const handleDownloadPDF = async () => {
    try {
      // Implement PDF download logic
      console.log("Downloading PDF for lease:", lease._id);
      // Add your PDF download logic here
    } catch (err) {
      toast.error("Failed to download PDF");
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    try {
      // Implement send message logic
      console.log("Sending message to landlord:", messageText);
      setShowMessageModal(false);
      setMessageText("");
      alert("Message sent to landlord");
    } catch (err) {
      alert("Failed to send message");
    }
  };

  const getStatusConfig = (status) => {
    const config = {
      pending_request: {
        label: "Waiting for Landlord Approval",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        banner: {
          text: "Your rental request is pending landlord approval.",
          color: "bg-yellow-50 border-yellow-200",
          icon: <Clock className="h-5 w-5 text-yellow-600" />
        },
        allowedActions: ["view", "cancel"],
        disallowedActions: ["sign", "request_changes", "edit", "send_to_owner"]
      },
      draft: {
        label: "Draft",
        color: "bg-gray-100 text-gray-800 border-gray-200",
        banner: {
          text: "Lease is being prepared by landlord.",
          color: "bg-gray-50 border-gray-200",
          icon: <FileQuestion className="h-5 w-5 text-gray-600" />
        },
        allowedActions: ["view", "message"],
        disallowedActions: ["sign", "request_changes", "edit", "send_to_owner"]
      },
      sent_to_tenant: {
        label: "Action Required",
        color: "bg-blue-100 text-blue-800 border-blue-200",
        banner: {
          text: "Please review and take action on this lease.",
          color: "bg-blue-50 border-blue-200",
          icon: <AlertCircle className="h-5 w-5 text-blue-600" />
        },
        allowedActions: ["view", "request_changes", "message", "send_to_owner"],
        disallowedActions: ["edit", "cancel"]
      },
      changes_requested: {
        label: "Changes Requested",
        color: "bg-orange-100 text-orange-800 border-orange-200",
        banner: {
          text: "Changes sent to landlord. Waiting for update.",
          color: "bg-orange-50 border-orange-200",
          icon: <Clock className="h-5 w-5 text-orange-600" />
        },
        allowedActions: ["view", "message"],
        disallowedActions: ["sign", "request_changes", "edit", "send_to_owner"]
      },
      signed_by_landlord: {
        label: "Landlord Signed",
        color: "bg-purple-100 text-purple-800 border-purple-200",
        banner: {
          text: "Lease signed by landlord. Please sign to finalize.",
          color: "bg-purple-50 border-purple-200",
          icon: <CheckCircle className="h-5 w-5 text-purple-600" />
        },
        allowedActions: ["view", "sign", "download", "message"],
        disallowedActions: ["request_changes", "edit", "send_to_owner"]
      },
      signed_by_tenant: {
        label: "You Have Signed",
        color: "bg-green-100 text-green-800 border-green-200",
        banner: {
          text: "You have signed. Waiting for landlord's final signature.",
          color: "bg-green-50 border-green-200",
          icon: <CheckCircle className="h-5 w-5 text-green-600" />
        },
        allowedActions: ["view", "download"],
        disallowedActions: ["sign", "request_changes", "cancel", "send_to_owner"]
      },
      fully_executed: {
        label: "Active Lease",
        color: "bg-green-100 text-green-800 border-green-200",
        banner: {
          text: "Lease is fully executed and legally active.",
          color: "bg-green-50 border-green-200",
          icon: <CheckCircle className="h-5 w-5 text-green-600" />
        },
        allowedActions: ["view", "download"],
        disallowedActions: ["edit", "request_changes", "sign", "send_to_owner"]
      },
      cancelled: {
        label: "Cancelled",
        color: "bg-red-100 text-red-800 border-red-200",
        banner: {
          text: "Lease was cancelled.",
          color: "bg-red-50 border-red-200",
          icon: <XCircle className="h-5 w-5 text-red-600" />
        },
        allowedActions: ["view"],
        disallowedActions: ["sign", "request_changes", "edit", "message", "download", "send_to_owner"]
      },
      expired: {
        label: "Expired",
        color: "bg-gray-100 text-gray-800 border-gray-200",
        banner: {
          text: "Lease term has ended.",
          color: "bg-gray-50 border-gray-200",
          icon: <Clock className="h-5 w-5 text-gray-600" />
        },
        allowedActions: ["view", "download"],
        disallowedActions: ["edit", "sign", "request_changes", "send_to_owner"]
      }
    };

    return config[status] || {
      label: status,
      color: "bg-gray-100 text-gray-800 border-gray-200",
      banner: null,
      allowedActions: [],
      disallowedActions: ["sign", "request_changes", "edit", "send_to_owner"]
    };
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

  const isSignedByLandlord = lease.signatures?.landlord?.signedAt;
  const isSignedByTenant = lease.signatures?.tenant?.signedAt;
  const isFullySigned = isSignedByLandlord && isSignedByTenant;

  const statusConfig = getStatusConfig(lease.status);
  const canSign = statusConfig.allowedActions.includes("sign");
  const canRequestChanges = statusConfig.allowedActions.includes("request_changes");
  const canCancel = statusConfig.allowedActions.includes("cancel");
  const canMessage = statusConfig.allowedActions.includes("message");
  const canDownload = statusConfig.allowedActions.includes("download");
  const canSendToOwner = statusConfig.allowedActions.includes("send_to_owner");

  // Tenant can only sign when landlord has already signed
  const canTenantActuallySign = canSign && isSignedByLandlord && !isSignedByTenant;

  return (
    <div className="p-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 border px-3 py-2 rounded-md hover:bg-gray-50"
      >
        <ArrowLeft size={16} />
        Back to Leases
      </button>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-2">
            Lease Agreement: {lease.property?.title || "N/A"}
          </h1>
          <p className="text-gray-600 flex items-center gap-1">
            <MapPin size={16} />
            {lease.property?.address || "Address not available"}
          </p>
        </div>

        <div className={`px-4 py-2 rounded-full text-sm font-medium mt-4 md:mt-0 border ${statusConfig.color}`}>
          {statusConfig.label}
        </div>
      </div>

      {/* Status Banner */}
      {statusConfig.banner && (
        <div className={`mb-6 rounded-xl border p-4 ${statusConfig.banner.color} flex items-start gap-3`}>
          {statusConfig.banner.icon}
          <div>
            <p className="font-medium">{statusConfig.banner.text}</p>
            {lease.status === "pending_request" && (
              <p className="text-sm text-gray-600 mt-1">
                Requested on {new Date(lease.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ================= ACTION BUTTONS ================= */}
      <div className="mb-8">
        <div className="bg-white border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Lease Actions</h2>

          <div className="space-y-6">

            {/* ===============================
          CASE 1: Tenant can SIGN
          (Landlord already signed)
      =============================== */}
            {canTenantActuallySign && (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-800">
                        Ready for Your Signature
                      </p>
                      <p className="text-sm text-green-600">
                        The landlord has signed the lease. Please review and sign to finalize.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleSignLease}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={20} />
                    Sign Lease Agreement
                  </button>

                  {canRequestChanges && (
                    <button
                      onClick={() => setShowChangeModal(true)}
                      className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center justify-center gap-2"
                    >
                      <FileText size={20} />
                      Request Changes
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ===============================
          CASE 2: Waiting for landlord
      =============================== */}
            {canSendToOwner && !isSignedByLandlord && (
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-800">
                        Waiting for Landlord Signature
                      </p>
                      <p className="text-sm text-yellow-600">
                        The landlord must sign first before you can sign this lease.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">

                  {/* Send to Landlord */}
                  <button
                    onClick={handleSendToOwnerForSignature}
                    disabled={submitting}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {submitting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send size={20} />
                    )}
                    {submitting ? "Sending..." : "Send to Landlord for Signature"}
                  </button>

                  {/* Request Changes */}
                  {canRequestChanges && (
                    <button
                      onClick={() => setShowChangeModal(true)}
                      className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center justify-center gap-2"
                    >
                      <FileText size={20} />
                      Request Changes
                    </button>
                  )}

                  {/* Sign Locked */}
                  <button
                    disabled
                    className="px-6 py-3 bg-gray-200 text-gray-500 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed"
                  >
                    <Lock size={20} />
                    Sign Lease (Locked)
                  </button>

                </div>



              </div>
            )}

            {/* ===============================
          CASE 3: Pending Request
      =============================== */}
            {canCancel && lease.status === "pending_request" && (
              <button
                onClick={handleCancelRequest}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
              >
                <XCircle size={20} />
                Cancel Request
              </button>
            )}

            {/* ===============================
          SHARED ACTIONS (BOTTOM)
      =============================== */}
            <div className="pt-4 border-t flex flex-col sm:flex-row gap-3">
              {canMessage && (
                <button
                  onClick={() => setShowMessageModal(true)}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2"
                >
                  <MessageCircle size={20} />
                  Send Message
                </button>
              )}

              {canDownload && (
                <button
                  onClick={handleDownloadPDF}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  Download PDF
                </button>
              )}
            </div>

          </div>
        </div>
      </div>


      {/* Rest of the code remains the same */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN - Lease Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lease Info Card */}
          <div className="bg-white border rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Lease Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Monthly Rent</p>
                <p className="text-xl font-semibold">
                  ${lease.rentAmount?.toLocaleString() ?? "0"}
                </p>
                <p className="text-sm text-gray-600">
                  {lease.rentFrequency === "monthly" ? "per month" : lease.rentFrequency}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Security Deposit</p>
                <p className="text-xl font-semibold">
                  ${lease.securityDeposit?.toLocaleString() ?? "0"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Lease Duration</p>
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-gray-400" />
                  <div>
                    <p className="font-medium">
                      {lease.startDate
                        ? new Date(lease.startDate).toLocaleDateString()
                        : "—"}
                    </p>
                    <p className="text-sm text-gray-600">to</p>
                    <p className="font-medium">
                      {lease.endDate
                        ? new Date(lease.endDate).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>

              {lease.lateFee && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Late Fee</p>
                  <p className="font-medium">${lease.lateFee}</p>
                  <p className="text-sm text-gray-600">After {lease.gracePeriod || 5} days grace period</p>
                </div>
              )}

              {lease.terms?.noticeDays && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Notice Period</p>
                  <p className="font-medium">{lease.terms.noticeDays} days</p>
                </div>
              )}

              {lease.terms?.leaseType && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Lease Type</p>
                  <p className="font-medium capitalize">
                    {lease.terms.leaseType.replace(/_/g, " ")}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Property Details Card */}
          <div className="bg-white border rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Property Details</h2>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-lg">{lease.property?.title}</p>
                <p className="text-gray-600">{lease.property?.address}</p>
                <p className="text-gray-600">
                  {lease.property?.city}, {lease.property?.state} {lease.property?.zipCode}
                </p>
              </div>

              {lease.property?.amenities?.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Amenities</p>
                  <div className="flex flex-wrap gap-2">
                    {lease.property.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Utilities & Maintenance Card */}
          {(lease.utilities?.includedInRent?.length > 0 ||
            lease.utilities?.paidByTenant?.length > 0 ||
            lease.maintenanceTerms) && (
              <div className="bg-white border rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-4">Utilities & Maintenance</h2>

                {/* Included in Rent */}
                {lease.utilities?.includedInRent?.length > 0 && (
                  <div className="mb-6">
                    <p className="font-medium mb-3">✅ Included in Rent</p>
                    <div className="flex flex-wrap gap-2">
                      {lease.utilities.includedInRent.map((utility, index) => (
                        <span
                          key={index}
                          className="px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm border border-green-200"
                        >
                          {utility.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Paid by Tenant */}
                {lease.utilities?.paidByTenant?.length > 0 && (
                  <div className="mb-6">
                    <p className="font-medium mb-3">💰 Paid by Tenant</p>
                    <div className="flex flex-wrap gap-2">
                      {lease.utilities.paidByTenant.map((utility, index) => (
                        <span
                          key={index}
                          className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-200"
                        >
                          {utility.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Maintenance Terms */}
                {lease.maintenanceTerms && (
                  <div>
                    <p className="font-medium mb-2">🔧 Maintenance Terms</p>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-line">
                        {lease.maintenanceTerms}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

          {/* Additional Terms */}
          {lease.description && (
            <div className="bg-white border rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Additional Terms & Conditions</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-line">
                  {lease.description}
                </p>
              </div>
            </div>
          )}

          {/* Requested Changes (if any) */}
          {lease.requestedChanges?.length > 0 && (
            <div className="bg-white border rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Requested Changes</h2>
              <div className="space-y-4">
                {lease.requestedChanges.map((request, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${request.resolved
                      ? "bg-green-50 border-green-200"
                      : "bg-yellow-50 border-yellow-200"
                      }`}
                  >
                    <p className="text-sm whitespace-pre-line">{request.changes}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">
                        {new Date(request.requestedAt).toLocaleDateString()}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${request.resolved
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                        }`}>
                        {request.resolved ? "Resolved" : "Pending"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cancellation Reason */}
          {lease.status === "cancelled" && lease.messages?.find(m => m.message.includes("cancelled")) && (
            <div className="bg-white border rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Cancellation Details</h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">
                  {lease.messages.find(m => m.message.includes("cancelled"))?.message || "Lease was cancelled"}
                </p>
                <p className="text-sm text-red-600 mt-2">
                  Cancelled on: {lease.updatedAt ? new Date(lease.updatedAt).toLocaleDateString() : "Unknown date"}
                </p>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN - Sidebar */}
        <div className="space-y-6">
          {/* Landlord Information */}
          <div className="bg-white border rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Landlord Information</h2>
            <div className="space-y-3">
              <div>
                <p className="font-medium">{lease.landlord?.name || "N/A"}</p>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                  <Mail size={16} />
                  {lease.landlord?.email || "—"}
                </div>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                  <Phone size={16} />
                  {lease.landlord?.phone || "—"}
                </div>
              </div>

              {/* Landlord Signature Status */}
              <div className="mt-4 pt-4 border-t">
                <p className="font-medium mb-2">Landlord Signature</p>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${isSignedByLandlord
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
                  }`}>
                  <div className={`h-2 w-2 rounded-full ${isSignedByLandlord ? "bg-green-500" : "bg-yellow-400"
                    }`} />
                  {isSignedByLandlord
                    ? `Signed on ${new Date(lease.signatures.landlord.signedAt).toLocaleDateString()}`
                    : "Awaiting signature"
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Tenant Signature Status */}
          <div className="bg-white border rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Your Signature</h2>
            <div className="space-y-4">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${isSignedByTenant
                ? "bg-green-100 text-green-800"
                : !canTenantActuallySign
                  ? "bg-gray-100 text-gray-500"
                  : "bg-blue-100 text-blue-800"
                }`}>
                <div className={`h-2 w-2 rounded-full ${isSignedByTenant
                  ? "bg-green-500"
                  : !canTenantActuallySign
                    ? "bg-gray-400"
                    : "bg-blue-400"
                  }`} />
                {isSignedByTenant
                  ? `Signed on ${new Date(lease.signatures.tenant.signedAt).toLocaleDateString()}`
                  : !canTenantActuallySign
                    ? "Waiting for landlord signature"
                    : "Ready to sign"
                }
              </div>

              {/* Quick Sign Button */}
              {canTenantActuallySign && (
                <button
                  onClick={handleSignLease}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center justify-center gap-2"
                >
                  <CheckCircle size={16} />
                  Sign Now
                </button>
              )}
            </div>
          </div>

          {/* Lease Timeline */}
          <div className="bg-white border rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Lease Timeline</h2>
            <div className="space-y-3 text-sm">
              {lease.statusHistory?.map((history, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`h-2 w-2 rounded-full mt-2 ${history.status === "pending_request"
                    ? "bg-yellow-500"
                    : history.status === "draft"
                      ? "bg-gray-500"
                      : history.status === "sent_to_tenant"
                        ? "bg-blue-500"
                        : history.status === "changes_requested"
                          ? "bg-orange-500"
                          : history.status === "signed_by_landlord"
                            ? "bg-purple-500"
                            : history.status === "signed_by_tenant"
                              ? "bg-green-500"
                              : history.status === "fully_executed"
                                ? "bg-green-600"
                                : history.status === "cancelled"
                                  ? "bg-red-500"
                                  : history.status === "expired"
                                    ? "bg-gray-400"
                                    : "bg-gray-300"
                    }`} />
                  <div>
                    <p className="font-medium capitalize">
                      {history.status.replace(/_/g, " ")}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {new Date(history.changedAt).toLocaleDateString()}
                      {history.reason && ` • ${history.reason}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white border rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
            <div className="space-y-2">
              <button
                onClick={() => router.push(`/dashboard/tenant/properties/${lease.property?._id}`)}
                className="w-full text-left p-3 hover:bg-gray-50 rounded-lg flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Eye size={16} />
                  View Property Details
                </span>
                <ChevronRight size={16} className="text-gray-400" />
              </button>

              <button
                onClick={handleDownloadPDF}
                className="w-full text-left p-3 hover:bg-gray-50 rounded-lg flex items-center justify-between"
                disabled={!canDownload}
              >
                <span className="flex items-center gap-2">
                  <Download size={16} />
                  Download Lease Document
                </span>
                <ChevronRight size={16} className="text-gray-400" />
              </button>

              <button
                onClick={() => setShowMessageModal(true)}
                className="w-full text-left p-3 hover:bg-gray-50 rounded-lg flex items-center justify-between"
                disabled={!canMessage}
              >
                <span className="flex items-center gap-2">
                  <MessageCircle size={16} />
                  Contact Landlord
                </span>
                <ChevronRight size={16} className="text-gray-400" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Request Changes Modal */}
      {showChangeModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-3">Request Changes</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please describe the changes you would like the landlord to make to the lease agreement.
            </p>

            <textarea
              rows={5}
              value={changeText}
              onChange={(e) => setChangeText(e.target.value)}
              className="w-full border rounded-lg p-3 mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Example: Please update the rent amount from $1500 to $1450. Also, I would like to add a pet clause..."
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowChangeModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                disabled={!changeText.trim() || submitting}
                onClick={handleRequestChanges}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Submit Request"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-3">Message Landlord</h3>
            <p className="text-sm text-gray-600 mb-4">
              Send a message to {lease.landlord?.name || "the landlord"}
            </p>

            <textarea
              rows={4}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="w-full border rounded-lg p-3 mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Type your message here..."
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowMessageModal(false);
                  setMessageText("");
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                disabled={!messageText.trim()}
                onClick={handleSendMessage}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}