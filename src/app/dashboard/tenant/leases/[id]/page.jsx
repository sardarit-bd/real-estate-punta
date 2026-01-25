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
  Loader2,
  Home,
  Car,
  Snowflake,
  Wifi,
  Utensils,
  Tv,
  Trash2,
  Flame,
  Waves,
  Dumbbell,
  Coffee,
  TreePine,
  Cloud,
  Shield,
  Sparkles,
  Bell,
  PawPrint,
  Droplets,
  Thermometer,
  Zap,
  Bath,
  Bed,
  Ruler,
  Users,
  Sun,
  Building,
  Key,
  PenTool,
  FileCheck,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  History,
  MessageSquare,
  Edit,
  ShieldCheck,
  User
} from "lucide-react";
import { leaseService } from "@/services/lease.service";
import toast from "react-hot-toast";
import LeaseStatusTimeline from "@/components/dashboard/Tenant/LeaseStatusTimeline";
import axios from "axios";
// import LeaseStatusTimeline from "@/components/dashboard/Owner/leases/LeaseStatusTimeline";

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
  const [expandedSections, setExpandedSections] = useState({
    details: true,
    amenities: false,
    utilities: false,
    timeline: false,
    messages: false
  });

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
        toast.success("Change request sent to landlord");
        setShowChangeModal(false);
        setChangeText("");
        fetchLease();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to request changes");
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

  const handleLeasePayment = async (id) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment/lease-checkout`,
        { leaseId: id },
        {
          withCredentials: true
        }
      );

      console.log('Received response for featured status toggle:', res?.data?.data);
      if(res?.data?.data?.url){
        window.location.href = res.data.data.url;
      }
    } catch (error) {
      console.error('Failed to toggle featured status', error);
      alert('Failed to update featured status');
      return;
    }
  }

  const handleReviewLease = async () => {
    try {
      router.push(`/dashboard/tenant/leases/${lease._id}/review`);
    } catch (err) {
      console.error("Error navigating to review page:", err);
    }
  };

  const handleSendToLandlordForSignature = async () => {
    try {
      setSubmitting(true);
      
      const res = await leaseService.sendToLandlordForSignature(
        lease._id,
        "I have reviewed the lease and it's ready for your signature. Please sign when convenient."
      );

      if (res.success) {
        toast.success("Lease sent to landlord for signature successfully.");
        fetchLease();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send lease to landlord");
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproveAndSend = async () => {
    try {
      setSubmitting(true);
      
      const res = await leaseService.tenantReviewLease(
        lease._id,
        "approve",
        "",
        "I approve this lease agreement. Please sign to proceed."
      );

      if (res.success) {
        toast.success("Lease approved and sent to landlord for signature");
        fetchLease();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to approve lease");
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
      toast.success("PDF download will be available soon");
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
      toast.success("Message sent to landlord");
    } catch (err) {
      toast.error("Failed to send message");
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getStatusConfig = (status) => {
    const config = {
      pending_request: {
        label: "Pending Approval",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: <Clock className="h-5 w-5 text-yellow-600" />,
        description: "Your application is pending landlord review",
        actions: {
          primary: null,
          secondary: "cancel",
          options: ["message"]
        }
      },
      under_review: {
        label: "Under Review",
        color: "bg-orange-100 text-orange-800 border-orange-200",
        icon: <FileQuestion className="h-5 w-5 text-orange-600" />,
        description: "Landlord is reviewing your application",
        actions: {
          primary: null,
          secondary: null,
          options: ["message"]
        }
      },
      approved: {
        label: "Approved",
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: <CheckCircle className="h-5 w-5 text-blue-600" />,
        description: "Application approved! Lease draft coming soon",
        actions: {
          primary: null,
          secondary: null,
          options: ["message"]
        }
      },
      draft: {
        label: "Draft",
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: <FileText className="h-5 w-5 text-gray-600" />,
        description: "Landlord is preparing the lease agreement",
        actions: {
          primary: null,
          secondary: null,
          options: ["message"]
        }
      },
      sent_to_tenant: {
        label: "Action Required",
        color: "bg-purple-100 text-purple-800 border-purple-200",
        icon: <AlertCircle className="h-5 w-5 text-purple-600" />,
        description: "Please review and sign the lease agreement",
        actions: {
          primary: "review",
          secondary: "request_changes",
          options: ["message"]
        }
      },
      changes_requested: {
        label: "Changes Requested",
        color: "bg-orange-100 text-orange-800 border-orange-200",
        icon: <Edit className="h-5 w-5 text-orange-600" />,
        description: "Changes sent to landlord. Waiting for update",
        actions: {
          primary: null,
          secondary: null,
          options: ["message"]
        }
      },
      sent_to_landlord: {
        label: "With Landlord",
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: <Send className="h-5 w-5 text-blue-600" />,
        description: "Waiting for landlord signature",
        actions: {
          primary: null,
          secondary: null,
          options: ["message"]
        }
      },
      signed_by_landlord: {
        label: "Ready to Sign",
        color: "bg-indigo-100 text-indigo-800 border-indigo-200",
        icon: <PenTool className="h-5 w-5 text-indigo-600" />,
        description: "Landlord signed. Please sign to finalize",
        actions: {
          primary: "sign",
          secondary: "request_changes",
          options: ["message", "download"]
        }
      },
      signed_by_tenant: {
        label: "You Signed",
        color: "bg-green-100 text-green-800 border-green-200",
        icon: <CheckCircle className="h-5 w-5 text-green-600" />,
        description: "Waiting for landlord's final signature",
        actions: {
          primary: null,
          secondary: null,
          options: ["download", "message"]
        }
      },
      fully_executed: {
        label: "Fully Executed",
        color: "bg-green-100 text-green-800 border-green-200",
        icon: <FileCheck className="h-5 w-5 text-green-600" />,
        description: "Lease is fully executed and legally active",
        actions: {
          primary: "view_active",
          secondary: "download",
          options: ["message"]
        }
      },
      active: {
        label: "Active",
        color: "bg-green-100 text-green-800 border-green-200",
        icon: <ShieldCheck className="h-5 w-5 text-green-600" />,
        description: "Lease is active and ongoing",
        actions: {
          primary: "manage",
          secondary: "download",
          options: ["message"]
        }
      },
      cancelled: {
        label: "Cancelled",
        color: "bg-red-100 text-red-800 border-red-200",
        icon: <XCircle className="h-5 w-5 text-red-600" />,
        description: "Lease was cancelled",
        actions: {
          primary: null,
          secondary: null,
          options: []
        }
      },
      expired: {
        label: "Expired",
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: <Clock className="h-5 w-5 text-gray-600" />,
        description: "Lease term has ended",
        actions: {
          primary: null,
          secondary: "download",
          options: []
        }
      },
      rejected: {
        label: "Rejected",
        color: "bg-red-100 text-red-800 border-red-200",
        icon: <XCircle className="h-5 w-5 text-red-600" />,
        description: "Application was rejected",
        actions: {
          primary: null,
          secondary: null,
          options: []
        }
      }
    };

    return config[status] || {
      label: status,
      color: "bg-gray-100 text-gray-800 border-gray-200",
      icon: <FileQuestion className="h-5 w-5 text-gray-600" />,
      description: "Status unknown",
      actions: { primary: null, secondary: null, options: [] }
    };
  };

  // Helper functions for utilities and amenities
  const getUtilityIcon = (utility) => {
    const iconMap = {
      electricity: <Zap className="h-5 w-5 text-yellow-600" />,
      water: <Droplets className="h-5 w-5 text-blue-600" />,
      gas: <Flame className="h-5 w-5 text-orange-600" />,
      heating: <Thermometer className="h-5 w-5 text-red-600" />,
      cooling: <Snowflake className="h-5 w-5 text-cyan-600" />,
      internet: <Wifi className="h-5 w-5 text-purple-600" />,
      cable_tv: <Tv className="h-5 w-5 text-indigo-600" />,
      trash: <Trash2 className="h-5 w-5 text-gray-600" />,
      sewage: <Waves className="h-5 w-5 text-teal-600" />,
    };
    
    return iconMap[utility] || <CheckCircle className="h-5 w-5 text-green-600" />;
  };

  const getAmenityIcon = (amenity) => {
    const amenityLower = amenity.toLowerCase();
    const iconMap = {
      parking: <Car className="h-5 w-5 text-blue-600" />,
      garage: <Car className="h-5 w-5 text-blue-700" />,
      'swimming pool': <Waves className="h-5 w-5 text-cyan-600" />,
      gym: <Dumbbell className="h-5 w-5 text-red-600" />,
      'fitness center': <Dumbbell className="h-5 w-5 text-red-500" />,
      laundry: <Waves className="h-5 w-5 text-purple-600" />,
      dishwasher: <Utensils className="h-5 w-5 text-green-600" />,
      'air conditioning': <Snowflake className="h-5 w-5 text-cyan-600" />,
      heating: <Thermometer className="h-5 w-5 text-orange-600" />,
      balcony: <TreePine className="h-5 w-5 text-emerald-600" />,
      garden: <TreePine className="h-5 w-5 text-green-600" />,
      terrace: <Sun className="h-5 w-5 text-amber-600" />,
      security: <Shield className="h-5 w-5 text-gray-700" />,
      elevator: <ChevronUp className="h-5 w-5 text-gray-600" />,
      furnished: <Home className="h-5 w-5 text-amber-600" />,
      wifi: <Wifi className="h-5 w-5 text-purple-600" />,
      'cable tv': <Tv className="h-5 w-5 text-indigo-600" />,
      'pets allowed': <PawPrint className="h-5 w-5 text-amber-600" />,
      'smoking allowed': <Cloud className="h-5 w-5 text-gray-600" />,
      cafe: <Coffee className="h-5 w-5 text-amber-600" />,
      concierge: <Bell className="h-5 w-5 text-yellow-600" />,
      'doorman': <Users className="h-5 w-5 text-blue-600" />,
      '24/7 security': <Shield className="h-5 w-5 text-red-600" />,
      'storage': <Building className="h-5 w-5 text-gray-600" />,
      'bike storage': <Car className="h-5 w-5 text-green-600" />,
      'rooftop': <Sun className="h-5 w-5 text-orange-600" />,
      'pool': <Waves className="h-5 w-5 text-cyan-600" />,
      'spa': <Droplets className="h-5 w-5 text-teal-600" />,
      'sauna': <Thermometer className="h-5 w-5 text-red-700" />,
      'jacuzzi': <Droplets className="h-5 w-5 text-purple-600" />,
      'bbq area': <Flame className="h-5 w-5 text-orange-500" />,
      'playground': <Users className="h-5 w-5 text-green-500" />,
      'tennis court': <Dumbbell className="h-5 w-5 text-green-600" />,
      'basketball court': <Dumbbell className="h-5 w-5 text-orange-600" />,
    };
    
    return iconMap[amenityLower] || <Home className="h-5 w-5 text-gray-600" />;
  };

  const formatUtilityName = (utility) => {
    return utility
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatAmenityName = (amenity) => {
    return amenity
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          <p className="text-gray-600">Loading lease details...</p>
        </div>
      </div>
    );
  }

  if (error || !lease) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="h-6 w-6 text-red-600" />
            <h3 className="text-lg font-semibold text-red-800">
              Error Loading Lease
            </h3>
          </div>
          <p className="text-red-600 mb-4">{error || "Lease not found"}</p>
          <div className="flex gap-3">
            <button
              onClick={() => router.push("/dashboard/tenant/leases")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to Leases
            </button>
            <button
              onClick={fetchLease}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isSignedByLandlord = lease.signatures?.landlord?.signedAt;
  const isSignedByTenant = lease.signatures?.tenant?.signedAt;
  const statusConfig = getStatusConfig(lease.status);
  const isApplicationPhase = ["pending_request", "under_review", "approved", "rejected"].includes(lease.status);

  return (
    <div className="p-4 md:p-6">
      {/* Back Button */}
      <button
        onClick={() => router.push("/dashboard/tenant/leases")}
        className="mb-6 flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
      >
        <ArrowLeft size={16} />
        Back to All Leases
      </button>

      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#1F3A34] mb-2">
              {isApplicationPhase ? "Application Details" : "Lease Agreement"}
            </h1>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={18} />
              <span>{lease.property?.title || "N/A"}</span>
              <span className="text-gray-400">•</span>
              <span>{lease.property?.address || "Address not available"}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-full text-sm font-medium border flex items-center gap-2 ${statusConfig.color}`}>
              {statusConfig.icon}
              {statusConfig.label}
            </div>
            <button
              onClick={handleDownloadPDF}
              disabled={!["fully_executed", "active", "expired"].includes(lease.status)}
              className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={18} />
            </button>
          </div>
        </div>

        {/* Status Banner */}
        <div className={`rounded-xl border p-4 ${statusConfig.color.replace('100', '50').replace('800', '700')} mb-6`}>
          <div className="flex items-start gap-3">
            {statusConfig.icon}
            <div>
              <p className="font-medium">{statusConfig.description}</p>
              <p className="text-sm text-gray-600 mt-1">
                {lease.status === "pending_request" && `Applied on ${new Date(lease.createdAt).toLocaleDateString()}`}
                {lease.status === "sent_to_tenant" && `Received on ${new Date(lease.updatedAt).toLocaleDateString()}`}
                {lease.status === "signed_by_landlord" && `Landlord signed on ${new Date(lease.signatures.landlord.signedAt).toLocaleDateString()}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= ACTION BUTTONS ================= */}
      <div className="mb-8">
        <div className="bg-white border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Actions</h2>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Primary Action */}
            {statusConfig.actions.primary === "review" && (
              <button
                onClick={handleReviewLease}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2"
              >
                <FileText size={20} />
                Review & Sign Lease
              </button>
            )}

            {/* {statusConfig.actions.primary === "sign" && (
              <button
                onClick={handleSignLease}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <PenTool size={20} />
                Sign Lease Agreement
              </button>
            )} */}

            {statusConfig.actions.primary === "approve_and_send" && (
              <button
                onClick={handleApproveAndSend}
                disabled={submitting}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <CheckCircle size={20} />
                )}
                {submitting ? "Processing..." : "Approve & Send to Landlord"}
              </button>
            )}

            {/* Secondary Action */}
            {statusConfig.actions.secondary === "request_changes" && (
              <button
                onClick={() => setShowChangeModal(true)}
                className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center justify-center gap-2"
              >
                <Edit size={20} />
                Request Changes
              </button>
            )}

            {statusConfig.actions.secondary === "cancel" && (
              <button
                onClick={handleCancelRequest}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
              >
                <XCircle size={20} />
                Cancel Request
              </button>
            )}

            {statusConfig.actions.secondary === "download" && (
              <button
                onClick={handleDownloadPDF}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <Download size={20} />
                Download PDF
              </button>
            )}

            {/* Options */}
            {statusConfig.actions.options.includes("message") && (
              <button
                onClick={() => setShowMessageModal(true)}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <MessageCircle size={20} />
                Message Landlord
              </button>
            )}
          </div>

          {/* Waiting for landlord signature notice */}
          {lease.status === "sent_to_landlord" && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800">
                    Waiting for Landlord Signature
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    The lease has been sent to the landlord for their signature. 
                    You'll be notified when they sign, and then you can sign to finalize.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lease/Application Details Card */}
          <div className="bg-white border rounded-xl">
            <div 
              className="p-6 cursor-pointer flex justify-between items-center"
              onClick={() => toggleSection('details')}
            >
              <h2 className="text-xl font-semibold text-[#1F3A34]">
                {isApplicationPhase ? "Application Details" : "Lease Details"}
              </h2>
              {expandedSections.details ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
            
            {expandedSections.details && (
              <div className="px-6 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Monthly Rent</p>
                    <p className="text-2xl font-bold text-[#1F3A34]">
                      ${lease.rentAmount?.toLocaleString() ?? "0"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {lease.rentFrequency === "monthly" ? "per month" : lease.rentFrequency}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Security Deposit</p>
                    <p className="text-2xl font-bold text-[#1F3A34]">
                      ${lease.securityDeposit?.toLocaleString() ?? "0"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {lease.depositStatus === "paid" ? "Paid" : "Due before move-in"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Lease Duration</p>
                    <div className="flex items-center gap-2">
                      <Calendar size={20} className="text-gray-400" />
                      <div>
                        <p className="font-medium">
                          {lease.startDate
                            ? new Date(lease.startDate).toLocaleDateString()
                            : "To be determined"}
                        </p>
                        <p className="text-sm text-gray-600">to</p>
                        <p className="font-medium">
                          {lease.endDate
                            ? new Date(lease.endDate).toLocaleDateString()
                            : "To be determined"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {lease.lateFee && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Late Fee</p>
                      <p className="font-medium">${lease.lateFee}</p>
                      <p className="text-sm text-gray-600">After {lease.gracePeriod || 5} days grace</p>
                    </div>
                  )}

                  {lease.terms?.noticeDays && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Notice Period</p>
                      <p className="font-medium">{lease.terms.noticeDays} days</p>
                    </div>
                  )}

                  {lease.application?.screeningResults && (
                    <div className="md:col-span-2 lg:col-span-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Screening Results</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {lease.application.screeningResults.creditScore && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500">Credit Score</p>
                            <p className="font-medium">{lease.application.screeningResults.creditScore}</p>
                          </div>
                        )}
                        {lease.application.screeningResults.incomeVerified && (
                          <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500">Income Verified</p>
                            <p className="font-medium text-green-700">✓ Verified</p>
                          </div>
                        )}
                        {lease.application.screeningResults.referencesChecked && (
                          <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500">References</p>
                            <p className="font-medium text-green-700">✓ Checked</p>
                          </div>
                        )}
                        {lease.application.screeningResults.overallScore && (
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500">Overall Score</p>
                            <p className="font-medium text-blue-700">{lease.application.screeningResults.overallScore}/10</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Property Details Card */}
          <div className="bg-white border rounded-xl">
            <div 
              className="p-6 cursor-pointer flex justify-between items-center"
              onClick={() => toggleSection('amenities')}
            >
              <h2 className="text-xl font-semibold text-[#1F3A34]">Property Details</h2>
              {expandedSections.amenities ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
            
            {expandedSections.amenities && (
              <div className="px-6 pb-6 space-y-6">
                <div className="space-y-2">
                  <h3 className="font-medium text-lg">{lease.property?.title}</h3>
                  <p className="text-gray-600 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {lease.property?.address}
                  </p>
                  <p className="text-gray-600">
                    {lease.property?.city}, {lease.property?.state} {lease.property?.zipCode}
                  </p>
                </div>

                {/* Property Specifications */}
                {(lease.property?.bedrooms || lease.property?.bathrooms || lease.property?.area) && (
                  <div className="grid grid-cols-3 gap-4">
                    {lease.property?.bedrooms && (
                      <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <Bed className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Bedrooms</p>
                        <p className="text-xl font-bold text-blue-800">{lease.property.bedrooms}</p>
                      </div>
                    )}
                    
                    {lease.property?.bathrooms && (
                      <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100">
                        <Bath className="h-6 w-6 text-green-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Bathrooms</p>
                        <p className="text-xl font-bold text-green-800">{lease.property.bathrooms}</p>
                      </div>
                    )}
                    
                    {lease.property?.area && (
                      <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-100">
                        <Ruler className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Area</p>
                        <p className="text-xl font-bold text-purple-800">{lease.property.area} sq ft</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Amenities */}
                {lease.property?.amenities?.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="h-5 w-5 text-indigo-600" />
                      <h3 className="font-medium text-gray-800">Amenities & Features</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {lease.property.amenities.map((amenity, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl hover:border-indigo-300 transition-all"
                        >
                          <div className="flex-shrink-0">
                            {getAmenityIcon(amenity)}
                          </div>
                          <span className="text-sm font-medium text-gray-800">
                            {formatAmenityName(amenity)}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 text-sm text-gray-500 flex items-center gap-2">
                      <span className="px-3 py-1 bg-gray-100 rounded-full">
                        {lease.property.amenities.length} amenities
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Utilities & Maintenance Card */}
          {(lease.utilities?.includedInRent?.length > 0 ||
            lease.utilities?.paidByTenant?.length > 0 ||
            lease.maintenanceTerms) && (
            <div className="bg-white border rounded-xl">
              <div 
                className="p-6 cursor-pointer flex justify-between items-center"
                onClick={() => toggleSection('utilities')}
              >
                <h2 className="text-xl font-semibold text-[#1F3A34]">Utilities & Maintenance</h2>
                {expandedSections.utilities ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              
              {expandedSections.utilities && (
                <div className="px-6 pb-6">
                  {/* Included in Rent */}
                  {lease.utilities?.includedInRent?.length > 0 && (
                    <div className="mb-8">
                      <div className="flex items-center gap-2 mb-4">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <p className="font-medium text-green-700">Included in Rent</p>
                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {lease.utilities.includedInRent.length} items
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {lease.utilities.includedInRent.map((utility, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg"
                          >
                            <div className="flex-shrink-0">
                              {getUtilityIcon(utility)}
                            </div>
                            <span className="text-sm font-medium text-green-800">
                              {formatUtilityName(utility)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Paid by Tenant */}
                  {lease.utilities?.paidByTenant?.length > 0 && (
                    <div className="mb-8">
                      <div className="flex items-center gap-2 mb-4">
                        <AlertCircle className="h-5 w-5 text-blue-600" />
                        <p className="font-medium text-blue-700">Paid by Tenant</p>
                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {lease.utilities.paidByTenant.length} items
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {lease.utilities.paidByTenant.map((utility, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg"
                          >
                            <div className="flex-shrink-0">
                              {getUtilityIcon(utility)}
                            </div>
                            <span className="text-sm font-medium text-blue-800">
                              {formatUtilityName(utility)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Maintenance Terms */}
                  {lease.maintenanceTerms && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Shield className="h-5 w-5 text-gray-700" />
                        <p className="font-medium text-gray-800">Maintenance Terms</p>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                        <p className="text-gray-700 whitespace-pre-line">
                          {lease.maintenanceTerms}
                        </p>
                      </div>
                    </div>
                  )}
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

          {/* Requested Changes */}
          {lease.requestedChanges?.length > 0 && (
            <div className="bg-white border rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Requested Changes</h2>
              <div className="space-y-4">
                {lease.requestedChanges.map((request, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${request.resolved
                      ? "bg-green-50 border-green-200"
                      : "bg-yellow-50 border-yellow-200"
                      }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium">Change Request #{index + 1}</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${request.resolved
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                        }`}>
                        {request.resolved ? "Resolved" : "Pending"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-line mb-3">
                      {request.changes}
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Requested: {new Date(request.requestedAt).toLocaleDateString()}</span>
                      {request.resolved && (
                        <span>Resolved: {new Date(request.resolvedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-white border rounded-xl">
            <div 
              className="p-6 cursor-pointer flex justify-between items-center"
              onClick={() => toggleSection('timeline')}
            >
              <h2 className="text-xl font-semibold text-[#1F3A34] flex items-center gap-2">
                <History size={20} />
                Timeline & History
              </h2>
              {expandedSections.timeline ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
            
            {expandedSections.timeline && (
              <div className="px-6 pb-6">
                <LeaseStatusTimeline lease={lease} />
              </div>
            )}
          </div>

          {/* Messages */}
          {lease.messages?.length > 0 && (
            <div className="bg-white border rounded-xl">
              <div 
                className="p-6 cursor-pointer flex justify-between items-center"
                onClick={() => toggleSection('messages')}
              >
                <h2 className="text-xl font-semibold text-[#1F3A34] flex items-center gap-2">
                  <MessageSquare size={20} />
                  Messages ({lease.messages.length})
                </h2>
                {expandedSections.messages ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              
              {expandedSections.messages && (
                <div className="px-6 pb-6 space-y-4">
                  {lease.messages.map((message, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          {message.from?._id === lease.tenant?._id ? (
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-blue-600" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-green-600" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium">
                              {message.from?._id === lease.tenant?._id ? "You" : message.from?.name || "Landlord"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(message.sentAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 whitespace-pre-line">{message.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN - Sidebar */}
        <div className="space-y-6">
          {/* Landlord Information */}
          <div className="bg-white border rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Landlord Information</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">{lease.landlord?.name || "N/A"}</p>
                    <p className="text-sm text-gray-500">Landlord</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail size={16} />
                    <span>{lease.landlord?.email || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone size={16} />
                    <span>{lease.landlord?.phone || "—"}</span>
                  </div>
                </div>
              </div>

              {/* Landlord Signature Status */}
              <div className="pt-4 border-t">
                <p className="font-medium mb-2">Landlord Signature</p>
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${isSignedByLandlord
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

          {/* Your Signature Status */}
          <div className="bg-white border rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Your Signature</h2>
            <div className="space-y-4">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${isSignedByTenant
                ? "bg-green-100 text-green-800"
                : ["sent_to_tenant", "signed_by_landlord"].includes(lease.status)
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-500"
                }`}>
                <div className={`h-2 w-2 rounded-full ${isSignedByTenant
                  ? "bg-green-500"
                  : ["sent_to_tenant", "signed_by_landlord"].includes(lease.status)
                    ? "bg-blue-400"
                    : "bg-gray-400"
                  }`} />
                {isSignedByTenant
                  ? `Signed on ${new Date(lease.signatures.tenant.signedAt).toLocaleDateString()}`
                  : ["sent_to_tenant", "signed_by_landlord"].includes(lease.status)
                    ? "Ready to sign"
                    : "Not yet signed"
                }
              </div>

              {/* Quick Action Buttons */}
              {lease.status === "sent_to_tenant" && (
                <button
                  onClick={handleReviewLease}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm flex items-center justify-center gap-2"
                >
                  <FileText size={16} />
                  Review Lease
                </button>
              )}

            {!lease.paid && <button
                  onClick={() => handleLeasePayment(lease?._id)}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center justify-center gap-2"
                >
                  <PenTool size={16} />
                  Pay First
                </button>}
              {lease.status === "signed_by_landlord" && (
                <button
                  onClick={handleSignLease}
                  disabled={!lease.paid}
                  className={`w-full px-4 py-2 bg-green-600 text-white rounded-lg text-sm flex items-center justify-center gap-2 ${!lease.paid ? "opacity-40 cursor-none" : ""}`}
                >
                  <PenTool size={16} />
                  Sign Now
                </button>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white border rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
            <div className="space-y-2">
              <button
                onClick={() => router.push(`/dashboard/tenant/properties/${lease.property?._id}`)}
                className="w-full text-left p-3 hover:bg-gray-50 rounded-lg flex items-center justify-between group"
              >
                <span className="flex items-center gap-2">
                  <Eye size={16} />
                  View Property Details
                </span>
                <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600" />
              </button>

              {["fully_executed", "active", "expired"].includes(lease.status) && (
                <button
                  onClick={handleDownloadPDF}
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-lg flex items-center justify-between group"
                >
                  <span className="flex items-center gap-2">
                    <Download size={16} />
                    Download Lease PDF
                  </span>
                  <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600" />
                </button>
              )}

              <button
                onClick={() => setShowMessageModal(true)}
                className="w-full text-left p-3 hover:bg-gray-50 rounded-lg flex items-center justify-between group"
              >
                <span className="flex items-center gap-2">
                  <MessageCircle size={16} />
                  Contact Landlord
                </span>
                <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600" />
              </button>

              {lease.status === "sent_to_tenant" && (
                <button
                  onClick={() => setShowChangeModal(true)}
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-lg flex items-center justify-between group"
                >
                  <span className="flex items-center gap-2">
                    <Edit size={16} />
                    Request Changes
                  </span>
                  <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>

          {/* Lease Info */}
          <div className="bg-white border rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Lease Info</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Lease ID</span>
                <span className="font-mono text-xs">{lease._id?.substring(0, 8)}...</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Created</span>
                <span>
                  {lease.createdAt
                    ? new Date(lease.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Updated</span>
                <span>
                  {lease.updatedAt
                    ? new Date(lease.updatedAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
              {lease.expiresAt && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Expires</span>
                  <span>{new Date(lease.expiresAt).toLocaleDateString()}</span>
                </div>
              )}
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