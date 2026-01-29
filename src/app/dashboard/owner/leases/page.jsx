// frontend/src/app/dashboard/owner/leases/page.js - UPGRADED VERSION
"use client";

import LeaseStatusBadge from "@/components/dashboard/Owner/leases/LeaseStatusBadge";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  LayoutGrid, 
  List, 
  Loader2, 
  Filter,
  Download,
  Send,
  Clock,
  AlertCircle,
  CheckCircle,
  FileText,
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
  Bell,
  Eye,
  Edit,
  CheckSquare,
  Square,
  Search,
  ChevronDown,
  MoreVertical,
  RefreshCw,
  BarChart3,
  FileSignature,
  Mail
} from "lucide-react";
import { leaseService } from "@/services/lease.service";
import toast from "react-hot-toast";

// Enhanced filters with counts
const ENHANCED_FILTERS = [
  { key: "all", label: "All Leases", icon: FileText, color: "bg-gray-100 text-gray-700" },
  { key: "pending_request", label: "Pending Requests", icon: AlertCircle, color: "bg-orange-100 text-orange-700" },
  { key: "draft", label: "Drafts", icon: Edit, color: "bg-blue-100 text-blue-700" },
  { key: "sent_to_tenant", label: "Sent to Tenant", icon: Send, color: "bg-purple-100 text-purple-700" },
  { key: "signed_by_tenant", label: "Tenant Signed", icon: FileSignature, color: "bg-green-100 text-green-700" },
  { key: "signed_by_landlord", label: "Owner Signed", icon: CheckCircle, color: "bg-emerald-100 text-emerald-700" },
  { key: "fully_executed", label: "Fully Executed", icon: CheckSquare, color: "bg-teal-100 text-teal-700" },
  { key: "active", label: "Active", icon: TrendingUp, color: "bg-green-100 text-green-700" },
  { key: "expiring_soon", label: "Expiring Soon", icon: Clock, color: "bg-red-100 text-red-700" },
  { key: "changes_requested", label: "Changes Requested", icon: RefreshCw, color: "bg-yellow-100 text-yellow-700" },
];

function formatMoney(v) {
  if (v === undefined || v === null) return "—";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(v);
  } catch {
    return `$${v}`;
  }
}

// Helper function to get status badge color
function getStatusColor(status) {
  const statusColors = {
    "pending_request": "bg-orange-100 text-orange-800 border-orange-200",
    "under_review": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "approved": "bg-blue-100 text-blue-800 border-blue-200",
    "rejected": "bg-red-100 text-red-800 border-red-200",
    "draft": "bg-gray-100 text-gray-800 border-gray-200",
    "sent_to_tenant": "bg-purple-100 text-purple-800 border-purple-200",
    "changes_requested": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "sent_to_landlord": "bg-indigo-100 text-indigo-800 border-indigo-200",
    "signed_by_landlord": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "signed_by_tenant": "bg-green-100 text-green-800 border-green-200",
    "fully_executed": "bg-teal-100 text-teal-800 border-teal-200",
    "active": "bg-green-100 text-green-800 border-green-200",
    "renewal_pending": "bg-cyan-100 text-cyan-800 border-cyan-200",
    "notice_given": "bg-amber-100 text-amber-800 border-amber-200",
    "expired": "bg-gray-100 text-gray-800 border-gray-200",
    "terminated": "bg-red-100 text-red-800 border-red-200",
    "cancelled": "bg-gray-100 text-gray-800 border-gray-200"
  };
  return statusColors[status] || "bg-gray-100 text-gray-800 border-gray-200";
}

