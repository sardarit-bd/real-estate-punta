// frontend/src/app/dashboard/owner/leases/page.js
"use client";

import LeaseStatusBadge from "@/components/dashboard/Owner/leases/LeaseStatusBadge";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutGrid, List, Loader2 } from "lucide-react";
import { leaseService } from "@/services/lease.service";
import toast from "react-hot-toast";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "pending_request", label: "Pending Requests" },
  { key: "draft", label: "Drafts" },
  { key: "sent_to_tenant", label: "Sent" },
  { key: "signed_by_landlord", label: "Owner Signed" },
  { key: "changes_requested", label: "Changes" },
  { key: "signed_by_tenant", label: "Tenant Signed" },
  { key: "fully_executed", label: "Executed" },
  { key: "cancelled", label: "Cancelled" },
  { key: "expired", label: "Expired" },
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


export default function LeasesPage() {
  const router = useRouter();
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [selectedLeases, setSelectedLeases] = useState([]);
  const [leases, setLeases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pendingSignatures: 0,
    active: 0,
    expiringSoon: 0
  });

  useEffect(() => {
    fetchLeases();
    fetchStats();
  }, [filter]);

  const fetchLeases = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching leases with filter:', filter);

      const res = await leaseService.getMyLeases({
        role: "landlord",
        status: filter !== "all" ? filter : undefined,
      });

      if (res.success) {
        setLeases(res.data || []);

        // Update stats based on fetched data
        updateStatsFromLeases(res.data || []);
      } else {
        setError(res.message || 'Failed to fetch leases');
      }
    } catch (err) {
      console.error("Failed to fetch leases", err);
      setError(err.message || 'Failed to fetch leases');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await leaseService.getLeaseStats();
      if (res.success) {
        setStats({
          total: res.data.counts?.total || 0,
          pendingSignatures:
            res.data.byStatus?.find(s =>
              ["sent_to_tenant", "signed_by_tenant"].includes(s.status)
            )?.count || 0,
          active: res.data.byStatus?.find(s => s.status === 'fully_executed')?.count || 0,
          expiringSoon: res.data.expiringSoon || 0
        });
      }
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  };

  const updateStatsFromLeases = (leasesData) => {
    const pendingSignatures = leasesData.filter(l => l.status === 'sent_to_tenant').length;
    const active = leasesData.filter(l => l.status === 'fully_executed').length;
    const expiringSoon = leasesData.filter(l => {
      if (l.status !== 'fully_executed' || !l.endDate) return false;
      const endDate = new Date(l.endDate);
      const now = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(now.getDate() + 30);
      return endDate >= now && endDate <= thirtyDaysFromNow;
    }).length;

    setStats(prev => ({
      ...prev,
      total: leasesData.length,
      pendingSignatures,
      active,
      expiringSoon
    }));
  };

  const rows = useMemo(() => {
    const text = q.trim().toLowerCase();

    return leases
      .filter(l => {
        if (!text) return true;
        return (
          l._id.toLowerCase().includes(text) ||
          l.property?.title?.toLowerCase().includes(text) ||
          l.property?.address?.toLowerCase().includes(text) ||
          l.tenant?.name?.toLowerCase().includes(text)
        );
      })
      .map(l => {
        const rentValue = l.rentAmount || l.property?.price || 0;
        return {
          id: l._id,
          propertyTitle: l.property?.title || 'N/A',
          propertyAddress: `${l.property?.address || ""}, ${l.property?.city || ""}`,
          tenantName: l.tenant?.name || 'N/A',
          tenantEmail: l.tenant?.email || 'N/A',
          rent: rentValue,
          status: l.status || 'draft',
          startDate: l.startDate ? new Date(l.startDate).toLocaleDateString() : 'Not set',
          endDate: l.endDate ? new Date(l.endDate).toLocaleDateString() : 'Not set',
          updatedAt: l.updatedAt ? new Date(l.updatedAt).toLocaleDateString() : 'N/A',
          signedDate:
            l.signatures?.tenant?.signedAt &&
              l.signatures?.landlord?.signedAt
              ? new Date(
                l.signatures.tenant.signedAt
              ).toLocaleDateString()
              : null,
          isFullySigned: l.signatures?.tenant?.signedAt && l.signatures?.landlord?.signedAt,
          leaseType: l.rentFrequency === 'monthly' ? 'fixed_term' : 'variable',
          paymentDay: 1,
          securityDeposit: l.securityDeposit || 0,
          landlordName: l.landlord?.name || 'N/A',
        }
      });
  }, [leases, q]);

  const handleSendForSignature = async (leaseId) => {
    try {
      console.log('Sending lease for signature:', leaseId);
      const response = await leaseService.sendToTenant(leaseId, "Please review and sign the lease agreement.");

      if (response.success) {
        toast.success('Lease sent to tenant successfully!');
        fetchLeases(); // Refresh the list
      }
    } catch (error) {
      console.error('Error sending lease:', error);
      toast.error(error.response?.data?.message || 'Failed to send lease');
    }
  };

  const handleDownloadPDF = (leaseId) => {
    console.log('Downloading PDF for lease:', leaseId);
    // Implement PDF download logic here
  };

  const handleApproveRequest = async (leaseId) => {
    try {
      console.log('Approving lease request:', leaseId);
      const response = await leaseService.approveRequest(leaseId);

      if (response.success) {
        toast.success('Request approved! Lease draft created.');
        fetchLeases(); // Refresh the list
      }
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error(error.response?.data?.message || 'Failed to approve request');
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#004087]" />
          <p className="text-gray-600">Loading leases...</p>
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
            <h3 className="text-lg font-semibold text-red-800">Error Loading Leases</h3>
          </div>

          <p className="text-red-600 mb-4">{error}</p>

          <button
            onClick={fetchLeases}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header with Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[#1F3A34]">Lease Management</h1>
          <p className="text-sm text-gray-600">
            Create, manage, and track lease agreements with e-signature capabilities
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Link
            href="/dashboard/owner/leases/create"
            className="px-4 py-2 rounded-full bg-[#004087] text-white text-sm font-medium hover:opacity-95 flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Lease
          </Link>

          <button
            onClick={() => setViewMode(viewMode === "list" ? "card" : "list")}
            className="px-4 py-2 rounded-full border border-gray-200 text-sm hover:bg-gray-50 flex items-center gap-2 transition"
          >
            {viewMode === "list" ? (
              <>
                <LayoutGrid className="w-4 h-4" />
              </>
            ) : (
              <>
                <List className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border">
          <p className="text-sm text-gray-500">Total Leases</p>
          <p className="text-2xl font-bold text-[#1F3A34]">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border">
          <p className="text-sm text-gray-500">Pending Signatures</p>
          <p className="text-2xl font-bold text-orange-600">
            {stats.pendingSignatures}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border">
          <p className="text-sm text-gray-500">Active</p>
          <p className="text-2xl font-bold text-green-600">
            {stats.active}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border">
          <p className="text-sm text-gray-500">Expiring Soon</p>
          <p className="text-2xl font-bold text-red-600">
            {stats.expiringSoon}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-6 p-4 bg-white rounded-xl border">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2 rounded-full text-sm border transition
                  ${filter === f.key ? "bg-[#1F3A34] text-white border-[#1F3A34]" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"}`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* <div className="flex gap-2">
            <div className="w-full lg:w-[360px]">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by lease ID, tenant, address..."
                className="w-full px-4 py-2 rounded-2xl border border-gray-200 outline-none focus:border-[#004087]"
              />
            </div>
            <button className="px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
          </div> */}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedLeases.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-blue-800">
              {selectedLeases.length} lease(s) selected
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Send for Signature
              </button>
              <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                Download PDFs
              </button>
              <button
                onClick={() => setSelectedLeases([])}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lease List/Card View */}
      {viewMode === "list" ? (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-xs uppercase tracking-wide text-gray-600">
                  <th className="px-5 py-4 w-10">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedLeases(rows.map(l => l.id));
                        } else {
                          setSelectedLeases([]);
                        }
                      }}
                    />
                  </th>
                  <th className="px-5 py-4">Lease ID</th>
                  <th className="px-5 py-4">Property</th>
                  <th className="px-5 py-4">Tenant</th>
                  <th className="px-5 py-4">Term</th>
                  <th className="px-5 py-4">Rent</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td className="px-5 py-10 text-center text-gray-500" colSpan={8}>
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p>No leases found.</p>
                        <button
                          onClick={() => router.push('/dashboard/owner/leases/create')}
                          className="mt-2 text-[#004087] hover:underline"
                        >
                          Create your first lease
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  rows.map((l) => (
                    <tr key={l.id} className="border-t border-gray-100 hover:bg-gray-50/60 transition">
                      <td className="px-5 py-4">
                        <input
                          type="checkbox"
                          checked={selectedLeases.includes(l.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedLeases([...selectedLeases, l.id]);
                            } else {
                              setSelectedLeases(selectedLeases.filter(id => id !== l.id));
                            }
                          }}
                        />
                      </td>

                      <td className="px-5 py-4">
                        <div className="font-semibold text-[#1F3A34]">{l.id}</div>
                        <div className="text-xs text-gray-500">Updated: {l.updatedAt}</div>
                        {l.signedDate && (
                          <div className="text-xs text-green-600">Signed: {l.signedDate}</div>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <div className="font-medium text-gray-800">{l.propertyTitle}</div>
                        <div className="text-xs text-gray-500">{l.propertyAddress}</div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="font-medium text-gray-800">{l.tenantName}</div>
                        <div className="text-xs text-gray-500">{l.tenantEmail}</div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="text-sm text-gray-800">
                          {l.startDate} → {l.endDate}
                        </div>
                        <div className="text-xs text-gray-500">
                          {l.leaseType === 'fixed_term' ? 'Fixed Term' : 'Month-to-Month'}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="font-semibold text-gray-800">{formatMoney(l.rent)}</div>
                        <div className="text-xs text-gray-500">Due day {l.paymentDay}</div>
                        <div className="text-xs text-gray-500">Deposit: {formatMoney(l.securityDeposit)}</div>
                      </td>

                      <td className="px-5 py-4">
                        <LeaseStatusBadge status={l.status} />
                        <div className="text-xs text-gray-500 mt-1">
                          {l.isFullySigned
                            ? "Fully Signed"
                            : l.signatures?.landlord?.signedAt
                              ? "Owner Signed"
                              : l.signatures?.tenant?.signedAt
                                ? "Tenant Signed"
                                : "Not Signed"}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/dashboard/owner/leases/${l.id}`}
                            className="px-3 py-2 rounded-full text-sm border border-gray-200 hover:bg-white flex items-center"
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View
                          </Link>

                          {l.status === "signed_by_tenant" && !l.signatures?.landlord?.signedAt && (
                            <Link
                              href={`/dashboard/owner/leases/${l.id}?sign=true`}
                              className="px-3 py-2 rounded-full text-sm bg-purple-600 text-white hover:opacity-95 flex items-center"
                            >
                              Sign
                            </Link>
                          )}

                          {l.status === "pending_request" && (
                            <button
                              onClick={() => handleApproveRequest(l.id)}
                              className="px-3 py-2 rounded-full text-sm bg-green-600 text-white hover:opacity-95 flex items-center"
                            >
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Approve
                            </button>
                          )}

                          {(l.status === "draft" || l.status === "changes_requested") && (
                            <Link
                              href={`/dashboard/owner/leases/${l.id}/edit`}
                              className="px-3 py-2 rounded-full text-sm border border-gray-200 hover:bg-white flex items-center"
                            >
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </Link>
                          )}

                          {l.status === "draft" && (
                            <button
                              onClick={() => handleSendForSignature(l.id)}
                              className="px-3 py-2 rounded-full text-sm bg-blue-600 text-white hover:opacity-95 flex items-center"
                            >
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                              </svg>
                              Send
                            </button>
                          )}

                          {l.status === "fully_executed" && (
                            <button
                              onClick={() => handleDownloadPDF(l.id)}
                              className="px-3 py-2 rounded-full text-sm bg-green-600 text-white hover:opacity-95 flex items-center"
                            >
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              PDF
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-4 text-xs text-gray-500 bg-white border-t border-gray-100">
            Showing <span className="font-semibold">{rows.length}</span> lease(s)
          </div>
        </div>
      ) : (
        // Card View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rows.map((lease) => (
            <div key={lease.id} className="bg-white rounded-xl border p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-[#1F3A34]">{lease.propertyTitle}</h3>
                  <p className="text-sm text-gray-500">{lease.id}</p>
                </div>
                <LeaseStatusBadge status={lease.status} />
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tenant</span>
                  <span className="font-medium">{lease.tenantName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Rent</span>
                  <span className="font-medium">{formatMoney(lease.rent)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Term</span>
                  <span className="font-medium">{lease.startDate} - {lease.endDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Signed</span>
                  <span className="font-medium">{lease.signedDate || 'Not signed'}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/dashboard/owner/leases/${lease.id}`}
                  className="flex-1 text-center py-2 border rounded-lg text-sm hover:bg-gray-50"
                >
                  View
                </Link>

                {lease.status === 'pending_request' && (
                  <button
                    onClick={() => handleApproveRequest(lease.id)}
                    className="flex-1 text-center py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                  >
                    Approve
                  </button>
                )}

                {(lease.status === 'draft' || lease.status === 'changes_requested') && (
                  <Link
                    href={`/dashboard/owner/leases/${lease.id}/edit`}
                    className="px-3 py-2 rounded-full text-sm border border-gray-200 hover:bg-white"
                  >
                    Edit
                  </Link>
                )}

                {lease.status === 'draft' && (
                  <button
                    onClick={() => handleSendForSignature(lease.id)}
                    className="flex-1 text-center py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
                  >
                    Send
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}