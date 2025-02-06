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
        `${import.meta.env.VITE_BACKEND_URL}/api/owner/update-owner`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
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
    <section style={{height:"100vh"}} className="p-6">
      <div className="max-w-4xl shadow-lg mx-auto space-y-6">
        {/* Owner Profile Settings */}
        <div className="bg-[#D0DDD0] rounded border border-neutral-200/30">
          <div className="p-6 border-b border-neutral-200/30">
            <h2 className="text-xl text-[#727D73] font-semibold">Owner Settings</h2>
            <p className="text-sm text-[#727D73] ">Manage your Library</p>
          </div>

          <div className="p-6 space-y-6"> 
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg text-[#727D73] font-medium">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#727D73] mb-1">Owner Name</label>
                  <input
                    type="text"
                    value={settings.ownerName}
                    onChange={(e) => setSettings({...settings, ownerName: e.target.value})}
                    className="mt-1 block bg-[#D0DDD0] w-full rounded-md border-[#727D73] shadow-sm focus:border-[#727D73] focus:ring-[#727D73]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#727D73] mb-1">Email</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({...settings, email: e.target.value})}
                    className="mt-1 block bg-[#D0DDD0] w-full rounded-md border-[#727D73] shadow-sm focus:border-[#727D73] focus:ring-[#727D73]"
                  />
                </div>
              </div>
            </div>

            {/* Password Change */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-[#727D73]">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#727D73] mb-1">New Password</label>
                  <input
                    type="password"
                    value={settings.password}
                    onChange={(e) => setSettings({...settings, password: e.target.value})}
                    className="mt-1 block bg-[#D0DDD0] w-full rounded-md border-[#727D73] shadow-sm focus:border-[#727D73] focus:ring-[#727D73]"
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
                className="px-4 py-2 text-sm font-medium text-white bg-[#727D73] rounded hover:bg-[#AAB99A]"
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