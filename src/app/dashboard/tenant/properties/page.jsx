"use client";

import Link from "next/link";
import { PlusCircle, Home, Eye, Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function OwnerPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Temporary dummy data (later API দিয়ে replace করবে)
  useEffect(() => {
    setTimeout(() => {
      setProperties([
        {
          id: "PR-001",
          title: "Luxury Villa Punta Cana",
          location: "Punta Cana",
          price: "$350 / night",
          status: "Active",
        },
        {
          id: "PR-002",
          title: "Beachfront Condo",
          location: "Bavaro",
          price: "$220 / night",
          status: "Pending",
        },
        {
          id: "PR-003",
          title: "Golf Course Villa",
          location: "Cap Cana",
          price: "$450 / night",
          status: "Inactive",
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#1F3A34]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ================= Header ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#113B28]">
            My Properties
          </h1>
          <p className="text-gray-500 text-sm">
            Manage all your listed properties
          </p>
        </div>

        {/* <Link
          href="/dashboard/owner/properties/add"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#004087] text-white text-sm font-medium hover:opacity-95"
        >
          <PlusCircle size={18} />
          Add New Property
        </Link> */}
      </div>

      {/* ================= Table ================= */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs uppercase tracking-wide text-gray-600">
                <th className="px-5 py-4">Property</th>
                <th className="px-5 py-4">Location</th>
                <th className="px-5 py-4">Price</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {properties.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    No properties found.
                  </td>
                </tr>
              ) : (
                properties.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-[#113B28]/10 flex items-center justify-center">
                          <Home size={18} className="text-[#113B28]" />
                        </div>
                        <div>
                          <div className="font-semibold text-[#113B28]">
                            {p.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {p.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-gray-700">
                      {p.location}
                    </td>

                    <td className="px-5 py-4 font-semibold text-gray-800">
                      {p.price}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium
                          ${
                            p.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : p.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-700"
                          }
                        `}
                      >
                        {p.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/dashboard/owner/properties/${p.id}`}
                          className="px-3 py-2 rounded-full text-sm border border-gray-200 hover:bg-white"
                        >
                          <Eye size={14} />
                        </Link>

                        <Link
                          href={`/dashboard/owner/properties/${p.id}/edit`}
                          className="px-3 py-2 rounded-full text-sm border border-gray-200 hover:bg-white"
                        >
                          <Edit size={14} />
                        </Link>

                        <button
                          className="px-3 py-2 rounded-full text-sm border border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-4 text-xs text-gray-500 bg-white border-t border-gray-100">
          Showing <span className="font-semibold">{properties.length}</span>{" "}
          property(s)
        </div>
      </div>
    </div>
  );
}
