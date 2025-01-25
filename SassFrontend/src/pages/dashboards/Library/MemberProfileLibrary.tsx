


// import axios from 'axios';
// import { FC, useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';

// interface PaymentHistory {
//   amount: number;
//   paymentDate: string;
//   _id: string;
// }

// interface MemberProfile {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   joinDate: string;
//   membershipType: string;
//   status: string;
//   paymentHistory: PaymentHistory[];
//   seatNumber:number
// }

// const MemberProfileLibrary: FC = () => {
//   const { memberId } = useParams<{ memberId: string }>();
//   const [memberData, setMemberData] = useState<MemberProfile | null>(null);
//   const [status, SetStatus] = useState("")

//   useEffect(() => {
//     const fetchMemberDetails = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get(
//           `http://localhost:3000/api/library/get-member/${memberId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         setMemberData(response.data);

//         const status= memberData?.paymentHistory[0]?.paymentDate
//             ? (() => {
//                 const lastPaymentDate = new Date(
//                   memberData.paymentHistory[0].paymentDate
//                 );
//                 const expiryDate = new Date(lastPaymentDate);
//                 expiryDate.setDate(lastPaymentDate.getDate() + 30);

//                 return new Date() > expiryDate ? "Inactive" : "Active";
//               })()
//             : "Not Active";
//         SetStatus(status)
//       } catch (error) {
//         console.error('Error fetching member details:', error);
//       }
//     };

//     fetchMemberDetails();
//   }, [memberId]);

//   if (!memberData) {
//     return <p>Loading...</p>;
//   }
//   console.log(memberData)

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
//                 <p className="text-gray-500">Member ID: {memberData.seatNumber}</p>
//               </div>
//             </div>
//             <span
//               className={`px-3 py-1 rounded-full text-sm ${
//                 memberData.status === 'Active'
//                   ? 'bg-green-100 text-green-800'
//                   : 'bg-red-100 text-red-800'
//               }`}
//             >
//               {status}
//             </span>
//           </div>
//         </div>

//         {/* Member Info and Payment History */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Member Information */}
//           <div className="bg-white rounded border border-neutral-200/30 p-6">
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
//             </div>
//           </div>

//           {/* Payment History */}
//           <div className="bg-white rounded border border-neutral-200/30 p-6">
//             <h3 className="text-lg font-semibold mb-4">Payment History</h3>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-neutral-50">
//                   <tr>
//                     <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Amount</th>
//                     <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Payment Date</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-neutral-200">
//                   {memberData.paymentHistory.map((record) => (
//                     <tr key={record._id}>
//                       <td className="px-4 py-2">₹{record.amount}</td>
//                       <td className="px-4 py-2">{new Date(record.paymentDate).toLocaleDateString()}</td>
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

// export default MemberProfileLibrary;




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
  seatNumber:number;
}

const MemberProfileLibrary: FC = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const [memberData, setMemberData] = useState<MemberProfile | null>(null);
  const [status, SetStatus] = useState("")

  useEffect(() => {
    const fetchMemberDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:3000/api/library/get-member/${memberId}`,
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
    return <p>Loading...</p>;
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
                <p className="text-gray-500">Member ID: {memberData.seatNumber}</p>
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

export default MemberProfileLibrary;
