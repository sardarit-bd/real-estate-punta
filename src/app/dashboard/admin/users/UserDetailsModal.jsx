// components/admin/UserDetailsModal.js
export default function UserDetailsModal({ user, onClose, onViewDocument, onVerifyUser }) {
  const profile = user.tenantProfile || user.ownerProfile || {};
  const documents = profile?.documents || [];
  
  const getRoleColor = (role) => {
    switch(role) {
      case 'super_admin': return 'text-purple-600 bg-purple-50';
      case 'owner': return 'text-blue-600 bg-blue-50';
      case 'tenant': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity bg-gray-900/70 bg-opacity-75" onClick={onClose}></div>
        
        {/* Modal panel */}
        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-2xl shadow-xl relative z-10">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">User Details</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* User Info */}
              <div className="md:col-span-2">
                <div className="flex items-start space-x-4">
                  {user.avatar ? (
                    <img className="h-20 w-20 rounded-full object-cover" src={user.avatar} alt={user.name} />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-2xl text-gray-600 font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                    <p className="text-gray-600">{user.email}</p>
                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                      {user.role.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Profile Info */}
                {profile && (profile.address || profile.phone || profile.city) && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Profile Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {profile.address && (
                        <div>
                          <p className="text-sm text-gray-500">Address</p>
                          <p className="text-gray-900">{profile.address}</p>
                        </div>
                      )}
                      {profile.city && (
                        <div>
                          <p className="text-sm text-gray-500">City</p>
                          <p className="text-gray-900">{profile.city}</p>
                        </div>
                      )}
                      {profile.country && (
                        <div>
                          <p className="text-sm text-gray-500">Country</p>
                          <p className="text-gray-900">{profile.country}</p>
                        </div>
                      )}
                      {profile.phone && (
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="text-gray-900">{profile.phone}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Status & Actions */}
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Account Status</h4>
                  <div className="flex items-center">
                    {user.isVerified ? (
                      <div className="flex items-center text-green-600">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">Verified</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-yellow-600">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">Pending Verification</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Account Dates</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500">Created</p>
                      <p className="text-sm text-gray-900">{formatDate(user.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Last Updated</p>
                      <p className="text-sm text-gray-900">{formatDate(user.updatedAt)}</p>
                    </div>
                  </div>
                </div>

                {!user.isVerified && documents.length > 0 && (
                  <button
                    onClick={() => {
                      onVerifyUser(user._id);
                      onClose();
                    }}
                    className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    Verify Account
                  </button>
                )}
              </div>
            </div>

            {/* Documents Section */}
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-3">Uploaded Documents</h4>
              {documents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {documents.map((doc, index) => (
                    <div key={doc._id || index} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center">
                            <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium text-gray-900">{doc.name}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => onViewDocument(doc)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View PDF
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="mt-2 text-gray-500">No documents uploaded</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}