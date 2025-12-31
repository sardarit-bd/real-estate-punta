import { Shield, Lock } from 'lucide-react';

export default function SecurityCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
        <Shield className="h-5 w-5 mr-2" />
        Account Security
      </h3>
      
      <div className="space-y-4">
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="font-medium text-blue-800">Email Verification</p>
          <p className="text-sm text-blue-700 mt-1">Your email is verified</p>
        </div>
        
        <button
          type="button"
          onClick={() => console.log('Change password')}
          className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center">
            <Lock className="h-5 w-5 text-gray-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Change Password</p>
              <p className="text-sm text-gray-600">Update your password</p>
            </div>
          </div>
          <div className="text-gray-400">→</div>
        </button>
      </div>
    </div>
  );
}