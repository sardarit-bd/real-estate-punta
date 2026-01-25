"use client";

import LeaseStatusBadge, {
  LeaseStatusTimeline,
} from "@/components/dashboard/Owner/leases/LeaseStatusBadge";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import {
  Download,
  Send,
  Edit,
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
  Eye,
  Check,
  XCircle,
  PenSquare,
  FileSignature,
  MapPin,
  Bed,
  Bath,
  Ruler,
  Zap,
  Droplets,
  Flame,
  Wifi,
  Tv,
  Users,
  Shield,
  Phone,
  Mail as MailIcon,
  ChevronRight,
  CalendarDays,
  Wallet,
  CreditCard,
  Banknote,
  Settings,
  FileCheck,
  Printer,
  Share2,
  Copy,
  Bell,
  Building,
  Key,
  AlertTriangle,
  ClipboardCheck,
  RefreshCw,
  BarChart3,
  TrendingUp,
  Receipt,
  Calculator,
  Percent,
  Timer,
  BatteryCharging,
  Thermometer,
  Snowflake,
  Car,
  Dumbbell,
  Sparkles,
  CheckSquare,
  XSquare,
  MessageSquare,
  FileEdit,
  FilePlus,
  FileMinus,
  FileSearch,
  FileOutput,
  FileSpreadsheet,
} from "lucide-react";
import { leaseService } from "@/services/lease.service";

// Utility Functions
const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(parseFloat(amount));
};

