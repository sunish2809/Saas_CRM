// import { FC } from 'react';
// import { useParams } from 'react-router-dom';

// interface MemberProfile {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   joinDate: string;
//   membershipType: string;
//   status: string;
//   lastPayment: string;
//   attendance: {
//     date: string;
//     checkIn: string;
//     checkOut: string;
//   }[];
//   analytics: {
//     attendanceRate: number;
//     avgDuration: string;
//     preferredTime: string;
//     lastVisit: string;
//   };
// }

// const MemberProfile: FC = () => {
//   const { memberId } = useParams<{ memberId: string }>();
  
//   // Mock data - replace with actual API call
//   const memberData: MemberProfile = {
//     id: "M001",
//     name: "John Doe",
//     email: "john@example.com",
//     phone: "+1 (555) 123-4567",
//     joinDate: "Jan 15, 2024",
//     membershipType: "Premium",
//     status: "Active",
//     lastPayment: "Feb 1, 2024",
//     attendance: [
//       { date: "2024-02-15", checkIn: "09:00 AM", checkOut: "10:30 AM" },
//       // Add more attendance records
//     ],
//     analytics: {
//       attendanceRate: 85,
//       avgDuration: "1.5 hours",
//       preferredTime: "Morning",
//       lastVisit: "2 days ago"
//     }
//   };

//   return (
//     <section className="p-6">
//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* Member Header */}
//         <div className="bg-white rounded border border-neutral-200/30">
//           <div className="p-6 flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
//                 <span className="text-2xl font-semibold text-blue-600">
//                   {memberData.name.charAt(0)}
//                 </span>
//               </div>
//               <div>
//                 <h2 className="text-2xl font-semibold">{memberData.name}</h2>
//                 <p className="text-gray-500">Member ID: {memberData.id}</p>
//               </div>
//             </div>
//             <span className={`px-3 py-1 rounded-full text-sm ${
//               memberData.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//             }`}>
//               {memberData.status}
//             </span>
//           </div>
//         </div>

//         {/* Member Info and Analytics Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Member Information */}
//           <div className="lg:col-span-1 bg-white rounded border border-neutral-200/30 p-6">
//             <h3 className="text-lg font-semibold mb-4">Member Information</h3>
//             <div className="space-y-4">
//               <div>
//                 <label className="text-sm text-gray-500">Email</label>
//                 <p>{memberData.email}</p>
//               </div>
//               <div>
//                 <label className="text-sm text-gray-500">Phone</label>
//                 <p>{memberData.phone}</p>
//               </div>
//               <div>
//                 <label className="text-sm text-gray-500">Join Date</label>
//                 <p>{memberData.joinDate}</p>
//               </div>
//               <div>
//                 <label className="text-sm text-gray-500">Membership Type</label>
//                 <p>{memberData.membershipType}</p>
//               </div>
//               <div>
//                 <label className="text-sm text-gray-500">Last Payment</label>
//                 <p>{memberData.lastPayment}</p>
//               </div>
//             </div>
//           </div>

//           {/* Member Analytics */}
//           <div className="lg:col-span-2 bg-white rounded border border-neutral-200/30 p-6">
//             <h3 className="text-lg font-semibold mb-4">Member Analytics</h3>
//             <div className="grid grid-cols-2 gap-4 mb-6">
//               <div className="p-4 bg-blue-50 rounded">
//                 <h4 className="text-sm text-gray-500">Attendance Rate</h4>
//                 <p className="text-2xl font-semibold text-blue-600">{memberData.analytics.attendanceRate}%</p>
//               </div>
//               <div className="p-4 bg-green-50 rounded">
//                 <h4 className="text-sm text-gray-500">Avg. Duration</h4>
//                 <p className="text-2xl font-semibold text-green-600">{memberData.analytics.avgDuration}</p>
//               </div>
//             </div>
            
//             {/* Attendance Chart */}
//             <div className="h-64 bg-neutral-50 rounded mb-6">
//               {/* Add your chart component here */}
//             </div>

//             {/* Recent Attendance */}
//             <h4 className="font-semibold mb-2">Recent Attendance</h4>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-neutral-50">
//                   <tr>
//                     <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Date</th>
//                     <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Check In</th>
//                     <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Check Out</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-neutral-200">
//                   {memberData.attendance.map((record, index) => (
//                     <tr key={index}>
//                       <td className="px-4 py-2">{record.date}</td>
//                       <td className="px-4 py-2">{record.checkIn}</td>
//                       <td className="px-4 py-2">{record.checkOut}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default MemberProfile;


import axios from 'axios';
import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface PaymentHistory {
  amount: number;
  paymentDate: string;
  _id: string;
}

interface MemberProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  aadharNumber: string;
  emergencyContact: string;
  gender: string;
  dateOfBirth: string;
  joinDate: string;
  membershipType: string;
  status: string;
  paymentHistory: PaymentHistory[];
  memberNumber:number;
}

const MemberProfile: FC = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const [memberData, setMemberData] = useState<MemberProfile | null>(null);
  const [status, SetStatus] = useState("")


  useEffect(() => {
    const fetchMemberDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/gym/get-member/${memberId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMemberData(response.data);

        const status= memberData?.paymentHistory[0]?.paymentDate
        ? (() => {
            const lastPaymentDate = new Date(
                memberData.paymentHistory[0].paymentDate
            );
            const expiryDate = new Date(lastPaymentDate);
            expiryDate.setDate(lastPaymentDate.getDate() + 30);

            return new Date() > expiryDate ? "Inactive" : "Active";
            })()
        : "Not Active";
        SetStatus(status)
      } catch (error) {
        console.error('Error fetching member details:', error);
      }
    };

    fetchMemberDetails();
  }, [memberId]);

  if (!memberData) {

      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      );

    
  }

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
                <p className="text-gray-500">Member ID: {memberData.memberNumber}</p>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                memberData.status === 'Active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {status}
            </span>
          </div>
        </div>

        {/* Member Info and Payment History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Member Information */}
          <div className="bg-white rounded border border-neutral-200/30 p-6">
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
                <label className="text-sm text-gray-500">Address</label>
                <p>{memberData.address}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Aadhaar Number</label>
                <p>{memberData.aadharNumber}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Emergency Contact</label>
                <p>{memberData.emergencyContact}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Gender</label>
                <p>{memberData.gender}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Date of Birth</label>
                <p>{new Date(memberData.dateOfBirth).toLocaleDateString()}</p>
              </div>
              {/* <div>
                <label className="text-sm text-gray-500">Join Date</label>
                <p>{new Date(memberData.createdAt).toLocaleDateString()}</p>
              </div> */}
              <div>
                <label className="text-sm text-gray-500">Membership Type</label>
                <p>{memberData.membershipType}</p>
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-white rounded border border-neutral-200/30 p-6">
            <h3 className="text-lg font-semibold mb-4">Payment History</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Amount</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Payment Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {memberData.paymentHistory.map((record) => (
                    <tr key={record._id}>
                      <td className="px-4 py-2">₹{record.amount}</td>
                      <td className="px-4 py-2">{new Date(record.paymentDate).toLocaleDateString()}</td>
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
