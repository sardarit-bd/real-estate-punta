export default function DangerZone() {
  return (
    <div className="mt-6 bg-white rounded-xl shadow-sm border border-red-200">
      <div className="px-6 py-4 border-b border-red-200">
        <h3 className="font-semibold text-red-800">Danger Zone</h3>
        <p className="text-sm text-red-600 mt-1">
          Irreversible actions - proceed with caution
        </p>
      </div>
      
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="font-medium text-gray-900">Delete Account</p>
            <p className="text-sm text-gray-600 mt-1">
              Permanently delete your account and all associated data
            </p>
          </div>
          <button
            type="button"
            onClick={() => console.log('Delete account')}
            className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}