const formatDate = (dateStr) => {
  if (!dateStr) return "Not set";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return "Not set";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Helper Components
const InfoCard = ({ title, value, icon: Icon, color = "blue", children, className = "" }) => (
  <div className={`bg-white border rounded-xl p-4 ${className}`}>
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        {Icon && <Icon className={`h-4 w-4 text-${color}-600`} />}
        <span className="text-sm font-medium text-gray-700">{title}</span>
      </div>
    </div>
    <div className="text-lg font-semibold text-gray-900">{value}</div>
    {children && <div className="mt-2">{children}</div>}
  </div>
);

const StatusPill = ({ status, text, icon: Icon, color = "gray" }) => (
  <span
    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-${color}-100 text-${color}-800 border border-${color}-200`}
  >
    {Icon && <Icon className="h-3 w-3" />}
    {text}
  </span>
);

const SectionCard = ({ title, icon: Icon, action, children, className = "" }) => (
  <div className={`bg-white border rounded-xl p-6 ${className}`}>
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="h-5 w-5 text-gray-700" />}
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      {action && <div>{action}</div>}
    </div>
    {children}
  </div>
);

const DetailRow = ({ label, value, icon: Icon, subValue, badge }) => (
  <div className="flex justify-between items-start py-3 border-b border-gray-100 last:border-0">
    <div className="flex items-start gap-3">
      {Icon && <Icon className="h-4 w-4 text-gray-400 mt-0.5" />}
      <div>
        <span className="text-sm text-gray-600">{label}</span>
        {badge && <div className="mt-1">{badge}</div>}
      </div>
    </div>
    <div className="text-right">
      <div className="font-medium text-gray-900">{value}</div>
      {subValue && <div className="text-xs text-gray-500 mt-1">{subValue}</div>}
    </div>
  </div>
);

const UtilityIcon = ({ utility }) => {
  const iconMap = {
    electricity: <Zap className="h-5 w-5 text-yellow-600" />,
    water: <Droplets className="h-5 w-5 text-blue-600" />,
    gas: <Flame className="h-5 w-5 text-orange-600" />,
    internet: <Wifi className="h-5 w-5 text-purple-600" />,
    cable_tv: <Tv className="h-5 w-5 text-indigo-600" />,
    trash: <FileMinus className="h-5 w-5 text-gray-600" />,
    sewage: <Droplets className="h-5 w-5 text-teal-600" />,
    heating: <Thermometer className="h-5 w-5 text-red-600" />,
    cooling: <Snowflake className="h-5 w-5 text-cyan-600" />,
  };
  return iconMap[utility] || <CheckCircle className="h-5 w-5 text-green-600" />;
};

const formatUtilityName = (utility) => {
  if (!utility) return "";
  return utility
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

export default function LeaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [lease, setLease] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sendingToTenant, setSendingToTenant] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [activeSection, setActiveSection] = useState("overview");

  // Fetch lease data
  useEffect(() => {
    fetchLease();
  }, [params.id]);

  const fetchLease = async () => {
    try {
      setLoading(true);
      const response = await leaseService.getLeaseById(params.id);

      if (response.success) {
        setLease(response.data);
      } else {
        setError(response.message || "Failed to fetch lease");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch lease details");
    } finally {
      setLoading(false);
    }
  };

  // Derived values
  const isSignedByLandlord = lease?.signatures?.landlord?.signedAt;
  const isSignedByTenant = lease?.signatures?.tenant?.signedAt;
  const isFullySigned = isSignedByLandlord && isSignedByTenant;

  const statusConfig = useMemo(() => {
    const configs = {
      pending_request: {
        color: "yellow",
        icon: AlertCircle,
        title: "Pending Approval",
        description: "Tenant has requested to rent this property",
        actions: ["approve", "message", "cancel", "edit", 'send'],
      },
      approved: {
        color: "yellow",
        icon: AlertCircle,
        title: "Approved",
        description: "Tenant has requested to rent this property",
        actions: ["approve", "message", "cancel", "edit", 'send'],
      },
      draft: {
        color: "gray",
        icon: FileEdit,
        title: "Draft",
        description: "Lease draft ready for landlord signature",
        actions: ["edit", "sign", "send", "message"],
      },
      sent_to_tenant: {
        color: "blue",
        icon: Clock,
        title: "Sent to Tenant",
        description: "Waiting for tenant review and signature",
        actions: ["view", "message", "resend"],
      },
      changes_requested: {
        color: "orange",
        icon: AlertTriangle,
        title: "Changes Requested",
        description: "Tenant requested modifications",
        actions: ["edit", "save", "resend", "message"],
      },
      sent_to_landlord: {
        color: "blue",
        icon: FileSignature,
        title: "Action Required",
        description: "Tenant sent the lease for your signature",
        actions: ["sign", "view", "message"],
      },
      signed_by_landlord: {
        color: "purple",
        icon: CheckCircle,
        title: "Signed by You",
        description: "Waiting for tenant signature",
        actions: ["view", "download", "message"],
      },
      signed_by_tenant: {
        color: "green",
        icon: AlertCircle,
        title: "Tenant Signed",
        description: "Please sign to finalize the lease",
        actions: ["sign", "view", "message"],
      },
      fully_executed: {
        color: "green",
        icon: CheckCircle,
        title: "Fully Executed",
        description: "Lease is active and legally binding",
        actions: ["view", "download", "manage"],
      },
      active: {
        color: "green",
        icon: CheckCircle,
        title: "Active",
        description: "Lease is currently active",
        actions: ["view", "download", "manage"],
      },
      cancelled: {
        color: "red",
        icon: XCircle,
        title: "Cancelled",
        description: "Lease has been cancelled",
        actions: ["view"],
      },
      expired: {
        color: "gray",
        icon: Clock,
        title: "Expired",
        description: "Lease term has ended",
        actions: ["view", "download"],
      },
    };
    return configs[lease?.status] || configs.pending_request;
  }, [lease?.status]);

  // Action handlers
  const handleDownloadPDF = () => {
    alert("PDF download will be available soon!");
  };

  const handleSendToTenant = async () => {
    try {
      setSendingToTenant(true);
      const response = await leaseService.sendToTenant(
        params.id,
        "Please review and sign the lease agreement."
      );
      if (response.success) {
        alert("Lease sent to tenant successfully!");
        fetchLease();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send lease");
    } finally {
      setSendingToTenant(false);
    }
  };

  const handleApproveRequest = async () => {
    try {
      const response = await leaseService.approveRequest(params.id);
      if (response.success) {
        alert("Request approved! Lease draft created.");
        fetchLease();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to approve request");
    }
  };

  const handleCancelLease = async () => {
    const reason = prompt("Please provide a reason for cancellation:");
    if (reason) {
      try {
        const response = await leaseService.cancelLease(params.id, reason);
        if (response.success) {
          alert("Lease cancelled successfully.");
          fetchLease();
        }
      } catch (error) {
        alert(error.response?.data?.message || "Failed to cancel lease");
      }
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    alert("Message sent to tenant");
    setShowMessageModal(false);
    setMessageText("");
  };

  const handleSignClick = () => {
    router.push(`/dashboard/owner/leases/${lease._id}/sign`);
  };

  const handleEditLease = () => {
    router.push(`/dashboard/owner/leases/${params.id}/edit`);
  };

  const handleViewProperty = () => {
    if (lease.property?._id) {
      router.push(`/dashboard/owner/properties/${lease.property._id}`);
    }
  };

  const handleCopyLeaseId = () => {
    navigator.clipboard.writeText(lease._id);
    alert("Lease ID copied to clipboard!");
  };

  // Calculate lease duration
  const leaseDuration = useMemo(() => {
    if (!lease?.startDate || !lease?.endDate) return "Not set";
    const start = new Date(lease.startDate);
    const end = new Date(lease.endDate);
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    return `${months} months (${Math.floor(months / 12)} years ${months % 12} months)`;
  }, [lease]);

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

  if (error || !lease) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-600 text-sm">!</span>
            </div>
            <h3 className="text-lg font-semibold text-red-800">
              Error Loading Lease
            </h3>
          </div>
          <p className="text-red-600 mb-4">{error || "Lease not found"}</p>
          <button
            onClick={() => router.push("/dashboard/owner/leases")}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Back to Leases
          </button>
        </div>
      </div>
    );
  }

  // Navigation sections
  const sections = [
    { id: "overview", name: "Overview", icon: Eye },
    { id: "details", name: "Lease Details", icon: FileText },
    { id: "financial", name: "Financial", icon: DollarSign },
    { id: "documents", name: "Documents", icon: FileCheck },
    { id: "activity", name: "Activity", icon: Clock },
  ];

  // Available actions based on status
  const canEdit = statusConfig.actions.includes("edit");
  const canSend = statusConfig.actions.includes("send") || statusConfig.actions.includes("resend");
  const canSign = statusConfig.actions.includes("sign");
  const canApprove = statusConfig.actions.includes("approve");
  const canMessage = statusConfig.actions.includes("message");
  const canDownload = statusConfig.actions.includes("download");
  const canCancel = statusConfig.actions.includes("cancel");

  const isLeaseValidForSending = () => {
    return (
      lease.startDate &&
      lease.endDate &&
      lease.rentAmount &&
      lease.rentAmount > 0
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/dashboard/owner/leases")}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="hidden sm:inline">Back to Leases</span>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {lease.property?.title || "Lease Agreement"}
                </h1>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <span>Lease ID: {lease._id.substring(0, 8)}...</span>
                  <button
                    onClick={handleCopyLeaseId}
                    className="text-blue-600 hover:text-blue-800"
                    title="Copy Lease ID"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <LeaseStatusBadge status={lease.status} size="lg" />
              {isFullySigned && (
                <span className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  Fully Signed
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-6 py-3 bg-white border-b">
        <div className="flex overflow-x-auto">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-2 whitespace-nowrap ${
                activeSection === section.id
                  ? "text-blue-600 border-b-2 border-blue-600 font-medium"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <section.icon className="h-4 w-4" />
              {section.name}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Status Banner */}
        {statusConfig && (
          <div className="mb-6">
            <div className={`bg-${statusConfig.color}-50 border border-${statusConfig.color}-200 rounded-xl p-4`}>
              <div className="flex items-start gap-3">
                <statusConfig.icon className={`h-5 w-5 text-${statusConfig.color}-600 mt-0.5`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">{statusConfig.title}</h3>
                    <span className="text-sm text-gray-500">
                      {formatDate(lease.updatedAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{statusConfig.description}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mb-8">
          <SectionCard title="Lease Actions">
            <div className="flex flex-wrap gap-3">
              {/* Approve Request */}
              {canApprove && (
                <button
                  onClick={handleApproveRequest}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Check className="h-5 w-5" />
                  Approve Request
                </button>
              )}

              {/* Edit Lease */}
              {canEdit && (
                <button
                  onClick={handleEditLease}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Edit className="h-5 w-5" />
                  Edit Lease
                </button>
              )}

              {/* Sign Lease */}
              {canSign && (
                <button
                  onClick={handleSignClick}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                >
                  <PenSquare className="h-5 w-5" />
                  Sign Lease
                </button>
              )}

              {/* Send to Tenant */}
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
                  Send to Tenant
                </button>
              )}

              {/* Cancel Lease */}
              {canCancel && (
                <button
                  onClick={handleCancelLease}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                >
                  <XCircle className="h-5 w-5" />
                  Cancel Lease
                </button>
              )}

              {/* Download PDF */}
              {canDownload && (
                <button
                  onClick={handleDownloadPDF}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
                >
                  <Download className="h-5 w-5" />
                  Download PDF
                </button>
              )}

              {/* Message */}
              {canMessage && (
                <button
                  onClick={() => setShowMessageModal(true)}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  Message Tenant
                </button>
              )}

              {/* View Property */}
              {/* {lease.property?._id && (
                <button
                  onClick={handleViewProperty}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2"
                >
                  <Home className="h-5 w-5" />
                  View Property
                </button>
              )} */}
            </div>

            {/* Validation Warning */}
            {canSend && !isLeaseValidForSending() && (
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 font-medium">Cannot send lease</p>
                <ul className="text-sm text-yellow-700 mt-2 list-disc pl-4">
                  {!lease.startDate && <li>Start date is required</li>}
                  {!lease.endDate && <li>End date is required</li>}
                  {(!lease.rentAmount || lease.rentAmount <= 0) && (
                    <li>Valid rent amount is required</li>
                  )}
                </ul>
              </div>
            )}
          </SectionCard>
        </div>

        {/* Main Content - Dynamic based on active section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {activeSection === "overview" && (
              <>
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <InfoCard
                    title="Monthly Rent"
                    value={formatCurrency(lease.rentAmount)}
                    icon={DollarSign}
                    color="green"
                  >
                    <div className="text-xs text-gray-500 mt-1">
                      Due on day {lease.paymentSettings?.dueDate || 1} of each month
                    </div>
                  </InfoCard>

                  <InfoCard
                    title="Security Deposit"
                    value={formatCurrency(lease.securityDeposit)}
                    icon={Shield}
                    color="blue"
                  >
                    <div className="text-xs text-gray-500 mt-1 capitalize">
                      {lease.depositStatus || "Pending"}
                    </div>
                  </InfoCard>

                  <InfoCard
                    title="Lease Duration"
                    value={
                      lease.startDate && lease.endDate
                        ? `${new Date(lease.startDate).toLocaleDateString("en-US", {
                            month: "short",
                            year: "numeric",
                          })} - ${new Date(lease.endDate).toLocaleDateString(
                            "en-US",
                            { month: "short", year: "numeric" }
                          )}`
                        : "Not set"
                    }
                    icon={Calendar}
                    color="purple"
                  >
                    <div className="text-xs text-gray-500 mt-1">{leaseDuration}</div>
                  </InfoCard>

                  <InfoCard
                    title="Signatures"
                    value={
                      isFullySigned
                        ? "Complete"
                        : `${isSignedByLandlord ? "Landlord" : ""}${
                            isSignedByLandlord && isSignedByTenant ? " & " : ""
                          }${isSignedByTenant ? "Tenant" : ""}`
                    }
                    icon={FileSignature}
                    color={isFullySigned ? "green" : "yellow"}
                  >
                    <div className="text-xs text-gray-500 mt-1">
                      {isFullySigned
                        ? "Fully executed"
                        : isSignedByLandlord
                        ? "Waiting for tenant"
                        : "Waiting for signatures"}
                    </div>
                  </InfoCard>
                </div>

                {/* Property Details */}
                <SectionCard title="Property Information" icon={Building}>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Building className="h-8 w-8 text-gray-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {lease.property?.title || "Property"}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          <MapPin className="inline h-4 w-4 mr-1" />
                          {lease.property?.address || "Address not available"}
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          {lease.property?.bedrooms && (
                            <div className="flex items-center gap-2">
                              <Bed className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">{lease.property.bedrooms} bd</span>
                            </div>
                          )}
                          {lease.property?.bathrooms && (
                            <div className="flex items-center gap-2">
                              <Bath className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">{lease.property.bathrooms} ba</span>
                            </div>
                          )}
                          {lease.property?.area && (
                            <div className="flex items-center gap-2">
                              <Ruler className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">{lease.property.area} sq ft</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Utilities */}
                    {(lease.utilities?.includedInRent?.length > 0 || lease.utilities?.paidByTenant?.length > 0) && (
                      <div className="border-t pt-6">
                        <h4 className="font-medium text-gray-900 mb-4">Utilities</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium text-gray-700">Included in Rent</span>
                            </div>
                            <div className="space-y-2">
                              {lease.utilities?.includedInRent?.map((util, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                                  <UtilityIcon utility={util} />
                                  <span className="text-sm">{formatUtilityName(util)}</span>
                                </div>
                              )) || (
                                <div className="text-sm text-gray-500">None</div>
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <DollarSign className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium text-gray-700">Paid by Tenant</span>
                            </div>
                            <div className="space-y-2">
                              {lease.utilities?.paidByTenant?.map((util, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                                  <UtilityIcon utility={util} />
                                  <span className="text-sm">{formatUtilityName(util)}</span>
                                </div>
                              )) || (
                                <div className="text-sm text-gray-500">None</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </SectionCard>

                {/* Parties Information */}
                <SectionCard title="Parties Involved" icon={Users}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Landlord */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Landlord</h4>
                          <p className="text-sm text-gray-600">Property Owner</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <DetailRow
                          label="Name"
                          value={lease.landlord?.name || "N/A"}
                          icon={User}
                        />
                        <DetailRow
                          label="Email"
                          value={lease.landlord?.email || "N/A"}
                          icon={MailIcon}
                        />
                        <DetailRow
                          label="Phone"
                          value={lease.landlord?.phone || "N/A"}
                          icon={Phone}
                        />
                        <DetailRow
                          label="Signature"
                          value={isSignedByLandlord ? "Completed" : "Pending"}
                          icon={FileSignature}
                          badge={
                            isSignedByLandlord ? (
                              <StatusPill
                                status="signed"
                                text="Signed"
                                icon={CheckCircle}
                                color="green"
                              />
                            ) : (
                              <StatusPill
                                status="pending"
                                text="Pending"
                                icon={Clock}
                                color="yellow"
                              />
                            )
                          }
                        />
                      </div>
                    </div>

                    {/* Tenant */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <User className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Tenant</h4>
                          <p className="text-sm text-gray-600">Renter</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <DetailRow
                          label="Name"
                          value={lease.tenant?.name || "N/A"}
                          icon={User}
                        />
                        <DetailRow
                          label="Email"
                          value={lease.tenant?.email || "N/A"}
                          icon={MailIcon}
                        />
                        <DetailRow
                          label="Phone"
                          value={lease.tenant?.phone || "N/A"}
                          icon={Phone}
                        />
                        <DetailRow
                          label="Signature"
                          value={isSignedByTenant ? "Completed" : "Pending"}
                          icon={FileSignature}
                          badge={
                            isSignedByTenant ? (
                              <StatusPill
                                status="signed"
                                text="Signed"
                                icon={CheckCircle}
                                color="green"
                              />
                            ) : (
                              <StatusPill
                                status="pending"
                                text="Pending"
                                icon={Clock}
                                color="yellow"
                              />
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                </SectionCard>
              </>
            )}

            {activeSection === "details" && (
              <>
                {/* Lease Terms */}
                <SectionCard title="Lease Terms" icon={FileText}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <DetailRow
                          label="Start Date"
                          value={formatDate(lease.startDate)}
                          icon={Calendar}
                        />
                        <DetailRow
                          label="End Date"
                          value={formatDate(lease.endDate)}
                          icon={Calendar}
                        />
                        <DetailRow
                          label="Duration"
                          value={leaseDuration}
                          icon={Clock}
                        />
                        <DetailRow
                          label="Rent Frequency"
                          value={
                            lease.rentFrequency
                              ? lease.rentFrequency.charAt(0).toUpperCase() +
                                lease.rentFrequency.slice(1)
                              : "Monthly"
                          }
                          icon={CalendarDays}
                        />
                      </div>
                      <div className="space-y-4">
                        <DetailRow
                          label="Monthly Rent"
                          value={formatCurrency(lease.rentAmount)}
                          icon={DollarSign}
                        />
                        <DetailRow
                          label="Security Deposit"
                          value={formatCurrency(lease.securityDeposit)}
                          icon={Shield}
                        />
                      </div>
                    </div>

                    {/* Maintenance Terms */}
                    {lease.maintenanceTerms && (
                      <div className="border-t pt-6">
                        <h4 className="font-medium text-gray-900 mb-3">Maintenance Terms</h4>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-700 whitespace-pre-line">
                            {lease.maintenanceTerms}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Additional Terms */}
                    {lease.description && (
                      <div className="border-t pt-6">
                        <h4 className="font-medium text-gray-900 mb-3">Additional Terms</h4>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-700 whitespace-pre-line">
                            {lease.description}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </SectionCard>

                
              </>
            )}

            {activeSection === "financial" && (
              <>
                {/* Financial Overview */}
                <SectionCard title="Financial Overview" icon={BarChart3}>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                      <InfoCard
                        title="Total Lease Value"
                        value={formatCurrency(lease.rentAmount * (leaseDuration.match(/\d+/)?.[0] || 0))}
                        icon={Calculator}
                        color="green"
                      >
                        <div className="text-xs text-gray-500 mt-1">Estimated total rent</div>
                      </InfoCard>

                      <InfoCard
                        title="Security Deposit"
                        value={formatCurrency(lease.securityDeposit)}
                        icon={Wallet}
                        color="blue"
                      >
                        <div className="text-xs text-gray-500 mt-1 capitalize">
                          Status: {lease.depositStatus || "Pending"}
                        </div>
                      </InfoCard>
                    </div>

                    {/* Deposit Transactions */}
                    {lease.depositTransactions?.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-4">Deposit Transactions</h4>
                        <div className="space-y-3">
                          {lease.depositTransactions.map((transaction, idx) => (
                            <div
                              key={idx}
                              className={`flex justify-between items-center p-4 rounded-lg ${
                                transaction.type === "deposit"
                                  ? "bg-green-50 border border-green-200"
                                  : transaction.type === "return"
                                  ? "bg-blue-50 border border-blue-200"
                                  : "bg-red-50 border border-red-200"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${
                                  transaction.type === "deposit"
                                    ? "bg-green-100"
                                    : transaction.type === "return"
                                    ? "bg-blue-100"
                                    : "bg-red-100"
                                }`}>
                                  {transaction.type === "deposit" && <Wallet className="h-5 w-5 text-green-600" />}
                                  {transaction.type === "return" && <Download className="h-5 w-5 text-blue-600" />}
                                  {transaction.type === "deduction" && <FileMinus className="h-5 w-5 text-red-600" />}
                                </div>
                                <div>
                                  <div className="font-medium capitalize">{transaction.type}</div>
                                  <div className="text-sm text-gray-600">
                                    {formatDate(transaction.date)}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className={`font-bold ${
                                  transaction.type === "deposit"
                                    ? "text-green-800"
                                    : transaction.type === "return"
                                    ? "text-blue-800"
                                    : "text-red-800"
                                }`}>
                                  {transaction.type === "deduction" ? "-" : ""}
                                  {formatCurrency(transaction.amount)}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {transaction.description}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </SectionCard>
                      {/* Signature Status */}
            <SectionCard title="Signature Status" className="!p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${isSignedByLandlord ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className="text-sm">Landlord</span>
                  </div>
                  <StatusPill
                    status={isSignedByLandlord ? "signed" : "pending"}
                    text={isSignedByLandlord ? "Signed" : "Pending"}
                    icon={isSignedByLandlord ? CheckCircle : Clock}
                    color={isSignedByLandlord ? "green" : "gray"}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${isSignedByTenant ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className="text-sm">Tenant</span>
                  </div>
                  <StatusPill
                    status={isSignedByTenant ? "signed" : "pending"}
                    text={isSignedByTenant ? "Signed" : "Pending"}
                    icon={isSignedByTenant ? CheckCircle : Clock}
                    color={isSignedByTenant ? "green" : "gray"}
                  />
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <span className="font-medium text-gray-900">Overall Status</span>
                  <StatusPill
                    status={isFullySigned ? "complete" : "incomplete"}
                    text={isFullySigned ? "Complete" : "Incomplete"}
                    icon={isFullySigned ? CheckCircle : AlertCircle}
                    color={isFullySigned ? "green" : "yellow"}
                  />
                </div>
              </div>
            </SectionCard>
              </>
            )}

            {activeSection === "documents" && (
              <>
                {/* Documents */}
                <SectionCard title="Documents & Signatures" icon={FileCheck}>
                  <div className="space-y-6">
                    {/* Lease Documents */}
                    

                    {/* Signatures */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Electronic Signatures</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`border rounded-lg p-4 ${isSignedByLandlord ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <FileSignature className="h-5 w-5 text-blue-600" />
                              <div>
                                <div className="font-medium">Landlord Signature</div>
                                <div className="text-sm text-gray-600">
                                  {isSignedByLandlord ? "Signed" : "Pending"}
                                </div>
                              </div>
                            </div>
                            {isSignedByLandlord && (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            )}
                          </div>
                          {isSignedByLandlord && (
                            <div className="space-y-2 text-sm text-gray-600">
                              <div>Signed on: {formatDateTime(lease.signatures.landlord.signedAt)}</div>
                              <div>Type: {lease.signatures.landlord.signatureType}</div>
                            </div>
                          )}
                        </div>

                        <div className={`border rounded-lg p-4 ${isSignedByTenant ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <FileSignature className="h-5 w-5 text-green-600" />
                              <div>
                                <div className="font-medium">Tenant Signature</div>
                                <div className="text-sm text-gray-600">
                                  {isSignedByTenant ? "Signed" : "Pending"}
                                </div>
                              </div>
                            </div>
                            {isSignedByTenant && (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            )}
                          </div>
                          {isSignedByTenant && (
                            <div className="space-y-2 text-sm text-gray-600">
                              <div>Signed on: {formatDateTime(lease.signatures.tenant.signedAt)}</div>
                              <div>Type: {lease.signatures.tenant.signatureType}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </SectionCard>
              </>
            )}

            {activeSection === "activity" && (
              <>
                {/* Timeline */}
                <SectionCard title="Lease Timeline" icon={Clock}>
                  <LeaseStatusTimeline lease={lease} />
                </SectionCard>

                {/* Messages */}
                {lease.messages?.length > 0 && (
                  <SectionCard title="Messages" icon={MessageCircle}>
                    <div className="space-y-4">
                      {lease.messages.map((message, idx) => (
                        <div
                          key={idx}
                          className="border-l-4 border-blue-500 pl-4 py-3"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-gray-400" />
                              <span className="font-medium">
                                {message.from?.name || "Unknown"}
                              </span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {formatDateTime(message.sentAt)}
                            </span>
                          </div>
                          <p className="text-gray-700">{message.message}</p>
                        </div>
                      ))}
                    </div>
                  </SectionCard>
                )}

                {/* Change Requests */}
                {lease.requestedChanges?.length > 0 && (
                  <SectionCard title="Change Requests" icon={AlertCircle}>
                    <div className="space-y-4">
                      {lease.requestedChanges.map((req, idx) => (
                        <div
                          key={idx}
                          className={`border rounded-lg p-4 ${req.resolved ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <p className="font-medium">Change Request #{idx + 1}</p>
                            <span
                              className={`text-xs px-2 py-1 rounded ${req.resolved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                            >
                              {req.resolved ? "Resolved" : "Pending"}
                            </span>
                          </div>
                          <p className="text-sm text-gray-800 whitespace-pre-line mb-3">
                            {req.changes}
                          </p>
                          <div className="text-xs text-gray-500">
                            Requested on: {formatDate(req.requestedAt)}
                          </div>
                          {req.resolved && (
                            <div className="text-xs text-green-600 mt-3 flex items-center gap-1">
                              <CheckCircle size={12} />
                              <span>
                                Resolved on {formatDate(req.resolvedAt)}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </SectionCard>
                )}
              </>
            )}

           
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <SectionCard title="Quick Info" className="!p-4">
              <div className="space-y-3">
                <DetailRow
                  label="Lease ID"
                  value={lease._id.substring(0, 8) + "..."}
                  icon={FileText}
                />
                <DetailRow
                  label="Created"
                  value={formatDate(lease.createdAt)}
                  icon={Calendar}
                />
                <DetailRow
                  label="Updated"
                  value={formatDate(lease.updatedAt)}
                  icon={RefreshCw}
                />
                <DetailRow
                  label="Status"
                  value={<LeaseStatusBadge status={lease.status} size="sm" />}
                  icon={Bell}
                />
                {lease.expiresAt && (
                  <DetailRow
                    label="Expires"
                    value={formatDate(lease.expiresAt)}
                    icon={Clock}
                  />
                )}
              </div>
            </SectionCard>

           

          </div>
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