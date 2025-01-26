import axios from 'axios';
import { FC, useState } from 'react';

interface OwnerSettings {
  ownerName: string;
  email: string;
  password: string;

}

const Settings: FC = () => {
  const [settings, setSettings] = useState<OwnerSettings>({
    ownerName: '',
    email: '',
    password: '',
  });

  const requestData = {
    name:settings.ownerName,
    email:settings.ownerName,
    password:settings.password

  };
  
  const handleSave = async() => {
    // Implement save functionality
    try{
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:3000/api/owner/update-owner",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Member updated:", response.data);
      setSettings({
        ownerName:"",
        email:"",
        password:"",
      })

    }catch(error){
      console.error("Error updating member:", error);
    }
    

  };

  return (
    <section className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Owner Profile Settings */}
        <div className="bg-white rounded border border-neutral-200/30">
          <div className="p-6 border-b border-neutral-200/30">
            <h2 className="text-xl font-semibold">Owner Settings</h2>
            <p className="text-sm text-gray-500">Manage your Library</p>
          </div>

          <div className="p-6 space-y-6"> 
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                  <input
                    type="text"
                    value={settings.ownerName}
                    onChange={(e) => setSettings({...settings, ownerName: e.target.value})}
                    className="w-full px-3 py-2 border border-neutral-200/30 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({...settings, email: e.target.value})}
                    className="w-full px-3 py-2 border border-neutral-200/30 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Password Change */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Change Password</h3>
              <div className="space-y-4">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    value={settings.password}
                    onChange={(e) => setSettings({...settings, password: e.target.value})}
                    className="w-full px-3 py-2 border border-neutral-200/30 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

              </div>
            </div>

            {/* Notification Preferences */}

          </div>

          {/* Action Buttons */}
          <div className="p-6 border-t border-neutral-200/30">
            <div className="flex justify-end space-x-4">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-neutral-200/30 rounded hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Settings;