"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  FileText, 
  Download, 
  PenTool, 
  LayoutGrid, 
  List, 
  Clock,
  CheckCircle,
  AlertCircle,
  Home,
  DollarSign,
  Calendar,
  User,
  Filter,
  Search,
  PlusCircle,
  ChevronRight
} from "lucide-react";
import LeaseStatusBadge from "@/components/dashboard/Owner/leases/LeaseStatusBadge";
import { leaseService } from "@/services/lease.service";

export default function TenantLeasesPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState("list");
  const [leases, setLeases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    signed: 0
  });

  useEffect(() => {
    fetchLeases();
    fetchStats();
  }, [filterStatus]);

  const fetchLeases = async () => {
    try {
      setLoading(true);
      const response = await leaseService.getMyLeases({ 
        role: 'tenant',
        status: filterStatus === "all" ? null : filterStatus
      });
      
      if (response.success) {
        setLeases(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch leases');
      console.error('Error fetching leases:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await leaseService.getLeaseStats();
      if (response.success) {
        const data = response.data;
        setStats({
          total: data.counts.total,
          active: data.byStatus?.find(s => s.status === "active")?.count || 0,
          pending: data.byStatus?.find(s => ["pending_request", "draft", "sent_to_tenant"].includes(s.status))?.count || 0,
          signed: data.byStatus?.find(s => ["fully_executed", "signed_by_landlord"].includes(s.status))?.count || 0
        });
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleView = (id) => {
    router.push(`/dashboard/tenant/leases/${id}`);
  };

  const handleSign = (id) => {
    router.push(`/dashboard/tenant/leases/${id}/sign`);
  };

  const handleReview = (id) => {
    router.push(`/dashboard/tenant/leases/${id}/review`);
  };

  const handleApplyForProperty = () => {
    router.push("/dashboard/tenant/properties");
  };

  const handleDownload = async (id) => {
    try {
      // Implement PDF download functionality
      console.log("Download lease PDF:", id);
      alert("PDF download will be available soon");
    } catch (err) {
      console.error('Error downloading lease:', err);
    }
  };

  const filteredLeases = leases.filter(lease => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      lease.property?.title?.toLowerCase().includes(query) ||
      lease.property?.address?.toLowerCase().includes(query) ||
      lease.status?.toLowerCase().includes(query) ||
      lease._id?.toLowerCase().includes(query)
    );
  });

  const getActionButton = (lease) => {
    switch (lease.status) {
      case "pending_request":
        return (
          <button
            disabled
            className="px-3 py-2 text-sm border rounded-lg text-gray-500 cursor-not-allowed"
          >
            <Clock className="w-4 h-4 inline mr-1" />
            Pending Approval
          </button>
        );
      
      case "under_review":
        return (
          <button
            disabled
            className="px-3 py-2 text-sm border rounded-lg text-yellow-600 border-yellow-200 bg-yellow-50 cursor-not-allowed"
          >
            <AlertCircle className="w-4 h-4 inline mr-1" />
            Under Review
          </button>
        );
      
      case "approved":
        return (
          <button
            disabled
            className="px-3 py-2 text-sm border rounded-lg text-blue-600 border-blue-200 bg-blue-50 cursor-not-allowed"
          >
            <CheckCircle className="w-4 h-4 inline mr-1" />
            Draft Coming Soon
          </button>
        );
      
      case "draft":
        return (
          <button
            disabled
            className="px-3 py-2 text-sm border rounded-lg text-gray-600 border-gray-200 bg-gray-50 cursor-not-allowed"
          >
            <FileText className="w-4 h-4 inline mr-1" />
            Landlord Preparing
          </button>
        );
      
      case "sent_to_tenant":
        return (
          <button
            onClick={() => handleReview(lease._id)}
            className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
          >
            <PenTool className="w-4 h-4" />
            Review & Sign
          </button>
        );
      
      // case "signed_by_landlord":
      //   return (
      //     <button
      //       onClick={() => handleSign(lease._id)}
      //       className="px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1"
      //     >
      //       <PenTool className="w-4 h-4" />
      //       Sign Now
      //     </button>
      //   );
      
      case "fully_executed":
        return (
          <button
            onClick={() => handleDownload(lease._id)}
            className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        );
      
      case "active":
        return (
          <button
            onClick={() => handleView(lease._id)}
            className="px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1"
          >
            <Home className="w-4 h-4" />
            Active Lease
          </button>
        );
      
      default:
        return (
          <button
            onClick={() => handleView(lease._id)}
            className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-50"
          >
            View Details
          </button>
        );
    }
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      pending_request: "bg-yellow-100 text-yellow-800 border-yellow-200",
      under_review: "bg-orange-100 text-orange-800 border-orange-200",
      approved: "bg-blue-100 text-blue-800 border-blue-200",
      draft: "bg-gray-100 text-gray-800 border-gray-200",
      sent_to_tenant: "bg-purple-100 text-purple-800 border-purple-200",
      changes_requested: "bg-orange-100 text-orange-800 border-orange-200",
      sent_to_landlord: "bg-blue-100 text-blue-800 border-blue-200",
      signed_by_landlord: "bg-indigo-100 text-indigo-800 border-indigo-200",
      signed_by_tenant: "bg-green-100 text-green-800 border-green-200",
      fully_executed: "bg-green-100 text-green-800 border-green-200",
      active: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
      expired: "bg-gray-100 text-gray-800 border-gray-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending_request: "Pending Approval",
      under_review: "Under Review",
      approved: "Approved",
      draft: "Draft",
      sent_to_tenant: "Action Required",
      changes_requested: "Changes Requested",
      sent_to_landlord: "With Landlord",
      signed_by_landlord: "Ready to Sign",
      signed_by_tenant: "You Signed",
      fully_executed: "Fully Executed",
      active: "Active",
      cancelled: "Cancelled",
      expired: "Expired",
      rejected: "Rejected",
    };
    return statusMap[status] || status;
  };

  if (loading && leases.length === 0) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error && leases.length === 0) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-600">Error: {error}</p>
          <button
            onClick={fetchLeases}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header with Stats */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-[#1F3A34]">
              My Leases & Applications
            </h1>
            <p className="text-sm text-gray-600">
              Track and manage all your rental applications and leases
            </p>
          </div>

          <div className="flex gap-3 mt-4 md:mt-0">
            <button
              onClick={() => setViewMode(viewMode === "list" ? "card" : "list")}
              className="px-4 py-2 rounded-full border border-gray-200 flex items-center gap-2 hover:bg-gray-50"
            >
              {viewMode === "list" ? (
                <LayoutGrid className="w-4 h-4" />
              ) : (
                <List className="w-4 h-4" />
              )}
              {viewMode === "list" ? "Grid View" : "List View"}
            </button>
            
            <button
              onClick={handleApplyForProperty}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Apply for Property
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Leases</p>
                <p className="text-2xl font-bold text-[#1F3A34]">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Leases</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <Home className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Actions</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-white border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Signed Leases</p>
                <p className="text-2xl font-bold text-purple-600">{stats.signed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white border rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by property name, address, or status..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending_request">Pending Approval</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="sent_to_tenant">Action Required</option>
                <option value="signed_by_landlord">Ready to Sign</option>
                <option value="active">Active Leases</option>
                <option value="fully_executed">Fully Executed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {filteredLeases.length === 0 && (
        <div className="bg-white border rounded-xl p-10 text-center">
          <FileText className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {searchQuery || filterStatus !== "all" 
              ? "No matching leases found" 
              : "No leases or applications yet"}
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {searchQuery || filterStatus !== "all" 
              ? "Try changing your search or filter criteria" 
              : "Start by applying for a property to begin the lease process"}
          </p>
          {!searchQuery && filterStatus === "all" && (
            <button
              onClick={handleApplyForProperty}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 mx-auto"
            >
              <PlusCircle className="w-5 h-5" />
              Browse Available Properties
            </button>
          )}
        </div>
      )}

      {/* ================= LIST VIEW ================= */}
      {viewMode === "list" && filteredLeases.length > 0 && (
        <div className="bg-white border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4 text-left">Property</th>
                  <th className="px-6 py-4 text-left">Lease Terms</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Next Action</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeases.map((lease) => (
                  <tr
                    key={lease._id}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Home className="w-6 h-6 text-gray-500" />
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-[#1F3A34] hover:text-blue-600 cursor-pointer" 
                               onClick={() => handleView(lease._id)}>
                            {lease.property?.title || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {lease.property?.address || 'Address not available'}
                          </div>
                          <div className="flex items-center gap-2 mt-2 text-xs">
                            {lease.property?.bedrooms && (
                              <span className="flex items-center gap-1">
                                <Home className="w-3 h-3" /> {lease.property.bedrooms}bd
                              </span>
                            )}
                            {lease.property?.bathrooms && (
                              <span className="flex items-center gap-1">
                                <span>•</span> {lease.property.bathrooms}ba
                              </span>
                            )}
                            {lease.property?.area && (
                              <span className="flex items-center gap-1">
                                <span>•</span> {lease.property.area} sqft
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">
                            {lease.startDate && lease.endDate
                              ? `${new Date(lease.startDate).toLocaleDateString()} - ${new Date(lease.endDate).toLocaleDateString()}`
                              : 'To be determined'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">
                            ${lease.rentAmount?.toLocaleString() || 0}
                            <span className="text-xs text-gray-500 ml-1">/month</span>
                          </span>
                        </div>
                        {lease.securityDeposit > 0 && (
                          <div className="text-xs text-gray-500">
                            Deposit: ${lease.securityDeposit?.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(lease.status)}`}>
                          {getStatusText(lease.status)}
                        </span>
                        <div className="text-xs text-gray-500">
                          Updated: {new Date(lease.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="text-sm text-gray-700">
                        {(() => {
                          switch (lease.status) {
                            case "pending_request":
                              return "Waiting for landlord to review";
                            case "under_review":
                              return "Landlord reviewing application";
                            case "approved":
                              return "Draft lease coming soon";
                            case "draft":
                              return "Landlord preparing lease";
                            case "sent_to_tenant":
                              return "Review and sign lease";
                            case "signed_by_landlord":
                              return "Sign to finalize lease";
                            case "fully_executed":
                              return "Schedule move-in";
                            case "active":
                              return "Lease is active";
                            default:
                              return "No action required";
                          }
                        })()}
                      </div>
                    </td>

                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleView(lease._id)}
                          className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-50 flex items-center gap-1"
                        >
                          <ChevronRight className="w-4 h-4" />
                          View
                        </button>
                        {getActionButton(lease)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= CARD VIEW ================= */}
      {viewMode === "card" && filteredLeases.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeases.map((lease) => (
            <div
              key={lease._id}
              className="bg-white border rounded-xl p-5 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Home className="w-4 h-4 text-gray-600" />
                    </div>
                    <h3 className="font-semibold text-[#1F3A34] hover:text-blue-600 cursor-pointer"
                        onClick={() => handleView(lease._id)}>
                      {lease.property?.title || 'N/A'}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {lease.property?.address || 'Address not available'}
                  </p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(lease.status)}`}>
                  {getStatusText(lease.status)}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-500">Lease Term</span>
                    </div>
                    <div className="text-sm font-medium">
                      {lease.startDate && lease.endDate
                        ? `${new Date(lease.startDate).getFullYear()}-${new Date(lease.endDate).getFullYear()}`
                        : 'Pending'}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-500">Monthly Rent</span>
                    </div>
                    <div className="text-sm font-medium">
                      ${lease.rentAmount?.toLocaleString() || 0}
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-medium text-blue-700">Next Step</span>
                  </div>
                  <p className="text-xs text-blue-600">
                    {(() => {
                      switch (lease.status) {
                        case "sent_to_tenant":
                          return "Review and sign the lease agreement";
                        case "signed_by_landlord":
                          return "Sign to finalize the lease";
                        case "pending_request":
                          return "Waiting for landlord review";
                        default:
                          return "Check lease details";
                      }
                    })()}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleView(lease._id)}
                  className="flex-1 px-3 py-2 rounded-lg border text-sm hover:bg-gray-50"
                >
                  View Details
                </button>
                {lease.status === "sent_to_tenant" && (
                  <button
                    onClick={() => handleReview(lease._id)}
                    className="flex-1 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
                  >
                    Review
                  </button>
                )}
                {lease.status === "signed_by_landlord" && (
                  <button
                    onClick={() => handleSign(lease._id)}
                    className="flex-1 px-3 py-2 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700"
                  >
                    Sign Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Info */}
      {filteredLeases.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-500">
          Showing {filteredLeases.length} of {leases.length} leases
        </div>
      )}
    </div>
  );
}