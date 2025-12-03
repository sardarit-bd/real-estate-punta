"use client";

import { useState, useMemo } from "react";
import {
  Star,
  Trash2,
  Ban,
  Eye,
  Calendar,
  Home,
  Layers,
  ShieldCheck,
  Check,
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ManageUsers() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Carter",
      email: "john@example.com",
      avatar: "/images/user-1.avif",
      role: "owner",
      premium: true,
      status: "active",
      joinDate: "2024-08-11",
      totalListings: 24,
      pendingListings: 4,
    },
    {
      id: 2,
      name: "Sarah Wilson",
      email: "sarah@example.com",
      avatar: "/images/user-2.avif",
      role: "buyer",
      premium: false,
      status: "active",
      joinDate: "2024-05-28",
      totalListings: 0,
      pendingListings: 0,
    },
    {
      id: 3,
      name: "Michael Green",
      email: "m.green@example.com",
      avatar: "/images/man.avif",
      role: "admin",
      premium: false,
      status: "blocked",
      joinDate: "2024-01-14",
      totalListings: 2,
      pendingListings: 1,
    },
    {
      id: 4,
      name: "Sarah Wilson",
      email: "sarah@example.com",
      avatar: "/images/user-2.avif",
      role: "buyer",
      premium: false,
      status: "active",
      joinDate: "2024-05-28",
      totalListings: 0,
      pendingListings: 0,
    },
      {
      id: 5,
      name: "John Carter",
      email: "john@example.com",
      avatar: "/images/user-1.avif",
      role: "owner",
      premium: true,
      status: "active",
      joinDate: "2024-08-11",
      totalListings: 24,
      pendingListings: 4,
    },
    {
      id: 6,
      name: "Michael Green",
      email: "m.green@example.com",
      avatar: "/images/man.avif",
      role: "admin",
      premium: false,
      status: "blocked",
      joinDate: "2024-01-14",
      totalListings: 2,
      pendingListings: 1,
    },
    {
      id: 7,
      name: "Sarah Wilson",
      email: "sarah@example.com",
      avatar: "/images/user-2.avif",
      role: "buyer",
      premium: false,
      status: "active",
      joinDate: "2024-05-28",
      totalListings: 0,
      pendingListings: 0,
    },
  ]);

  const [searchText, setSearchText] = useState("");
  const [roleModal, setRoleModal] = useState(null);

  // ❇ Filter users by search text
  const filteredUsers = useMemo(() => {
    return users.filter((u) =>
      `${u.name} ${u.email} ${u.role}`
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );
  }, [searchText, users]);

  // ✅ BLOCK / UNBLOCK USER
  const toggleBlock = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "active" ? "blocked" : "active" }
          : u
      )
    );
  };

  // ❌ DELETE USER
  const deleteUser = (id) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  // 🔁 CHANGE ROLE
  const changeUserRole = (id, newRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
    );
    setRoleModal(null);
  };

  return (
    <section className="px-5 py-10">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-[#05314A]">Manage Users</h1>

        {/* SEARCH BAR */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#E7C464]/50"
          />
        </div>
      </div>

      {/* USER GRID */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-7">
        {filteredUsers.map((user) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border p-6 relative"
          >
            {/* PREMIUM BADGE */}
            {/* {user.premium && (
              <div className="absolute top-4 right-4 bg-[#E7C464] text-[#05314A] px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                <Star size={14} /> Premium
              </div>
            )} */}

            {/* AVATAR */}
            <div className="text-center mb-5">
              <img
                src={user.avatar}
                className="w-20 h-20 rounded-full mx-auto object-cover shadow"
              />
              <h2 className="mt-3 text-lg font-semibold text-[#05314A]">
                {user.name}
              </h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>

            {/* Role + Status */}
            <div className="flex justify-center gap-3 mb-5">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  user.role === "admin"
                    ? "bg-red-100 text-red-600"
                    : user.role === "owner"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                {user.role}
              </span>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  user.status === "active"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {user.status}
              </span>
            </div>

            {/* DETAILS */}
            <div className="space-y-2 text-gray-700 text-sm mb-5">
              <p className="flex items-center gap-2">
                <Calendar size={16} /> Joined: <strong>{user.joinDate}</strong>
              </p>

              <p className="flex items-center gap-2">
                <Home size={16} /> Total Listings:
                <strong>{user.totalListings}</strong>
              </p>

              <p className="flex items-center gap-2">
                <Layers size={16} /> Pending Listings:
                <strong>{user.pendingListings}</strong>
              </p>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-between pt-5 border-t">
              <button
                onClick={() => setRoleModal(user)}
                className="px-4 py-2 rounded-lg bg-[#E7C464] text-black text-sm hover:bg-[#d9b452]"
              >
               Change Role
              </button>

              <button
                onClick={() => toggleBlock(user.id)}
                className={`p-2 rounded-lg ${
                  user.status === "blocked"
                    ? "bg-green-100 text-green-600 hover:bg-green-200"
                    : "bg-red-100 text-red-600 hover:bg-red-200"
                }`}
              >
                <Ban size={18} />
              </button>

              <button
                onClick={() => deleteUser(user.id)}
                className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>


      {/* ================= ROLE MODAL ================= */}
      <AnimatePresence>
        {roleModal && (
          <Modal onClose={() => setRoleModal(null)}>
            <h2 className="text-xl font-bold text-[#05314A] mb-4">
              Change User Role
            </h2>

            <div className="space-y-3">
              {["admin", "owner", "buyer"].map((r) => (
                <button
                  key={r}
                  onClick={() => changeUserRole(roleModal.id, r)}
                  className="w-full flex justify-between items-center px-4 py-3 border rounded-lg hover:bg-gray-100"
                >
                  <span className="capitalize">{r}</span>
                  {roleModal.role === r && <Check />}
                </button>
              ))}
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </section>
  );
}

/* REUSABLE MODAL COMPONENT */
function Modal({ children, onClose }) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {children}

        <button
          onClick={onClose}
          className="mt-6 px-6 py-2 rounded-lg bg-[#05314A] text-white w-full"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}
