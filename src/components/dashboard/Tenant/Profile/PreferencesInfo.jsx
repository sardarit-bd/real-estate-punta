import { useState } from "react";

export function PreferencesInfo({ preferences, onUpdate }) {
  const [localPrefs, setLocalPrefs] = useState(preferences);

  const handleToggle = (key) => {
    const updated = { ...localPrefs, [key]: !localPrefs[key] };
    setLocalPrefs(updated);
    onUpdate({ preferences: updated });
  };

  const notificationOptions = [
    { key: 'notifications', label: 'Push Notifications', description: 'Receive app notifications' },
    { key: 'emailUpdates', label: 'Email Updates', description: 'Receive email newsletters' },
    { key: 'smsAlerts', label: 'SMS Alerts', description: 'Important alerts via SMS' },
    { key: 'autoPay', label: 'Auto Pay', description: 'Automatically pay rent each month' }
  ];

  return (
    <div className="space-y-6">
      {/* Notification Preferences */}
      <div>
        <h3 className="font-medium text-gray-900 mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          {notificationOptions.map((option) => (
            <div key={option.key} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{option.label}</p>
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>
              <button
                onClick={() => handleToggle(option.key)}
                className={`w-12 h-6 rounded-full transition-colors ${localPrefs[option.key] ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${localPrefs[option.key] ? 'translate-x-7' : 'translate-x-1'}`}></div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Communication Preferences */}
      <div className="border rounded-lg p-6">
        <h3 className="font-medium text-gray-900 mb-4">Communication Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input type="radio" id="email" name="communication" defaultChecked className="mr-3" />
            <label htmlFor="email" className="flex-1">
              <p className="font-medium text-gray-900">Email Communication</p>
              <p className="text-sm text-gray-600">Receive all updates via email</p>
            </label>
          </div>
          <div className="flex items-center">
            <input type="radio" id="mixed" name="communication" className="mr-3" />
            <label htmlFor="mixed" className="flex-1">
              <p className="font-medium text-gray-900">Mixed Communication</p>
              <p className="text-sm text-gray-600">Email for updates, SMS for urgent alerts</p>
            </label>
          </div>
          <div className="flex items-center">
            <input type="radio" id="minimal" name="communication" className="mr-3" />
            <label htmlFor="minimal" className="flex-1">
              <p className="font-medium text-gray-900">Minimal Communication</p>
              <p className="text-sm text-gray-600">Only essential notifications</p>
            </label>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="border rounded-lg p-6">
        <h3 className="font-medium text-gray-900 mb-4">Privacy Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Profile Visibility</p>
              <p className="text-sm text-gray-600">Who can see your profile</p>
            </div>
            <select className="px-4 py-2 border rounded-lg">
              <option>Only Landlords</option>
              <option>All Users</option>
              <option>Private</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Data Sharing</p>
              <p className="text-sm text-gray-600">Share data for analytics</p>
            </div>
            <button className="w-12 h-6 bg-gray-300 rounded-full">
              <div className="w-5 h-5 bg-white rounded-full transform translate-x-1"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}