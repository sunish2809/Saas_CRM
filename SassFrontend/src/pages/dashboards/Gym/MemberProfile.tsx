import { FC } from 'react';
import { useParams } from 'react-router-dom';

interface MemberProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  membershipType: string;
  status: string;
  lastPayment: string;
  attendance: {
    date: string;
    checkIn: string;
    checkOut: string;
  }[];
  analytics: {
    attendanceRate: number;
    avgDuration: string;
    preferredTime: string;
    lastVisit: string;
  };
}

const MemberProfile: FC = () => {
  const { memberId } = useParams<{ memberId: string }>();
  
  // Mock data - replace with actual API call
  const memberData: MemberProfile = {
    id: "M001",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    joinDate: "Jan 15, 2024",
    membershipType: "Premium",
    status: "Active",
    lastPayment: "Feb 1, 2024",
    attendance: [
      { date: "2024-02-15", checkIn: "09:00 AM", checkOut: "10:30 AM" },
      // Add more attendance records
    ],
    analytics: {
      attendanceRate: 85,
      avgDuration: "1.5 hours",
      preferredTime: "Morning",
      lastVisit: "2 days ago"
    }
  };

  return (
    <section className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Member Header */}
        <div className="bg-white rounded border border-neutral-200/30">
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-semibold text-blue-600">
                  {memberData.name.charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-semibold">{memberData.name}</h2>
                <p className="text-gray-500">Member ID: {memberData.id}</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${
              memberData.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {memberData.status}
            </span>
          </div>
        </div>

        {/* Member Info and Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Member Information */}
          <div className="lg:col-span-1 bg-white rounded border border-neutral-200/30 p-6">
            <h3 className="text-lg font-semibold mb-4">Member Information</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <p>{memberData.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Phone</label>
                <p>{memberData.phone}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Join Date</label>
                <p>{memberData.joinDate}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Membership Type</label>
                <p>{memberData.membershipType}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Last Payment</label>
                <p>{memberData.lastPayment}</p>
              </div>
            </div>
          </div>

          {/* Member Analytics */}
          <div className="lg:col-span-2 bg-white rounded border border-neutral-200/30 p-6">
            <h3 className="text-lg font-semibold mb-4">Member Analytics</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-blue-50 rounded">
                <h4 className="text-sm text-gray-500">Attendance Rate</h4>
                <p className="text-2xl font-semibold text-blue-600">{memberData.analytics.attendanceRate}%</p>
              </div>
              <div className="p-4 bg-green-50 rounded">
                <h4 className="text-sm text-gray-500">Avg. Duration</h4>
                <p className="text-2xl font-semibold text-green-600">{memberData.analytics.avgDuration}</p>
              </div>
            </div>
            
            {/* Attendance Chart */}
            <div className="h-64 bg-neutral-50 rounded mb-6">
              {/* Add your chart component here */}
            </div>

            {/* Recent Attendance */}
            <h4 className="font-semibold mb-2">Recent Attendance</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Date</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Check In</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Check Out</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {memberData.attendance.map((record, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2">{record.date}</td>
                      <td className="px-4 py-2">{record.checkIn}</td>
                      <td className="px-4 py-2">{record.checkOut}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MemberProfile;