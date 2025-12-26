import axios from 'axios';
import { FC, useState } from 'react';
import { Save, X, Eye, EyeOff } from 'lucide-react';

const Settings: FC = () => {
  const [settings, setSettings] = useState({
    ownerName: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Validation for Save Changes button - ownerName and email are required, password is optional
  const isFormValid = settings.ownerName.trim() !== '' && settings.email.trim() !== '';

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Only include password if it's provided
      const updateData: any = {
        name: settings.ownerName,
        email: settings.email,
      };
      
      if (settings.password.trim() !== '') {
        if (settings.password.length < 6) {
          setMessage('Password must be at least 6 characters!');
          setTimeout(() => setMessage(''), 3000);
          setLoading(false);
          return;
        }
        updateData.password = settings.password;
      }
      
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/owner/update-owner`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setMessage('Settings saved successfully!');
      setSettings({
        ownerName: '',
        email: '',
        password: '',
      });
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating settings:', error);
      setMessage('Failed to save settings. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your library profile and preferences</p>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className={`p-4 rounded-lg text-sm font-medium ${
          message.includes('successfully')
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      {/* Settings Card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Basic Information Section */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Owner Profile</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Owner Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Owner Name
              </label>
              <input
                type="text"
                value={settings.ownerName}
                onChange={(e) =>
                  setSettings({ ...settings, ownerName: e.target.value })
                }
                placeholder="Enter your full name"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) =>
                  setSettings({ ...settings, email: e.target.value })
                }
                placeholder="your.email@example.com"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Security</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={settings.password}
                onChange={(e) =>
                  setSettings({ ...settings, password: e.target.value })
                }
                placeholder="Enter new password (optional)"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Leave empty to keep current password</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setSettings({ ownerName: '', email: '', password: '' })}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>
          <button
            onClick={handleSave}
            disabled={loading || !isFormValid}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors ${
              loading || !isFormValid
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-teal-600 text-white hover:bg-teal-700'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
        <p className="text-sm text-teal-900">
          <span className="font-semibold">Tip:</span> Changes to your profile will be updated immediately. If you change your password, you'll need to log in again.
        </p>
      </div>
    </div>
  );
};

export default Settings;