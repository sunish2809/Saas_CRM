import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Loader } from 'lucide-react';

const MemberProfile = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const navigate = useNavigate();
  const [memberData, setMemberData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/gym/get-member/${memberId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setMemberData(response.data);
      } catch (error) {
        console.error('Error fetching member data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (memberId) {
      fetchMemberData();
    }
  }, [memberId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 text-orange-600 animate-spin" />
          <p className="text-gray-600">Loading member details...</p>
        </div>
      </div>
    );
  }

  if (!memberData) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600 mb-4">Member not found</p>
        <button
          onClick={() => navigate('/dashboard/gym/members')}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          Back to Members
        </button>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatus = () => {
    if (!memberData.paymentHistory[0]?.paymentDate) return 'Not Active';
    const lastPaymentDate = new Date(memberData.paymentHistory[0].paymentDate);
    const expiryDate = new Date(lastPaymentDate);
    expiryDate.setDate(lastPaymentDate.getDate() + 30);
    return new Date() > expiryDate ? 'Inactive' : 'Active';
  };

  const status = getStatus();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/dashboard/gym/members')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Member Profile</h1>
          <p className="text-gray-600 mt-1">View and manage member details</p>
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
            {getInitials(memberData.name)}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{memberData.name}</h2>
            <p className="text-gray-600 mt-1">ID: {memberData.seatNumber}</p>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                status === 'Active'
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : 'bg-red-50 text-red-700 border-red-200'
              }`}>
                {status}
              </span>
              <span className="text-sm text-gray-600">
                {memberData.membershipType || 'N/A'} Plan
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-5">Personal Information</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Email</p>
              <p className="text-gray-900 font-medium">{memberData.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Phone</p>
              <p className="text-gray-900 font-medium">{memberData.phone || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Date of Birth</p>
              <p className="text-gray-900 font-medium">
                {memberData.dateOfBirth ? new Date(memberData.dateOfBirth).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Gender</p>
              <p className="text-gray-900 font-medium">{memberData.gender || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Address</p>
              <p className="text-gray-900 font-medium">{memberData.address || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Membership Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-5">Membership Information</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Membership Type</p>
              <p className="text-gray-900 font-medium">{memberData.membershipType || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Join Date</p>
              <p className="text-gray-900 font-medium">
                {memberData.createdAt ? new Date(memberData.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <p className={`font-medium ${status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                {status}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Emergency Contact</p>
              <p className="text-gray-900 font-medium">{memberData.emergencyContact || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-5">Payment History</h3>
        {memberData.paymentHistory && memberData.paymentHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {memberData.paymentHistory.map((payment: any, idx: number) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {new Date(payment.paymentDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      ₹{payment.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                        Completed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 text-sm">No payment history available</p>
        )}
      </div>

      {/* Additional Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-5">Additional Information</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Aadhar Number</p>
            <p className="text-gray-900 font-medium">{memberData.aadharNumber || 'N/A'}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total Payments</p>
            <p className="text-gray-900 font-medium">
              ₹{memberData.paymentHistory?.reduce((sum: number, p: any) => sum + p.amount, 0).toLocaleString() || '0'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberProfile;