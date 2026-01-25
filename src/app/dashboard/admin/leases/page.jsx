"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Download, PenTool, LayoutGrid, List } from "lucide-react";
import LeaseStatusBadge from "@/components/dashboard/Owner/leases/LeaseStatusBadge";
import { leaseService } from "@/services/lease.service";

export default function TenantLeasesPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState("list");
  const [leases, setLeases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeases();
  }, []);

  const fetchLeases = async () => {
    try {
      setLoading(true);
      const response = await leaseService.getMyLeases();
      console.log(response.data)
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

  const handleView = (id) => {
    router.push(`/dashboard/tenant/leases/${id}`);
  };

  const handleSign = (id) => {
    router.push(`/dashboard/tenant/leases/${id}/sign`);
  };

  const handleDownload = async (id) => {
    try {
      // Implement PDF download functionality
      console.log("Download lease PDF:", id);
      // You can add actual PDF generation/download logic here
    } catch (err) {
      console.error('Error downloading lease:', err);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
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
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#1F3A34]">
            All Leases
          </h1>
          <p className="text-sm text-gray-600">
            View and manage all lease agreements
          </p>
        </div>

        {/* View toggle */}
        <button
          onClick={() => setViewMode(viewMode === "list" ? "card" : "list")}
          className="px-4 py-2 rounded-full border border-gray-200 flex items-center gap-2 hover:bg-gray-50"
        >
          {viewMode === "list" ? (
            <LayoutGrid className="w-4 h-4" />
          ) : (
            <List className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Empty state */}
      {leases.length === 0 && (
        <div className="bg-white border rounded-xl p-10 text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <p className="text-gray-600">No leases assigned to you yet.</p>
        </div>
      )}

      {/* ================= LIST VIEW ================= */}
      {viewMode === "list" && leases.length > 0 && (
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-5 py-4 text-left">Property</th>
                <th className="px-5 py-4 text-left">Term</th>
                <th className="px-5 py-4 text-left">Rent</th>
                <th className="px-5 py-4 text-left">Status</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {leases.map((lease) => (
                <tr
                  key={lease._id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="px-5 py-4">
                    <div className="font-medium text-[#1F3A34]">
                      {lease.property?.title || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {lease.property?.address || 'Address not available'}
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm">
                    {lease.startDate && lease.endDate
                      ? `${new Date(lease.startDate).toLocaleDateString()} → ${new Date(lease.endDate).toLocaleDateString()}`
                      : 'Pending approval'}
                  </td>

                  <td className="px-5 py-4 font-medium">
                    ${lease.rentAmount || 0}
                  </td>

                  <td className="px-5 py-4">
                    <LeaseStatusBadge status={lease.status} />
                  </td>

                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleView(lease._id)}
                        className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-50"
                      >
                        View
                      </button>

                      {/* {lease.status === "sent_to_tenant" && (
                        <button
                          onClick={() => handleSign(lease._id)}
                          className="px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1"
                        >
                          <PenTool className="w-4 h-4" />
                          Sign
                        </button>
                      )} */}

                      {lease.status === "fully_executed" && (
                        <button
                          onClick={() => handleDownload(lease._id)}
                          className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
                        >
                          <Download className="w-4 h-4" />
                          PDF
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= CARD VIEW ================= */}
      {viewMode === "card" && leases.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leases.map((lease) => (
            <div
              key={lease._id}
              className="bg-white border rounded-xl p-5 hover:shadow-md transition"
            >
              <div className="flex justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-[#1F3A34]">
                    {lease.property?.title || 'N/A'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {lease.property?.address || 'Address not available'}
                  </p>
                </div>
                <LeaseStatusBadge status={lease.status} />
              </div>

              <div className="text-sm space-y-1 mb-4">
                <p>
                  <span className="text-gray-500">Term:</span>{" "}
                  {lease.startDate ? new Date(lease.startDate).toLocaleDateString() : '—'} →
                  {lease.endDate ? new Date(lease.endDate).toLocaleDateString() : '—'}
                </p>
                <p>
                  <span className="text-gray-500">Rent:</span> $
                  {lease.rentAmount || 0}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleView(lease._id)}
                  className="px-3 py-2 rounded-full border text-sm"
                >
                  View
                </button>

                {/* {lease.status === "sent_to_tenant" && (
                  <button
                    onClick={() => handleSign(lease._id)}
                    className="px-3 py-2 rounded-full bg-green-600 text-white text-sm"
                  >
                    Sign
                  </button>
                )} */}

                {lease.status === "fully_executed" && (
                  <button
                    onClick={() => handleDownload(lease._id)}
                    className="px-3 py-2 rounded-full bg-blue-600 text-white text-sm"
                  >
                    PDF
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