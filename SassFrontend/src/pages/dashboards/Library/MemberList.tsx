import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { format } from "date-fns";
import {
  UserPlusIcon,
  MagnifyingGlassIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { format, isValid } from "date-fns";


interface Member {
  id: string;
  name: string;
  memberNumber: string;
  email: string;
  phone: string;
  package: string;
  amount: number;
  paymentDate: string;
  //status: string;
  status: "Active" | "Inactive" | "Pending" | "Expired";
  joinDate: string;
  avatar: string;
}



function MemberList() {
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  // Fetch members from API
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const token = localStorage.getItem("token"); // or however you store your token
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/library/get-all-members`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the headers
            },
          }
        );
        
        const apiMembers = response.data.map((member: any) => ({
          id: member.seatNumber,
          name: member.name,
          memberNumber: member.seatNumber,
          email: member.email,
          phone: member.phone || "",
          package: member.membershipType,

          paymentDate: member.paymentHistory.length > 0
            ? (() => {
                const latestPayment = member.paymentHistory
                  .slice() // Create a shallow copy to avoid mutating the original array
                  .sort((a:any, b:any) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())[0]; // Sort by paymentDate in descending order and pick the first entry
                const parsedDate = new Date(latestPayment.paymentDate);
                return isValid(parsedDate) ? format(parsedDate, "dd/MM/yyyy") : "N/A";
              })()
            : "N/A",


          status: member.paymentHistory.length > 0
          ? (() => {
              const latestPayment = member.paymentHistory
                .slice() // Create a shallow copy to avoid mutating the original array
                .sort((a: any, b: any) => 
                  new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime()
                )[0];
              const lastPaymentDate = new Date(latestPayment.paymentDate);
              const currentDate = new Date();

              // Add 30 days to the last payment date
              const expiryDate = new Date(lastPaymentDate);
              expiryDate.setDate(lastPaymentDate.getDate() + 30);

              // Compare current date with expiry date
              return currentDate > expiryDate ? "Inactive" : "Active";
            })()
          : "Not Active", // Default if no payment history


            joinDate: member.createdAt
            ? (() => {
                const parsedDate = new Date(member.createdAt);
                return isValid(parsedDate)
                  ? format(parsedDate, "dd/MM/yyyy")
                  : "N/A";
              })()
            : "N/A", // Fallback if createdAt is not present
          
          //joinDate: "N/A", // Modify this based on your data
          avatar: `https://avatar.iran.liara.run/public/boy?username=${member.name.replace(
            " ",
            ""
          )}`,
        }));
        setMembers(apiMembers);
      const inactiveMembers = apiMembers.filter(
        (member :any) => member.status === "Inactive"
      );
      if (inactiveMembers.length > 0) {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/send-sms`,
          { members: inactiveMembers },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      }
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };

    fetchMembers();
  }, []);

  // Status Badge Component
  const StatusBadge = ({ status }: { status: Member["status"] }) => {
    const statusStyles: Record<Member["status"], string> = {
      Active: "bg-green-100 text-green-800",
      Inactive: "bg-gray-100 text-gray-800",
      Pending: "bg-yellow-100 text-yellow-800",
      Expired: "bg-red-100 text-red-800",
    };
  
    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[status]}`}>
        {status}
      </span>
    );
  };
  

  // Filtering
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.memberNumber.includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPackage =
      selectedPackage === "all" || member.package === selectedPackage;
    const matchesStatus =
      selectedStatus === "all" || member.status === selectedStatus;

    return matchesSearch && matchesPackage && matchesStatus;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMembers = filteredMembers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

  const handleDelete = async (deleteSeatNumber: any) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/get-started");
        return;
      }

      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/library/delete-member/${deleteSeatNumber}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // Update the state to remove the deleted member
      setMembers((prevMembers) =>
        prevMembers.filter((member) => member.memberNumber !== deleteSeatNumber)
      );


    } catch (error: any) {
      console.error("Error deleting member:", error);

    }
  };

  return (
    <div className="p-6" style={{height:"100vh"}}>
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-[#727D73]">Members List</h2>
          <p className="text-[#727D73]">Manage library members</p>
        </div>
        <button
          onClick={() => navigate("/dashboard/library/add-member")}
          className="flex items-center px-4 py-2 bg-[#727D73] text-white rounded-lg hover:bg-[#727D73]"
        >
          <UserPlusIcon className="w-5 h-5 mr-2" />
          Add Member
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Search Input */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="search"
              placeholder="Search members..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#727D73] focus:border-[#727D73]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {/* Filters */}
        <select
          className="px-4 w-40 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#727D73] focus:border-[#727D73]"
          value={selectedPackage}
          onChange={(e) => setSelectedPackage(e.target.value)}
        >
          <option className="text-[#727D73]" value="all">All Packages</option>
          <option className="text-[#727D73]" value="Basic">Basic</option>
          <option className="text-[#727D73]" value="Standard">Standard</option>
          <option className="text-[#727D73]" value="Premium">Premium</option>
          <option className="text-[#727D73]" value="Annual">Annual</option>
        </select>
        <select
          className="px-4 w-40 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#727D73] focus:border-[#727D73]"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Pending">Not Active</option>
          {/* <option value="Expired">Expired</option> */}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-lg">
        {/* ...Table Code Here */}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium bg-[#D0DDD0] text-[#727D73] uppercase tracking-wider">
                Member
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium bg-[#D0DDD0] text-[#727D73] uppercase tracking-wider">
                Seat Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium bg-[#D0DDD0] text-[#727D73] uppercase tracking-wider">
                Package
              </th>
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th> */}
              <th className="px-6 py-3 text-left text-xs font-medium bg-[#D0DDD0] text-[#727D73] uppercase tracking-wider">
                Last Payment Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium bg-[#D0DDD0] text-[#727D73] uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium bg-[#D0DDD0] text-[#727D73] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentMembers.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50 cursor-pointer bg-[#D0DDD0]" onClick={() => navigate(`${member.id}`)}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={member.avatar}
                        alt=""
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-[#727D73]">
                        {member.name}
                      </div>
                      <div className="text-sm text-[#727D73]">
                        {member.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#727D73]">
                  {member.memberNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#727D73]">
                  {member.package}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#727D73]">
                  {member.paymentDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={member.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setSelectedMemberId(member.memberNumber);
                        setShowDeleteModal(true);
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {/* ...Pagination Code Here */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-[#727D73]">
          Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
          <span className="font-medium">
            {Math.min(indexOfLastItem, filteredMembers.length)}
          </span>{" "}
          of <span className="font-medium">{filteredMembers.length}</span>{" "}
          results
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed bg-[#727D73] text-white"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 border rounded-lg ${
                currentPage === page
                  ? "bg-indigo-50 text-[#727D73] text-[#727D73]"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <TrashIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Member
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this member? This action
                        cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    // Add delete logic here
                    handleDelete(selectedMemberId);
                    setShowDeleteModal(false);
                  }}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MemberList;