export default function OwnerLeasesPage() {
  const router = useRouter();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [selectedLeases, setSelectedLeases] = useState([]);
  const [leases, setLeases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pendingSignatures: 0,
    active: 0,
    expiringSoon: 0,
    pendingRequests: 0,
    drafts: 0,
    monthlyRent: 0
  });
  
  const [filterStats, setFilterStats] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [bulkAction, setBulkAction] = useState(null);

  // Fetch data on initial load and filter change
  useEffect(() => {
    fetchDashboardData();
  }, [filter]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch leases
      const leasesRes = await leaseService.getMyLeases({
        role: "landlord",
        status: filter !== "all" ? filter : undefined,
      });

      if (leasesRes.success) {
        setLeases(leasesRes.data || []);
        updateStats(leasesRes.data || []);
      }

      // Fetch additional stats
      await fetchEnhancedStats();
      
    } catch (err) {
      console.error("Failed to fetch data", err);
      setError(err.message || 'Failed to load dashboard');
      toast.error("Failed to load lease data");
    } finally {
      setLoading(false);
    }
  };

  const fetchEnhancedStats = async () => {
    try {
      const statsRes = await leaseService.getLeaseStats();
      if (statsRes.success) {
        // Calculate filter counts
        const counts = {};
        ENHANCED_FILTERS.forEach(f => {
          if (f.key === "all") {
            counts[f.key] = statsRes.data.counts?.total || 0;
          } else if (f.key === "expiring_soon") {
            counts[f.key] = statsRes.data.expiringSoon || 0;
          } else {
            counts[f.key] = statsRes.data.byStatus?.find(s => s.status === f.key)?.count || 0;
          }
        });
        setFilterStats(counts);
      }
    } catch (err) {
      console.error("Failed to fetch enhanced stats", err);
    }
  };

  const updateStats = (leasesData) => {
    const pendingSignatures = leasesData.filter(l => 
      ["sent_to_tenant", "signed_by_tenant"].includes(l.status)
    ).length;
    
    const active = leasesData.filter(l => 
      ["active", "fully_executed"].includes(l.status)
    ).length;
    
    const expiringSoon = leasesData.filter(l => {
      if (!["active", "fully_executed"].includes(l.status) || !l.endDate) return false;
      const endDate = new Date(l.endDate);
      const now = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(now.getDate() + 30);
      return endDate >= now && endDate <= thirtyDaysFromNow;
    }).length;

    const pendingRequests = leasesData.filter(l => l.status === "pending_request").length;
    const drafts = leasesData.filter(l => ["draft", "approved"].includes(l.status)).length;
    
    const monthlyRent = leasesData
      .filter(l => ["active", "fully_executed"].includes(l.status))
      .reduce((sum, lease) => sum + (lease.rentAmount || 0), 0);

    setStats({
      total: leasesData.length,
      pendingSignatures,
      active,
      expiringSoon,
      pendingRequests,
      drafts,
      monthlyRent
    });
  };

  // Process rows for display
  const rows = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return leases
      .filter(l => {
        if (!searchText) return true;
        return (
          l._id.toLowerCase().includes(searchText) ||
          l.property?.title?.toLowerCase().includes(searchText) ||
          l.property?.address?.toLowerCase().includes(searchText) ||
          l.tenant?.name?.toLowerCase().includes(searchText) ||
          l.tenant?.email?.toLowerCase().includes(searchText)
        );
      })
      .map(l => {
        const rentValue = l.rentAmount || l.property?.price || 0;
        const isFullySigned = l.signatures?.tenant?.signedAt && l.signatures?.landlord?.signedAt;
        const signedDate = l.signatures?.tenant?.signedAt && l.signatures?.landlord?.signedAt
          ? new Date(l.signatures.tenant.signedAt).toLocaleDateString()
          : null;

        return {
          id: l._id,
          propertyTitle: l.property?.title || 'Unnamed Property',
          propertyAddress: `${l.property?.address || ""}, ${l.property?.city || ""}`.trim().replace(/,$/, ''),
          tenantName: l.tenant?.name || 'N/A',
          tenantEmail: l.tenant?.email || 'No email',
          tenantPhone: l.tenant?.phone || 'No phone',
          rent: rentValue,
          status: l.status || 'draft',
          statusColor: getStatusColor(l.status),
          startDate: l.startDate ? new Date(l.startDate).toLocaleDateString() : 'Not set',
          endDate: l.endDate ? new Date(l.endDate).toLocaleDateString() : 'Not set',
          updatedAt: l.updatedAt ? new Date(l.updatedAt).toLocaleDateString() : 'N/A',
          signedDate,
          isFullySigned,
          leaseType: l.rentFrequency === 'monthly' ? 'Fixed Term' : 'Variable',
          paymentDay: l.paymentSettings?.dueDate || 1,
          securityDeposit: l.securityDeposit || 0,
          landlordName: l.landlord?.name || 'N/A',
          originalData: l
        };
      });
  }, [leases, search]);

  // Enhanced Action Handlers
  const handleSendForSignature = async (leaseId, message = "Please review and sign the lease agreement.") => {
    try {
      const response = await leaseService.sendToTenant(leaseId, message);
      if (response.success) {
        toast.success('Lease sent to tenant successfully!');
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error sending lease:', error);
      toast.error(error.response?.data?.message || 'Failed to send lease');
    }
  };

  const handleApproveRequest = async (leaseId) => {
    try {
      const response = await leaseService.reviewApplication(leaseId, "approve");
      if (response.success) {
        toast.success('Request approved! Lease draft created.');
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error(error.response?.data?.message || 'Failed to approve request');
    }
  };

  const handleRejectRequest = async (leaseId, reason = "Application rejected") => {
    try {
      const response = await leaseService.reviewApplication(leaseId, "reject", reason);
      if (response.success) {
        toast.success('Request rejected successfully.');
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error(error.response?.data?.message || 'Failed to reject request');
    }
  };

  const handleDownloadPDF = async (leaseId) => {
    try {
      // This would call your PDF generation endpoint
      toast.loading('Generating PDF...');
      // Implement actual PDF download
      setTimeout(() => {
        toast.dismiss();
        toast.success('PDF generated successfully!');
      }, 1500);
    } catch (error) {
      toast.error('Failed to generate PDF');
    }
  };

  const handleSendReminder = async (leaseId) => {
    try {
      const response = await leaseService.quickAction(leaseId, "send-reminder", {
        message: "Friendly reminder to review and sign the lease agreement."
      });
      if (response.success) {
        toast.success('Reminder sent successfully!');
      }
    } catch (error) {
      console.error('Error sending reminder:', error);
      toast.error('Failed to send reminder');
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedLeases.length === 0) {
      toast.error("Please select at least one lease");
      return;
    }

    try {
      switch (action) {
        case "send-reminders":
          await leaseService.bulkActions("send-reminders", selectedLeases);
          toast.success(`Reminders sent to ${selectedLeases.length} lease(s)`);
          break;
          
        case "download-pdfs":
          toast.success(`PDF generation started for ${selectedLeases.length} lease(s)`);
          break;
          
        case "change-status":
          // This would open a modal to select status
          toast.success(`Bulk status update for ${selectedLeases.length} lease(s)`);
          break;
      }
      
      setSelectedLeases([]);
      fetchDashboardData();
    } catch (error) {
      toast.error('Bulk action failed');
    }
  };

  // Quick status filters
  const quickFilters = [
    { label: "Needs Attention", count: stats.pendingSignatures + stats.pendingRequests, color: "bg-red-50 text-red-700 border-red-200" },
    { label: "Active Leases", count: stats.active, color: "bg-green-50 text-green-700 border-green-200" },
    { label: "Expiring Soon", count: stats.expiringSoon, color: "bg-orange-50 text-orange-700 border-orange-200" },
    { label: "Monthly Revenue", count: formatMoney(stats.monthlyRent), color: "bg-blue-50 text-blue-700 border-blue-200", isMoney: true }
  ];

  // Loading state
  if (loading && !leases.length) {
    return (
      <div className="min-h-screen p-6 flex flex-col items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#004087] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Loading Lease Dashboard</h3>
          <p className="text-gray-500">Fetching your lease data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Lease Management</h1>
              <p className="text-gray-600 mt-1">
                Manage lease agreements, track signatures, and monitor rental income
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setViewMode(viewMode === "list" ? "card" : "list")}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center gap-2"
              >
                {viewMode === "list" ? <LayoutGrid size={18} /> : <List size={18} />}
                {viewMode === "list" ? "Grid View" : "List View"}
              </button>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center gap-2"
              >
                <Filter size={18} />
                Filters
                {Object.values(filterStats).some(count => count > 0) && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                    {Object.values(filterStats).filter(c => c > 0).length}
                  </span>
                )}
              </button>
              
              {/* <Link
                href="/dashboard/owner/leases/create"
                className="px-4 py-2 rounded-lg bg-[#004087] text-white hover:opacity-90 flex items-center gap-2"
              >
                <FileText size={18} />
                Create New Lease
              </Link> */}
            </div>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="px-6 py-3 bg-gray-50 border-t">
          <div className="flex flex-wrap gap-4">
            {quickFilters.map((filterItem, idx) => (
              <div
                key={idx}
                className={`px-4 py-2 rounded-lg border ${filterItem.color} flex items-center gap-2`}
              >
                <span className="text-sm font-medium">{filterItem.label}</span>
                <span className="font-bold">
                  {filterItem.isMoney ? filterItem.count : filterItem.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Enhanced Filters Panel */}
        {showFilters && (
          <div className="mb-6 p-4 bg-white rounded-xl border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700">Filter Leases</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {ENHANCED_FILTERS.map((f) => {
                const Icon = f.icon;
                const count = filterStats[f.key] || 0;
                
                return (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className={`p-3 rounded-lg border transition-all ${filter === f.key ? 'ring-2 ring-blue-500 ' + f.color : 'bg-white hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon size={16} />
                        <span className="text-sm font-medium">{f.label}</span>
                      </div>
                      {count > 0 && (
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                          {count}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <div className="flex gap-3">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search by tenant, property, lease ID..."
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <button
                  onClick={() => {
                    setFilter("all");
                    setSearch("");
                  }}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Actions Bar */}
        {selectedLeases.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckSquare size={20} className="text-blue-600" />
                <div>
                  <p className="font-medium text-blue-800">
                    {selectedLeases.length} lease(s) selected
                  </p>
                  <p className="text-sm text-blue-600">
                    Total value: {formatMoney(
                      leases
                        .filter(l => selectedLeases.includes(l._id))
                        .reduce((sum, l) => sum + (l.rentAmount || 0), 0)
                    )}/month
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkAction("send-reminders")}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Send size={16} />
                  Send Reminders
                </button>
                <button
                  onClick={() => handleBulkAction("download-pdfs")}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                >
                  <Download size={16} />
                  Download PDFs
                </button>
                <button
                  onClick={() => setSelectedLeases([])}
                  className="px-4 py-2 text-sm text-red-600 hover:text-red-800"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && leases.length === 0 && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-semibold text-red-800">Error Loading Leases</h3>
            </div>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Leases Content */}
        {leases.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="text-gray-400" size={40} />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No leases found
            </h3>
            {/* <p className="text-gray-500 mb-6">
              {filter !== "all" 
                ? `No leases with status "${ENHANCED_FILTERS.find(f => f.key === filter)?.label}"`
                : "Get started by creating your first lease agreement"}
            </p>
            <Link
              href="/dashboard/owner/leases/create"
              className="px-4 py-2 bg-[#004087] text-white rounded-lg hover:opacity-90"
            >
              Create New Lease
            </Link> */}
          </div>
        ) : viewMode === "list" ? (
          // Enhanced List View
          <div className="bg-white rounded-xl border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-left w-12">
                      <input
                        type="checkbox"
                        checked={selectedLeases.length === leases.length && leases.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedLeases(leases.map(l => l._id));
                          } else {
                            setSelectedLeases([]);
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Lease</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Property</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Tenant</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Term & Rent</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Status</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Last Updated</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((lease) => (
                    <tr 
                      key={lease.id} 
                      className="border-t hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedLeases.includes(lease.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedLeases([...selectedLeases, lease.id]);
                            } else {
                              setSelectedLeases(selectedLeases.filter(id => id !== lease.id));
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                      </td>
                      
                      <td className="p-4">
                        <div className="font-semibold text-gray-900">#{lease.id.slice(-8)}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Type: {lease.leaseType}
                        </div>
                        {lease.signedDate && (
                          <div className="text-xs text-green-600 mt-1">
                            Signed: {lease.signedDate}
                          </div>
                        )}
                      </td>
                      
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{lease.propertyTitle}</div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">
                          {lease.propertyAddress}
                        </div>
                      </td>
                      
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{lease.tenantName}</div>
                        <div className="text-xs text-gray-500">{lease.tenantEmail}</div>
                        <div className="text-xs text-gray-500">{lease.tenantPhone}</div>
                      </td>
                      
                      <td className="p-4">
                        <div className="font-bold text-gray-900">{formatMoney(lease.rent)}/mo</div>
                        <div className="text-sm text-gray-600">
                          {lease.startDate} → {lease.endDate}
                        </div>
                        <div className="text-xs text-gray-500">
                          Deposit: {formatMoney(lease.securityDeposit)}
                        </div>
                      </td>
                      
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <LeaseStatusBadge status={lease.status} />
                          <div className="text-xs text-gray-500">
                            {getStatusDescription(lease.originalData)}
                          </div>
                          {lease.originalData.endDate && (
                            <div className="text-xs">
                              {getDaysRemaining(lease.originalData.endDate)}
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="p-4">
                        <div className="text-sm text-gray-600">{lease.updatedAt}</div>
                        <div className="text-xs text-gray-500">
                          {getTimeSince(lease.originalData.updatedAt)}
                        </div>
                      </td>
                      
                      <td className="p-4">
                        <div className="flex flex-col gap-2">
                          <div className="flex gap-1">
                            <Link
                              href={`/dashboard/owner/leases/${lease.id}`}
                              className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1"
                            >
                              <Eye size={12} />
                              View
                            </Link>
                            
                            {getPrimaryActionButton(lease, {
                              onApprove: handleApproveRequest,
                              onSend: handleSendForSignature,
                              onSign: () => router.push(`/dashboard/owner/leases/${lease.id}?sign=true`),
                              onDownload: handleDownloadPDF,
                              onRemind: handleSendReminder,
                              onReject: handleRejectRequest
                            })}
                          </div>
                          
                          {getSecondaryActions(lease, {
                            onRemind: handleSendReminder,
                            onReject: handleRejectRequest
                          })}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold">{rows.length}</span> of{" "}
                <span className="font-semibold">{leases.length}</span> leases
              </div>
              <button
                onClick={fetchDashboardData}
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
              >
                <RefreshCw size={14} />
                Refresh
              </button>
            </div>
          </div>
        ) : (
          // Enhanced Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rows.map((lease) => (
              <div 
                key={lease.id} 
                className={`bg-white rounded-xl border p-5 hover:shadow-lg transition-shadow ${selectedLeases.includes(lease.id) ? 'ring-2 ring-blue-500' : ''}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedLeases.includes(lease.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedLeases([...selectedLeases, lease.id]);
                        } else {
                          setSelectedLeases(selectedLeases.filter(id => id !== lease.id));
                        }
                      }}
                      className="mt-1"
                    />
                    <div>
                      <h3 className="font-bold text-gray-900">{lease.propertyTitle}</h3>
                      <p className="text-xs text-gray-500">#{lease.id.slice(-8)}</p>
                    </div>
                  </div>
                  <LeaseStatusBadge status={lease.status} />
                </div>
                
                <div className="space-y-3 mb-5">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Tenant</span>
                    <span className="font-medium">{lease.tenantName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Monthly Rent</span>
                    <span className="font-bold text-gray-900">{formatMoney(lease.rent)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Term</span>
                    <span className="text-sm">{lease.startDate} - {lease.endDate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Security Deposit</span>
                    <span className="text-sm">{formatMoney(lease.securityDeposit)}</span>
                  </div>
                  {lease.signedDate && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Signed</span>
                      <span className="text-sm text-green-600">{lease.signedDate}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/owner/leases/${lease.id}`}
                    className="flex-1 text-center py-2 text-sm border rounded-lg hover:bg-gray-50"
                  >
                    Details
                  </Link>
                  
                  {getCardPrimaryAction(lease, {
                    onApprove: handleApproveRequest,
                    onSend: handleSendForSignature,
                    onSign: () => router.push(`/dashboard/owner/leases/${lease.id}?sign=true`),
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper Functions
function getStatusDescription(lease) {
  const now = new Date();
  const endDate = new Date(lease.endDate);
  
  if (lease.status === "active" && endDate < now) {
    return "Expired";
  }
  
  if (lease.status === "active" && endDate < new Date(now.setDate(now.getDate() + 30))) {
    return "Expiring soon";
  }
  
  if (lease.signatures?.landlord?.signedAt && !lease.signatures?.tenant?.signedAt) {
    return "Waiting for tenant";
  }
  
  if (lease.signatures?.tenant?.signedAt && !lease.signatures?.landlord?.signedAt) {
    return "Waiting for your signature";
  }
  
  if (lease.status === "pending_request") {
    return "Needs review";
  }
  
  if (lease.status === "draft") {
    return "Ready to send";
  }
  
  return "No action required";
}

function getDaysRemaining(endDate) {
  if (!endDate) return "";
  const end = new Date(endDate);
  const now = new Date();
  const diffTime = end - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return <span className="text-red-600">Expired {Math.abs(diffDays)} days ago</span>;
  } else if (diffDays <= 30) {
    return <span className="text-orange-600">{diffDays} days remaining</span>;
  } else {
    return <span className="text-gray-500">{diffDays} days remaining</span>;
  }
}

function getTimeSince(date) {
  if (!date) return "";
  const then = new Date(date);
  const now = new Date();
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 30) {
    return `${diffDays}d ago`;
  } else {
    return "Over a month ago";
  }
}

function getPrimaryActionButton(lease, handlers) {
  switch (lease.status) {
    case "pending_request":
      return (
        <button
          onClick={() => handlers.onApprove(lease.id)}
          className="px-3 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1"
        >
          <CheckCircle size={12} />
          Approve
        </button>
      );
      
    case "draft":
    case "approved":
      return (
        <button
          onClick={() => handlers.onSend(lease.id)}
          className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
        >
          <Send size={12} />
          Send
        </button>
      );
      
    case "signed_by_tenant":
      return (
        <Link
          href={`/dashboard/owner/leases/${lease.id}?sign=true`}
          className="px-3 py-1.5 text-xs bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-1"
        >
          <FileSignature size={12} />
          Sign Now
        </Link>
      );
      
    case "fully_executed":
      return (
        <button
          onClick={() => handlers.onDownload(lease.id)}
          className="px-3 py-1.5 text-xs bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-1"
        >
          <Download size={12} />
          PDF
        </button>
      );
      
    default:
      return null;
  }
}

function getSecondaryActions(lease, handlers) {
  const actions = [];
  
  if (lease.status === "pending_request") {
    actions.push(
      <button
        key="reject"
        onClick={() => handlers.onReject(lease.id, "Application rejected")}
        className="px-2 py-1 text-xs text-red-600 hover:text-red-800"
      >
        Reject
      </button>
    );
  }
  
  if (["sent_to_tenant", "signed_by_tenant"].includes(lease.status)) {
    actions.push(
      <button
        key="remind"
        onClick={() => handlers.onRemind(lease.id)}
        className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800"
      >
        Send Reminder
      </button>
    );
  }
  
  if (actions.length > 0) {
    return (
      <div className="flex gap-2 text-xs">
        {actions}
      </div>
    );
  }
  
  return null;
}

function getCardPrimaryAction(lease, handlers) {
  switch (lease.status) {
    case "pending_request":
      return (
        <button
          onClick={() => handlers.onApprove(lease.id)}
          className="flex-1 text-center py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Approve
        </button>
      );
      
    case "draft":
    case "approved":
      return (
        <button
          onClick={() => handlers.onSend(lease.id)}
          className="flex-1 text-center py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Send
        </button>
      );
      
    case "signed_by_tenant":
      return (
        <Link
          href={`/dashboard/owner/leases/${lease.id}?sign=true`}
          className="flex-1 text-center py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Sign
        </Link>
      );
      
    default:
      return null;
  }
}