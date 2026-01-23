// frontend/src/app/dashboard/owner/leases/[id]/page.js
"use client";

import LeaseStatusBadge, { LeaseStatusTimeline } from "@/components/dashboard/Owner/leases/LeaseStatusBadge";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Download,
  Send,
  Edit,
  Mail,
  FileText,
  Calendar,
  DollarSign,
  Home,
  User,
  ArrowLeft,
  CheckCircle,
  Clock,
  Loader2,
  AlertCircle,
  Lock,
  MessageCircle,
  FileQuestion,
  Eye,
  Check,
  XCircle,
  PenSquare
} from "lucide-react";
import { leaseService } from "@/services/lease.service";
import SignatureView from "@/components/dashboard/Owner/leases/LeaseForm/SignatureView";

export default function LeaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [lease, setLease] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const showSign = searchParams.get("sign") === "true";
  const [sendingToTenant, setSendingToTenant] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    fetchLease();
  }, [params.id]);

  const fetchLease = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching lease details for ID:', params.id);

      const response = await leaseService.getLeaseById(params.id);

      console.log('Lease details response:', {
        success: response.success,
        data: response.data
      });

      if (response.success) {
        setLease(response.data);
      } else {
        setError(response.message || 'Failed to fetch lease');
      }
    } catch (err) {
      console.error('Error fetching lease:', err);
      setError(err.message || 'Failed to fetch lease details');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    console.log('Downloading PDF for lease:', params.id);
    // Implement PDF download logic
  };

  const handleSendToTenant = async () => {
    try {
      setSendingToTenant(true);
      const response = await leaseService.sendToTenant(
        params.id, 
        "Please review and sign the lease agreement."
      );
      if (response.success) {
        alert('Lease sent to tenant successfully!');
        fetchLease(); // Refresh lease data
      }
    } catch (error) {
      console.error('Error sending lease:', error);
      alert(error.response?.data?.message || 'Failed to send lease');
    } finally {
      setSendingToTenant(false);
    }
  };

  const handleApproveRequest = async () => {
    try {
      const response = await leaseService.approveRequest(params.id);
      if (response.success) {
        alert('Request approved! Lease draft created.');
        fetchLease();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to approve request');
    }
  };

  const handleCancelLease = async () => {
    const reason = prompt("Please provide a reason for cancellation:");
    if (reason) {
      try {
        const response = await leaseService.cancelLease(params.id, reason);
        if (response.success) {
          alert('Lease cancelled successfully.');
          fetchLease();
        }
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to cancel lease');
      }
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    
    try {
      // Implement message sending logic
      console.log("Sending message to tenant:", messageText);
      setShowMessageModal(false);
      setMessageText("");
      alert("Message sent to tenant");
    } catch (err) {
      alert("Failed to send message");
    }
  };

  const handleBack = () => {
    router.push('/dashboard/owner/leases');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const getStatusConfig = (status) => {
    const config = {
      pending_request: {
        banner: {
          text: "New Request - Tenant has requested to rent this property",
          color: "bg-yellow-50 border-yellow-200",
          icon: <AlertCircle className="h-5 w-5 text-yellow-600" />
        },
        allowedActions: ["approve", "cancel", "message"],
        disallowedActions: ["sign", "send"]
      },
      draft: {
        banner: {
          text: "Draft – not sent to tenant",
          color: "bg-gray-50 border-gray-200",
          icon: <FileQuestion className="h-5 w-5 text-gray-600" />
        },
        allowedActions: ["edit", "save", "send", "sign", "message"],
        disallowedActions: ["finalize"]
      },
      sent_to_tenant: {
        banner: {
          text: "Waiting for tenant response",
          color: "bg-blue-50 border-blue-200",
          icon: <Clock className="h-5 w-5 text-blue-600" />
        },
        allowedActions: ["view", "message", "wait"],
        disallowedActions: ["edit", "sign", "cancel"]
      },
      sent_to_landlord: {  // ✅ নতুন status যোগ করেছি
        banner: {
          text: "Action Required: Tenant has reviewed and sent the lease for your signature",
          color: "bg-blue-50 border-blue-200",
          icon: <AlertCircle className="h-5 w-5 text-blue-600" />
        },
        allowedActions: ["sign", "view", "message"],
        disallowedActions: ["edit", "request_changes"]
      },
      changes_requested: {
        banner: {
          text: "Tenant requested changes",
          color: "bg-orange-50 border-orange-200",
          icon: <AlertCircle className="h-5 w-5 text-orange-600" />
        },
        allowedActions: ["edit", "save", "resend", "message"],
        disallowedActions: ["sign", "ignore"]
      },
      signed_by_landlord: {
        banner: {
          text: "Signed by you – waiting for tenant",
          color: "bg-purple-50 border-purple-200",
          icon: <CheckCircle className="h-5 w-5 text-purple-600" />
        },
        allowedActions: ["view", "download", "message"],
        disallowedActions: ["edit", "sign"]
      },
      signed_by_tenant: {
        banner: {
          text: "Tenant has signed - Action Required",
          color: "bg-green-50 border-green-200",
          icon: <AlertCircle className="h-5 w-5 text-green-600" />
        },
        allowedActions: ["sign", "view", "message"],
        disallowedActions: ["edit", "request_changes"]
      },
      fully_executed: {
        banner: {
          text: "Active Lease - Fully executed and legally active",
          color: "bg-green-50 border-green-200",
          icon: <CheckCircle className="h-5 w-5 text-green-600" />
        },
        allowedActions: ["view", "download"],
        disallowedActions: ["edit", "sign", "request_changes"]
      },
      cancelled: {
        banner: {
          text: "Lease cancelled",
          color: "bg-red-50 border-red-200",
          icon: <XCircle className="h-5 w-5 text-red-600" />
        },
        allowedActions: ["view"],
        disallowedActions: ["edit", "sign", "message", "download"]
      },
      expired: {
        banner: {
          text: "Lease term has ended",
          color: "bg-gray-50 border-gray-200",
          icon: <Clock className="h-5 w-5 text-gray-600" />
        },
        allowedActions: ["view", "download"],
        disallowedActions: ["edit", "sign", "request_changes"]
      }
    };

    return config[status] || {
      banner: null,
      allowedActions: [],
      disallowedActions: []
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-[#1F3A34]" />
          <p className="text-gray-600">Loading lease details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-600 text-sm">!</span>
            </div>
            <h3 className="text-lg font-semibold text-red-800">Error Loading Lease</h3>
          </div>

          <p className="text-red-600 mb-4">{error}</p>

          <div className="flex gap-3">
            <button
              onClick={fetchLease}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
            <button
              onClick={handleBack}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to Leases
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!lease) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-[#004087]">Lease Not Found</h1>
        <p className="text-gray-600 mt-2">The requested lease does not exist.</p>
        <button
          onClick={handleBack}
          className="mt-4 px-4 py-2 bg-[#004087] text-white rounded-lg"
        >
          Back to Leases
        </button>
      </div>
    );
  }

  const isSignedByLandlord = lease.signatures?.landlord?.signedAt;
  const isSignedByTenant = lease.signatures?.tenant?.signedAt;
  const isFullySigned = isSignedByLandlord && isSignedByTenant;

  const statusConfig = getStatusConfig(lease.status);
  const canEdit = statusConfig.allowedActions.includes("edit");
  const canSend = statusConfig.allowedActions.includes("send") || statusConfig.allowedActions.includes("resend");
  const canSign = statusConfig.allowedActions.includes("sign");
  const canApprove = statusConfig.allowedActions.includes("approve");
  const canMessage = statusConfig.allowedActions.includes("message");
  const canDownload = statusConfig.allowedActions.includes("download");
  const canCancel = statusConfig.allowedActions.includes("cancel");

  // Check if lease is valid for sending
  const isLeaseValidForSending = () => {
    return lease.startDate && lease.endDate && lease.rentAmount && lease.rentAmount > 0;
  };

  return (
    <div className="p-6">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="mb-6 flex items-center gap-2 border border-gray-300 p-2 rounded-md text-[#1F3A34] hover:text-[#2a4d45]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to All Leases
      </button>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#004087]">{lease.property?.title || 'Lease Agreement'}</h1>
          <p className="text-gray-600">{lease.property?.address || 'Address not available'}</p>
        </div>

        <div className="flex gap-2 mt-4 md:mt-0">
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-50"
            disabled={!canDownload}
          >
            <Download className="h-4 w-4" />
            Download PDF
          </button>

          {canMessage && (
            <button
              onClick={() => setShowMessageModal(true)}
              className="px-4 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-50"
            >
              <MessageCircle className="h-4 w-4" />
              Message
            </button>
          )}
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
            {lease.status === "sent_to_landlord" && (
              <p className="text-sm text-gray-600 mt-1">
                Tenant sent for your signature on {new Date(lease.updatedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Status Badge */}
      <div className="mb-8">
        <LeaseStatusBadge status={lease.status} size="lg" />
        {isFullySigned && (
          <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span>Fully signed</span>
          </div>
        )}
      </div>

      {/* ================= ACTION BUTTONS ================= */}
      <div className="mb-8">
        <div className="bg-white border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Lease Actions</h2>
          
          <div className="flex flex-wrap gap-3">
            {/* Approve Request Button */}
            {canApprove && (
              <button
                onClick={handleApproveRequest}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Check className="h-5 w-5" />
                Approve Request
              </button>
            )}

            {/* Edit Lease Button */}
            {canEdit && (
              <button
                onClick={() => router.push(`/dashboard/owner/leases/${params.id}/edit`)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Edit className="h-5 w-5" />
                Edit Lease
              </button>
            )}

            {/* Sign Lease Button (Owner signs in draft) */}
            {canSign && lease.status === "draft" && !isSignedByLandlord && (
              <button
                onClick={() => router.push(`/dashboard/owner/leases/${lease._id}?sign=true`)}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
              >
                <CheckCircle className="h-5 w-5" />
                Sign Lease
              </button>
            )}

            {/* Sign Lease Button (Owner signs after tenant sends for signature) */}
            {canSign && lease.status === "sent_to_landlord" && !isSignedByLandlord && (
              <button
                onClick={() => router.push(`/dashboard/owner/leases/${lease._id}?sign=true`)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <PenSquare className="h-5 w-5" />
                Sign Lease (Tenant Requested)
              </button>
            )}

            {/* Sign Lease Button (Owner signs after tenant signed) */}
            {canSign && lease.status === "signed_by_tenant" && !isSignedByLandlord && (
              <button
                onClick={() => router.push(`/dashboard/owner/leases/${lease._id}?sign=true`)}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <CheckCircle className="h-5 w-5" />
                Sign to Finalize
              </button>
            )}

            {/* Send to Tenant Button */}
            {canSend && isLeaseValidForSending() && (
              <button
                onClick={handleSendToTenant}
                disabled={sendingToTenant}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                {sendingToTenant ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
                {lease.status === "changes_requested" ? "Re-send to Tenant" : "Send to Tenant"}
              </button>
            )}

            {/* Cancel Lease Button */}
            {canCancel && (
              <button
                onClick={handleCancelLease}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                <XCircle className="h-5 w-5" />
                Cancel Request
              </button>
            )}

            {/* View Only Mode */}
            {!canEdit && !canSend && !canSign && !canApprove && !canCancel && (
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-gray-700 flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Lease is read-only in current status
                </p>
              </div>
            )}

            {/* Validation Warning */}
            {canSend && !isLeaseValidForSending() && (
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <p className="text-yellow-800 font-medium">Cannot send lease</p>
                <ul className="text-sm text-yellow-700 mt-2 list-disc pl-4">
                  {!lease.startDate && <li>Start date is required</li>}
                  {!lease.endDate && <li>End date is required</li>}
                  {(!lease.rentAmount || lease.rentAmount <= 0) && <li>Valid rent amount is required</li>}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Lease Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Information */}
          <div className={`bg-white rounded-xl shadow-sm border p-6 ${!canEdit ? 'opacity-95' : ''}`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-[#1F3A34]">Lease Details</h2>
              {!canEdit && (
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Lock size={14} />
                  Read-only
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500">Property</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Home className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{lease.property?.title || 'N/A'}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{lease.property?.address || 'Address not available'}</p>
                </div>

                <div>
                  <label className="block text-sm text-gray-500">Tenant</label>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{lease.tenant?.name || 'N/A'}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{lease.tenant?.email || 'Email not available'}</p>
                  <p className="text-sm text-gray-600">{lease.tenant?.phone || ''}</p>
                </div>

                <div>
                  <label className="block text-sm text-gray-500">Landlord</label>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{lease.landlord?.name || 'N/A'}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{lease.landlord?.email || 'Email not available'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500">Lease Term</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">
                      {lease.startDate ? new Date(lease.startDate).toLocaleDateString() : 'Not set'} to {' '}
                      {lease.endDate ? new Date(lease.endDate).toLocaleDateString() : 'Not set'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-sm">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">
                      {lease.rentFrequency === 'monthly' ? 'Monthly Lease' : 'Other'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-500">Monthly Rent</label>
                  <div className="flex items-center gap-2 mt-1">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{formatCurrency(lease.rentAmount)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Payment frequency: {lease.rentFrequency}</p>
                </div>

                <div>
                  <label className="block text-sm text-gray-500">Security Deposit</label>
                  <div className="flex items-center gap-2 mt-1">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{formatCurrency(lease.securityDeposit)}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-500">Signatures</label>
                  <div className="space-y-2 mt-1">
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${isSignedByLandlord ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className="text-sm">Landlord: {isSignedByLandlord ? 'Signed' : 'Pending'}</span>
                      {isSignedByLandlord && (
                        <span className="text-xs text-gray-500">
                          on {new Date(lease.signatures.landlord.signedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${isSignedByTenant ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className="text-sm">Tenant: {isSignedByTenant ? 'Signed' : 'Pending'}</span>
                      {isSignedByTenant && (
                        <span className="text-xs text-gray-500">
                          on {new Date(lease.signatures.tenant.signedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {lease.description && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-[#1F3A34] mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{lease.description}</p>
            </div>
          )}

          {/* Tenant Change Requests */}
          {lease.requestedChanges?.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Change Requests from Tenant
              </h3>

              <div className="space-y-4">
                {lease.requestedChanges.map((req, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-4 ${req.resolved ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium">Change Request #{index + 1}</p>
                      <span className={`text-xs px-2 py-1 rounded ${req.resolved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {req.resolved ? 'Resolved' : 'Pending'}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-800 whitespace-pre-line mb-3">
                      {req.changes}
                    </p>

                    <div className="text-xs text-gray-500">
                      Requested on: {new Date(req.requestedAt).toLocaleDateString()}
                    </div>

                    {!req.resolved && canEdit && (
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => router.push(`/dashboard/owner/leases/${lease._id}/edit`)}
                          className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Edit Lease to Resolve
                        </button>
                      </div>
                    )}

                    {req.resolved && (
                      <div className="text-xs text-green-600 mt-3 flex items-center gap-1">
                        <CheckCircle size={12} />
                        <span>Resolved on {new Date(req.resolvedAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cancellation Details */}
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

        {/* Right Column - Status Timeline & Actions */}
        <div className="space-y-8">
          {/* Status Timeline */}
          <LeaseStatusTimeline lease={lease} />

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => router.push(`/dashboard/owner/leases/${params.id}`)}
                className="w-full text-left p-3 hover:bg-gray-50 rounded-lg flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                View Full Details
              </button>
              
              {canDownload && (
                <button
                  onClick={handleDownloadPDF}
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-lg flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </button>
              )}
              
              {canMessage && (
                <button
                  onClick={() => setShowMessageModal(true)}
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-lg flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  Message Tenant
                </button>
              )}
              
              {canSign && !isSignedByLandlord && (
                <button
                  onClick={() => router.push(`/dashboard/owner/leases/${lease._id}?sign=true`)}
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-lg flex items-center gap-2"
                >
                  <PenSquare className="h-4 w-4" />
                  Sign Lease Now
                </button>
              )}
              
              <button
                onClick={() => router.push(`/dashboard/owner/properties/${lease.property?._id}`)}
                className="w-full text-left p-3 hover:bg-gray-50 rounded-lg flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                View Property
              </button>
            </div>
          </div>

          {/* Lease Info */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-medium text-gray-900 mb-4">Lease Info</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Lease ID</span>
                <span className="font-mono">{lease._id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Created</span>
                <span>{lease.createdAt ? new Date(lease.createdAt).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Updated</span>
                <span>{lease.updatedAt ? new Date(lease.updatedAt).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <LeaseStatusBadge status={lease.status} size="sm" />
              </div>
              {lease.expiresAt && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Expires</span>
                  <span>{new Date(lease.expiresAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Signature Section */}
          {showSign && canSign && (
            <div className="mt-8 bg-white border rounded-xl p-6">
              <h3 className="font-medium text-gray-900 mb-4">Sign Lease</h3>
              <SignatureView
                data={{
                  propertyAddress: lease.property?.address,
                  monthlyRent: lease.rentAmount,
                  startDate: lease.startDate,
                  endDate: lease.endDate,
                  securityDeposit: lease.securityDeposit,
                }}
                onSign={async ({ signatureDataUrl, signatureMode, typedSignature }) => {
                  try {
                    await leaseService.signLease(lease._id, {
                      signatureDataUrl,
                      signatureMode,
                      typedSignature,
                    });

                    alert("Lease signed successfully");
                    router.replace(`/dashboard/owner/leases/${lease._id}`);
                    fetchLease();
                  } catch (err) {
                    alert(err.response?.data?.message || "Failed to sign lease");
                  }
                }}
                loading={false}
              />
            </div>
          )}
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-3">Message Tenant</h3>
            <p className="text-sm text-gray-600 mb-4">
              Send a message to {lease.tenant?.name || "the tenant"}
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