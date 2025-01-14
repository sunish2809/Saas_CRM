import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
const MemberList: FC = () => {
    const navigate = useNavigate();
    const handleRowClick = (memberId: string) => {
        navigate(`/dashboard/gym/member/${memberId}`);
    };

  const members = [
    {
      id: "M001",
      name: "John Doe",
      email: "john@example.com",
      plan: "Premium",
      status: "Active",
      joinDate: "Jan 15, 2024",
      lastPayment: "$299"
    },
    // Add more member data
  ];

  return (
    <section id="member_list" className="p-6">
      <div className="bg-white rounded border border-neutral-200/30">
        {/* Search and Filter Header */}
        <div className="p-6 border-b border-neutral-200/30">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <input
                type="search"
                placeholder="Search members..."
                className="px-4 py-2 border border-neutral-200/30 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select className="px-4 w-40 py-2 border border-neutral-200/30 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
                <option>Expired</option>
              </select>
            </div>
            {/* <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Add New Member
            </button> */}
          </div>
        </div>

        {/* Members Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Join Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody  className="divide-y divide-neutral-200/30 cursor-pointer">
              {members.map((member) => (
                <tr key={member.id} onClick={() => handleRowClick(member.id)} className="hover:bg-neutral-50">
                  <td className="px-6 py-4">{member.name}</td>
                  <td className="px-6 py-4">{member.email}</td>
                  <td className="px-6 py-4">{member.plan}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{member.joinDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-3">
                      {/* <button className="text-blue-600 hover:text-blue-800">Edit</button> */}
                      <button className="text-red-600 hover:text-red-800">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-neutral-200/30">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing 1 to 10 of 100 entries
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-neutral-200/30 rounded hover:bg-neutral-50">
                Previous
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded">1</button>
              <button className="px-3 py-1 border border-neutral-200/30 rounded hover:bg-neutral-50">
                2
              </button>
              <button className="px-3 py-1 border border-neutral-200/30 rounded hover:bg-neutral-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MemberList;