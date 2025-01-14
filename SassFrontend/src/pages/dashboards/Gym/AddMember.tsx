import { FC, FormEvent, useState } from 'react';

const AddMember: FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    membershipType: '',
    startDate: '',
    amount: '',
    emergencyContact: '',
    address: '',
    aadhar: '',
    mobile: '',
    memberNumber: ''
  });

  const [updateData, setUpdateData] = useState({
    memberNumber: '',
    package: '',
    amountPaid: ''
  });

  const [deleteData, setDeleteData] = useState({
    memberNumber: ''
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  const handleUpdateSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  const handleDeleteSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(deleteData);
  };

  return (
    <section id="add_member" className="p-6">
      <div className="max-w-4xl mx-auto bg-white rounded border border-neutral-200/30">
        <div className="p-6 border-b border-neutral-200/30">
          <h2 className="text-xl font-semibold">Add New Member</h2>
          <p className="text-sm text-gray-500">Fill in the information below to add a new gym member</p>
        </div>

        <form className="p-6 space-y-6" onSubmit={handleSubmit}>
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-neutral-200/30 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-neutral-200/30 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-neutral-200/30 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-neutral-200/30 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Number</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-neutral-200/30 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.aadhar}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-neutral-200/30 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.mobile}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input 
                  type="date" 
                  className="w-full px-3 py-2 border border-neutral-200/30 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 border border-neutral-200/30 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-neutral-200/30 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  required 
                />
              </div>
              {/* Add other form fields similarly */}
            </div>
          </div>

          {/* Membership Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Membership Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Membership Type</label>
                <select 
                  className="w-full px-3 py-2 border border-neutral-200/30 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.membershipType}
                  onChange={(e) => setFormData({...formData, membershipType: e.target.value})}
                  required
                >
                  <option value="">Select Membership</option>
                  <option value="basic">Basic (1 Month)</option>
                  <option value="standard">Standard (3 Months)</option>
                  <option value="premium">Premium (12 Months)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Member Number</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 border border-neutral-200/30 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.memberNumber}
                  onChange={(e) => setFormData({...formData, memberNumber: e.target.value})}
                  required 
                />
              </div>
              {/* Add other membership fields */}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-neutral-200/30">
            <button 
              type="button" 
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-neutral-200/30 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Member
            </button>
          </div>
        </form>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded border border-neutral-200/30">
        <div className="p-6 border-b border-neutral-200/30">
          <h2 className="text-xl font-semibold">Update Member</h2>
          <p className="text-sm text-gray-500">Fill in the information below to update member</p>
        </div>

        <form className="p-6 space-y-6" onSubmit={handleUpdateSubmit}>
          {/* Personal Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Member Number</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-neutral-200/30 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={updateData.memberNumber}
                  onChange={(e) => setUpdateData({...updateData, memberNumber: e.target.value})}
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Package</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-neutral-200/30 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={updateData.package}
                  onChange={(e) => setUpdateData({...updateData, package: e.target.value})}
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount Paid</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-neutral-200/30 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={updateData.amountPaid}
                  onChange={(e) => setUpdateData({...updateData, amountPaid: e.target.value})}
                  required 
                />
              </div>

              {/* Add other form fields similarly */}
            </div>
          </div>
          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-neutral-200/30">
            <button 
              type="button" 
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-neutral-200/30 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Update Member
            </button>
          </div>
        </form>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded border border-neutral-200/30">
        <div className="p-6 border-b border-neutral-200/30">
          <h2 className="text-xl font-semibold">Delete Member</h2>

        </div>

        <form className="p-6 space-y-6" onSubmit={handleDeleteSubmit}>
          {/* Personal Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Member Number</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-neutral-200/30 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={deleteData.memberNumber}
                  onChange={(e) => setDeleteData({...deleteData, memberNumber: e.target.value})}
                  required 
                />
              </div>


              {/* Add other form fields similarly */}
            </div>
          </div>
          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-neutral-200/30">

            <button 
              type="submit" 
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
               Delete Member
            </button>
          </div>
        </form>
      </div>

    </section>
  );
};

export default AddMember;