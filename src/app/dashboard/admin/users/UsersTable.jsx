// components/admin/UsersTable.js
'use client';

import { useState } from 'react';
import UserDetailsModal from './UserDetailsModal';
import DocumentViewer from './DocumentViewer';
import UserRow from './UserRow';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function UsersTable({ users: initialUsers }) {
    const [users, setUsers] = useState(initialUsers);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showDocumentModal, setShowDocumentModal] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [filterRole, setFilterRole] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const handleViewDetails = (user) => {
        setSelectedUser(user);
        setShowDetailsModal(true);
    };

    const handleViewDocument = (document) => {
        console.log(document)
        setSelectedDocument(document);
        setShowDocumentModal(true);
    };

    const handleVerifyUser = async (userId) => {
        try {
            // Simulate API call
            const response = await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/verification`, {
                user: userId
            }, {
                withCredentials: true
            });

            console.log(response)

            if (response.status === 201) {
                setUsers(users.map(user =>
                    user._id === userId
                        ? { ...user, verified: true }
                        : user
                ));
                toast.success("User is verified!")
            }
        } catch (error) {
            console.error('Failed to verify user:', error);
        }
    };

    // Filter users
    const filteredUsers = users.filter(user => {
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        const matchesStatus = filterStatus === 'all' ||
            (filterStatus === 'verified' ? user.verified : !user.verified);
        const matchesSearch = searchQuery === '' ||
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesRole && matchesStatus && matchesSearch;
    });

    // Count stats
    const totalUsers = users.length;
    const verifiedUsers = users.filter(u => u.verified).length;
    const pendingUsers = users.filter(u => !u.verified).length;

    return (
        <>
            <div className="p-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Users</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{totalUsers}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.67 3.137a6 6 0 00-11.34 0" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Verified Users</p>
                                <p className="text-3xl font-bold text-green-600 mt-2">{verifiedUsers}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Pending Verification</p>
                                <p className="text-3xl font-bold text-yellow-600 mt-2">{pendingUsers}</p>
                            </div>
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div className="flex flex-wrap gap-4">
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        >
                            <option value="all">All Roles</option>
                            <option value="tenant">Tenant</option>
                            <option value="owner">Owner</option>
                            <option value="super_admin">Super Admin</option>
                        </select>

                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        >
                            <option value="all">All Status</option>
                            <option value="verified">Verified</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>

                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                        <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documents</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map((user) => (
                                <UserRow
                                    key={user._id}
                                    user={user}
                                    onViewDetails={handleViewDetails}
                                    onViewDocument={handleViewDocument}
                                    onVerifyUser={handleVerifyUser}
                                />
                            ))}
                        </tbody>
                    </table>

                    {filteredUsers.length === 0 && (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="mt-4 text-gray-500">No users found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {showDetailsModal && (
                <UserDetailsModal
                    user={selectedUser}
                    onClose={() => setShowDetailsModal(false)}
                    onViewDocument={handleViewDocument}
                    onVerifyUser={handleVerifyUser}
                />
            )}

            {showDocumentModal && (
                <DocumentViewer
                    document={selectedDocument}
                    onClose={() => setShowDocumentModal(false)}
                />
            )}
        </>
    );
}